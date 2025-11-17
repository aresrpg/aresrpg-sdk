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

/**
 * @typedef {Object} Box3
 * @property {boolean} isBox3
 * @property {{x: number, y: number, z: number}} min
 * @property {{x: number, y: number, z: number}} max
 */

/**
 * @typedef {Object} Vector2
 * @property {number} x
 * @property {number} z
 */

/**
 * @typedef {Object} ChunkMetadata
 * @property {string} [chunkKey]
 * @property {Box3} bounds
 * @property {number} [margin]
 * @property {boolean} [isEmpty]
 */

/**
 * @typedef {Object} Chunk
 * @property {ChunkMetadata} metadata
 * @property {Uint16Array} rawdata
 */

/**
 * @typedef {Object} ChunkBuffer
 * @property {Vector2} pos
 * @property {Uint16Array} content
 */

/**
 * Optimized run-length encoding using a single TypedArray and minimal allocations
 * @param {Uint16Array} raw_data
 * @returns {Uint16Array}
 */
function encode_run_length(raw_data) {
  if (raw_data.length === 0) return new Uint16Array()

  // Pre-allocate worst case size (each value different from previous)
  const result = new Uint16Array(raw_data.length * 2)
  let write_index = 0
  let [current_value] = raw_data
  let count = 1

  for (let i = 1; i < raw_data.length; i++) {
    if (raw_data[i] === current_value && count < 65535) {
      count++
      continue
    }

    result[write_index++] = count
    result[write_index++] = current_value
    current_value = raw_data[i]
    count = 1
  }

  // Write final run
  result[write_index++] = count
  result[write_index++] = current_value

  return new Uint16Array(result.buffer, 0, write_index)
}

/**
 * Creates an optimized metadata buffer for the chunks
 * @param {Chunk[]} chunks
 * @returns {Uint8Array}
 */
function create_metadata_buffer(chunks) {
  const metadata = chunks.map((chunk) => ({
    k: chunk.metadata.chunkKey,
    b: { n: chunk.metadata.bounds.min, x: chunk.metadata.bounds.max },
    m: chunk.metadata.margin,
    l: chunk.rawdata?.length || 0,
  }))
  return new TextEncoder().encode(JSON.stringify(metadata))
}

/**
 * Combines chunk data into a single Uint16Array efficiently
 * @param {Chunk[]} chunks
 * @param {number} total_length
 * @returns {Uint16Array}
 */
function combine_chunks(chunks, total_length) {
  const combined = new Uint16Array(total_length)
  let offset = 0

  for (const chunk of chunks) {
    combined.set(chunk.rawdata ?? [], offset)
    offset += chunk.rawdata?.length ?? 0
  }

  return combined
}

/**
 * Compresses a column of chunks with optimized memory usage
 * @param {Chunk[]} chunks
 * @returns {Promise<string>}
 */
export async function compress_chunk_column(chunks) {
  if (chunks.length === 0) return ''

  // Sum total length in a single pass
  const total_length = chunks.reduce(
    (sum, chunk) => sum + (chunk.rawdata?.length || 0),
    0
  )

  // Create metadata and combine chunks
  const metadata_buffer = create_metadata_buffer(chunks)
  const combined_data = combine_chunks(chunks, total_length)

  // Run length encode the combined data
  const rle_data = encode_run_length(combined_data)

  // Create the final buffer in a single concatenation
  const final_buffer = Buffer.concat([
    Buffer.from(new Uint32Array([metadata_buffer.length]).buffer),
    metadata_buffer,
    Buffer.from(rle_data.buffer, 0, rle_data.byteLength),
  ])

  // Compress in one pass
  const compressed = await new Response(
    new Blob([final_buffer]).stream().pipeThrough(new CompressionStream('gzip'))
  ).arrayBuffer()

  return Buffer.from(compressed).toString('base64')
}

/**
 * Optimized run-length decoding using pre-allocated buffer
 * @param {Uint16Array} encoded_data
 * @returns {Uint16Array}
 */
function decode_run_length(encoded_data) {
  if (encoded_data.length === 0) return new Uint16Array()

  // Calculate total length in a single pass
  let total_length = 0
  for (let i = 0; i < encoded_data.length; i += 2) {
    total_length += encoded_data[i]
  }

  // Pre-allocate final array
  const result = new Uint16Array(total_length)
  let write_index = 0

  // Decode in a single pass without intermediate arrays
  for (let i = 0; i < encoded_data.length; i += 2) {
    const count = encoded_data[i]
    const value = encoded_data[i + 1]
    result.fill(value, write_index, write_index + count)
    write_index += count
  }

  return result
}

/**
 * Decompresses a base64 encoded chunk column back into an array of chunks
 * @param {string} compressed_payload
 * @returns {Promise<Chunk[]>}
 */
export async function decompress_chunk_column(compressed_payload) {
  if (!compressed_payload) return []

  // Decompress the gzipped data
  const compressed_buffer = Buffer.from(compressed_payload, 'base64')
  const decompressed_buffer = await new Response(
    new Blob([compressed_buffer])
      .stream()
      .pipeThrough(new DecompressionStream('gzip'))
  ).arrayBuffer()

  const decompressed_data = new Uint8Array(decompressed_buffer)

  // Extract metadata length and content
  const [metadata_length] = new Uint32Array(decompressed_buffer, 0, 1)
  const metadata_json = new TextDecoder().decode(
    decompressed_data.slice(4, 4 + metadata_length)
  )
  const metadata_list = JSON.parse(metadata_json)

  // Get the RLE encoded data
  const data_buffer = decompressed_data.slice(4 + metadata_length)
  const combined_data = decode_run_length(new Uint16Array(data_buffer.buffer))

  // Reconstruct chunks
  let offset = 0
  return metadata_list.map((meta) => {
    const chunk_data = combined_data.slice(offset, offset + meta.l)
    offset += meta.l

    return {
      rawdata: chunk_data,
      metadata: {
        chunkKey: meta.k,
        bounds: {
          isBox3: true,
          min: meta.b.n,
          max: meta.b.x,
        },
        margin: meta.m,
      },
    }
  })
}
