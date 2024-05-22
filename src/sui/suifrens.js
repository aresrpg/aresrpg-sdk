import { MIST_PER_SUI } from '@mysten/sui.js/utils'
import BN from 'bignumber.js'

import { get_pet_feed_value } from './read/get_pet_feed_value.js'
import { get_suifren_object_accessory } from './read/get_suifren_accessories.js'

function mists_to_sui(balance) {
  // @ts-ignore
  return BN(balance).dividedBy(MIST_PER_SUI.toString()).toNumber()
}

function get_element_from_hex(hex_color) {
  hex_color = hex_color.replace('#', '')
  if (hex_color.length !== 6) return 'invalid hex color'

  const [r, g, b] = [0, 2, 4].map(i => parseInt(hex_color.slice(i, i + 2), 16))

  if (r > g && r > b && r - g < 50 && r - b < 50) return 'strength' // Check for brown tones
  return g > r && g > b
    ? 'agility'
    : b > r && b > g
      ? 'chance'
      : r > g && r > b
        ? 'intelligence'
        : 'strength'
}

export async function get_suifren_stats(context, suifren) {
  const accessory = await get_suifren_object_accessory(context)(suifren.id)
  const { last_feed, stomach } = await get_pet_feed_value(context)(suifren.id)
  const element = get_element_from_hex(suifren.attributes[1])
  // I just like this object :D #basecamp
  const powerfull = accessory === 'bonsoir shark pote doll'
  // having the shark doll allows more stats on the fren
  const divide_factor = powerfull ? 1.5 : 2
  const feed_level = mists_to_sui(stomach)
  const stat_value = Math.floor(feed_level / divide_factor)

  return {
    [element]: stat_value,
    last_feed,
    feed_level,
  }
}
