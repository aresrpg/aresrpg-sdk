import { Buffer } from 'buffer'

import spiral from 'spiralloop'

export const CHUNK_SIZE = 64

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

export function encode_run_length(raw_data) {
  if (raw_data.length === 0) return new Uint16Array()

  const initial_state = { result: [], current_value: raw_data[0], count: 1 }

  const final_state = raw_data.slice(1).reduce((state, value) => {
    if (value === state.current_value && state.count < 65535) {
      return { ...state, count: state.count + 1 }
    }
    return {
      result: [...state.result, state.count, state.current_value],
      current_value: value,
      count: 1,
    }
  }, initial_state)

  return new Uint16Array([
    ...final_state.result,
    final_state.count,
    final_state.current_value,
  ])
}

export function decode_run_length(encoded_data) {
  if (encoded_data.length === 0) return new Uint16Array()

  const pairs = Array.from({ length: encoded_data.length / 2 }, (_, i) => ({
    count: encoded_data[i * 2],
    value: encoded_data[i * 2 + 1],
  }))

  const decoded = pairs.flatMap(({ count, value }) => Array(count).fill(value))
  return new Uint16Array(decoded)
}

async function compress_data(data) {
  const compressed_stream = new Blob([data])
    .stream()
    .pipeThrough(new CompressionStream('gzip'))
  const buffer = await new Response(compressed_stream).arrayBuffer()
  return Buffer.from(buffer).toString('base64')
}

async function decompress_data(base64_data) {
  const compressed_buffer = Buffer.from(base64_data, 'base64')
  const decompressed_stream = new Blob([compressed_buffer])
    .stream()
    .pipeThrough(new DecompressionStream('gzip'))
  const buffer = await new Response(decompressed_stream).arrayBuffer()
  return new Uint8Array(buffer)
}

function create_metadata_buffer(chunks) {
  const metadata = chunks.map(chunk => ({
    k: chunk.chunkKey,
    b: {
      n: chunk.bounds.min,
      x: chunk.bounds.max,
    },
    m: chunk.margin,
    l: chunk.rawData.length,
  }))
  return new TextEncoder().encode(JSON.stringify(metadata))
}

export async function compress_chunk_column(chunks) {
  if (chunks.length === 0) return ''

  const metadata_buffer = create_metadata_buffer(chunks)
  const metadata_length_buffer = new Uint32Array([metadata_buffer.length])

  const combined_data = new Uint16Array(
    chunks.reduce((total, chunk) => total + chunk.rawData.length, 0),
  )

  let offset = 0
  chunks.forEach(chunk => {
    combined_data.set(chunk.rawData, offset)
    offset += chunk.rawData.length
  })

  const rle_data = encode_run_length(combined_data)
  const compressed_payload = await compress_data(
    Buffer.concat([
      Buffer.from(metadata_length_buffer.buffer),
      metadata_buffer,
      Buffer.from(rle_data.buffer),
    ]),
  )

  return compressed_payload
}

/**
 * @typedef {Object} ChunkBounds
 * @property {boolean} isBox3
 * @property {number} min
 * @property {number} max
 */

/**
 * @typedef {Object} Chunk
 * @property {string} chunkKey
 * @property {ChunkBounds} bounds
 * @property {Uint16Array} rawData
 * @property {number} margin
 */

/** @type {(compressed_payload: string) => Promise<Chunk[]>} */
export async function decompress_chunk_column(compressed_payload) {
  if (!compressed_payload) return []

  const decompressed_data = await decompress_data(compressed_payload)
  const [metadata_length] = new Uint32Array(decompressed_data.buffer, 0, 1)

  const metadata_json = new TextDecoder().decode(
    decompressed_data.slice(4, 4 + metadata_length),
  )
  const metadata_list = JSON.parse(metadata_json)

  const data_buffer = decompressed_data.slice(4 + metadata_length)
  const combined_data = decode_run_length(new Uint16Array(data_buffer.buffer))

  let offset = 0
  return metadata_list.map(meta => {
    const chunk_data = combined_data.slice(offset, offset + meta.l)
    offset += meta.l

    return {
      chunkKey: meta.k,
      bounds: {
        isBox3: true,
        min: meta.b.n,
        max: meta.b.x,
      },
      rawData: chunk_data,
      margin: meta.m,
    }
  })
}

export function get_compression_stats(chunks, compressed_payload) {
  const original_size = chunks.reduce(
    (total, chunk) => total + chunk.rawData.length * 2,
    0,
  )

  const compressed_size = compressed_payload
    ? Buffer.from(compressed_payload, 'base64').length
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
