import spiral from 'spiralloop'

export const CHUNK_SIZE = 500

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
