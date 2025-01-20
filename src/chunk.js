import spiral from 'spiralloop'
import { deflate, inflate } from 'pako'

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

export function compress_chunk({ chunkKey, bounds, rawData, margin }) {
  // Special case for empty chunks
  if (rawData.length === 0) {
    return {
      chunk_key: chunkKey,
      bounds: {
        min: { x: bounds.min.x, y: bounds.min.y, z: bounds.min.z },
        max: { x: bounds.max.x, y: bounds.max.y, z: bounds.max.z },
      },
      compressed_data: '',
      margin,
    }
  }

  const rle_data = encode_run_length(rawData)
  const compressed_data = deflate(new Uint8Array(rle_data.buffer))

  return {
    chunk_key: chunkKey,
    bounds: {
      min: { x: bounds.min.x, y: bounds.min.y, z: bounds.min.z },
      max: { x: bounds.max.x, y: bounds.max.y, z: bounds.max.z },
    },
    compressed_data: Buffer.from(compressed_data).toString('base64'),
    margin,
  }
}

export function decompress_chunk(compressed_chunk) {
  // Special case for empty chunks
  if (!compressed_chunk.compressed_data) {
    return {
      chunkKey: compressed_chunk.chunk_key,
      bounds: {
        isBox3: true,
        min: {
          x: compressed_chunk.bounds.min.x,
          y: compressed_chunk.bounds.min.y,
          z: compressed_chunk.bounds.min.z,
        },
        max: {
          x: compressed_chunk.bounds.max.x,
          y: compressed_chunk.bounds.max.y,
          z: compressed_chunk.bounds.max.z,
        },
      },
      rawData: new Uint16Array(),
      margin: compressed_chunk.margin,
    }
  }

  const compressed_buffer = Buffer.from(
    compressed_chunk.compressed_data,
    'base64',
  )
  const decompressed_data = inflate(compressed_buffer)
  const rle_data = new Uint16Array(decompressed_data.buffer)

  return {
    chunkKey: compressed_chunk.chunk_key,
    bounds: {
      isBox3: true,
      min: {
        x: compressed_chunk.bounds.min.x,
        y: compressed_chunk.bounds.min.y,
        z: compressed_chunk.bounds.min.z,
      },
      max: {
        x: compressed_chunk.bounds.max.x,
        y: compressed_chunk.bounds.max.y,
        z: compressed_chunk.bounds.max.z,
      },
    },
    rawData: decode_run_length(rle_data),
    margin: compressed_chunk.margin,
  }
}

export function get_compression_stats(chunk, compressed_chunk) {
  const original_size = chunk.rawData.length * 2 // Uint16Array = 2 bytes per element
  const compressed_size = compressed_chunk.compressed_data
    ? Buffer.from(compressed_chunk.compressed_data, 'base64').length
    : 0

  // Handle empty chunk case
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
