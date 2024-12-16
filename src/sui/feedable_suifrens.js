import { MIST_PER_SUI } from '@mysten/sui/utils'
import { BigNumber as BN } from 'bignumber.js'

function mists_to_sui(balance) {
  return new BN(balance).dividedBy(MIST_PER_SUI.toString()).toNumber()
}

function get_divide_factor(element) {
  if (element === 'wisdom') return 5
  if (element === 'vitality') return 1.4
  return 2
}

export function get_suifren_stats({ stomach = 0, element = '' }) {
  const divide_factor = get_divide_factor(element)
  const feed_level = mists_to_sui(stomach)
  const stat_value = Math.floor(feed_level / divide_factor)

  return {
    [element]: stat_value,
    feed_level,
    food_name: 'Sui',
    required_food: 1,
    max_feed_level: 100,
  }
}
