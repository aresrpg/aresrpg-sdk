export function get_vaporeon_stats({ feed_percent = 0, name }) {
  const shiny = name.includes('shiny')

  return {
    chance: feed_percent / 5,
    ...(shiny && { movement: 1 }),
  }
}
