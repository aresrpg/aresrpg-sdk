function get_divide_factor(element) {
  if (element === 'wisdom') return 5
  if (element === 'vitality') return 1.4
  return 2
}

export function get_suifren_stats({ feed_percent = 0, element = '' }) {
  const divide_factor = get_divide_factor(element)
  const stat_value = Math.floor(feed_percent / divide_factor)

  return {
    [element]: stat_value,
  }
}
