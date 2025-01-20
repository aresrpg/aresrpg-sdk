import spiral from 'spiralloop'

export const CHUNK_SIZE = 100

export function to_chunk_position(position) {
  const x = Math.floor(position.x / CHUNK_SIZE)
  const z = Math.floor(position.z / CHUNK_SIZE)

  return { x, z }
}

export function spiral_array(center, min_distance, max_distance) {
  const positions = []

  // Determine the size of the spiral needed based on maxDistance
  const size = max_distance * 2 + 1

  spiral([size, size], function (x, z) {
    // Adjust x and z to be relative to the center
    const adjusted_x = x - max_distance + center.x
    const adjusted_z = z - max_distance + center.z

    // Calculate Manhattan distance from the center
    const distance =
      Math.abs(center.x - adjusted_x) + Math.abs(center.z - adjusted_z)

    // Include positions within the specified distance range
    if (distance >= min_distance && distance <= max_distance) {
      positions.push({ x: adjusted_x, z: adjusted_z })
    }
  })

  return positions
}

export function square_array(center, max_distance) {
  const positions = []

  for (let x = center.x - max_distance; x <= center.x + max_distance; x++) {
    for (let z = center.z - max_distance; z <= center.z + max_distance; z++) {
      positions.push({ x, z })
    }
  }

  return positions
}

function encode_run_length(raw_data) {
  if (raw_data.length === 0) {
    return new Uint16Array()
  }

  const result = []
  let [current_value] = raw_data
  let count = 1

  for (let i = 1; i < raw_data.length; i++) {
    if (raw_data[i] === current_value && count < 65535) {
      count++
    } else {
      result.push(count, current_value)
      current_value = raw_data[i]
      count = 1
    }
  }
  result.push(count, current_value)

  return new Uint16Array(result)
}

function decode_run_length(encoded_data) {
  if (encoded_data.length === 0) {
    return new Uint16Array()
  }

  const result = []

  for (let i = 0; i < encoded_data.length; i += 2) {
    const count = encoded_data[i]
    const value = encoded_data[i + 1]
    result.push(...Array(count).fill(value))
  }

  return new Uint16Array(result)
}

async function compress_data(data) {
  const stream = new Blob([data]).stream()
  const compressed_stream = stream.pipeThrough(new CompressionStream('gzip'))
  const response = await new Response(compressed_stream)
  const buffer = await response.arrayBuffer()
  return Buffer.from(buffer).toString('base64')
}

async function decompress_data(base64_data) {
  const compressed_buffer = Buffer.from(base64_data, 'base64')
  const stream = new Blob([compressed_buffer]).stream()
  const decompressed_stream = stream.pipeThrough(
    new DecompressionStream('gzip'),
  )
  const response = await new Response(decompressed_stream)
  return new Uint8Array(await response.arrayBuffer())
}

export async function compress_chunk_column(chunks) {
  // Combine all rawData from the column into a single array
  const combined_data = new Uint16Array(
    chunks.reduce((total, chunk) => total + chunk.rawData.length, 0),
  )
  let offset = 0

  // Copy each chunk's rawData into the combined array
  chunks.forEach(chunk => {
    combined_data.set(chunk.rawData, offset)
    offset += chunk.rawData.length
  })

  // Compress the combined data
  const rle_data = encode_run_length(combined_data)
  const compressed_data = await compress_data(rle_data)

  // Store the length of each chunk's rawData for reconstruction
  const chunk_lengths = chunks.map(chunk => chunk.rawData.length)

  return {
    column_key: chunks[0]?.chunkKey.replace(/_\d+_/, '_column_'),
    chunks_metadata: chunks.map(chunk => ({
      chunk_key: chunk.chunkKey,
      bounds: {
        min: {
          x: chunk.bounds.min.x,
          y: chunk.bounds.min.y,
          z: chunk.bounds.min.z,
        },
        max: {
          x: chunk.bounds.max.x,
          y: chunk.bounds.max.y,
          z: chunk.bounds.max.z,
        },
      },
      margin: chunk.margin,
    })),
    chunk_lengths,
    compressed_data,
  }
}

export async function decompress_chunk_column(compressed_column) {
  if (!compressed_column.compressed_data) {
    return compressed_column.chunks_metadata.map(metadata => ({
      chunkKey: metadata.chunk_key,
      bounds: {
        isBox3: true,
        min: metadata.bounds.min,
        max: metadata.bounds.max,
      },
      rawData: new Uint16Array(),
      margin: metadata.margin,
    }))
  }

  const decompressed_data = await decompress_data(
    compressed_column.compressed_data,
  )
  const combined_data = decode_run_length(
    new Uint16Array(decompressed_data.buffer),
  )

  let offset = 0
  return compressed_column.chunks_metadata.map((metadata, index) => {
    const length = compressed_column.chunk_lengths[index]
    const chunk_data = new Uint16Array(combined_data.buffer, offset * 2, length)
    offset += length

    return {
      chunkKey: metadata.chunk_key,
      bounds: {
        isBox3: true,
        min: metadata.bounds.min,
        max: metadata.bounds.max,
      },
      rawData: chunk_data,
      margin: metadata.margin,
    }
  })
}

export function get_column_compression_stats(chunks, compressed_column) {
  const original_size = chunks.reduce(
    (total, chunk) => total + chunk.rawData.length * 2,
    0,
  )
  const compressed_size = compressed_column.compressed_data
    ? Buffer.from(compressed_column.compressed_data, 'base64').length
    : 0

  if (original_size === 0) {
    return {
      original_size_bytes: 0,
      compressed_size_bytes: compressed_size,
      compression_ratio: '1.00',
      space_saved_percentage: '0.00',
    }
  }

  return {
    original_size_bytes: original_size,
    compressed_size_bytes: compressed_size,
    compression_ratio: (original_size / compressed_size).toFixed(2),
    space_saved_percentage: (
      (1 - compressed_size / original_size) *
      100
    ).toFixed(2),
  }
}
