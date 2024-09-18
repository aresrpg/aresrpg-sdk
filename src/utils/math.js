export function vec2_sub(v1, v2) {
  return { x: v1.x - v2.x, y: v1.y - v2.y }
}

export function vec2_dist(v1, v2) {
  const diff = vec2_sub(v1, v2)
  return Math.sqrt(diff.x * diff.x + diff.y * diff.y)
}

export function vec2_dot(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y
}
