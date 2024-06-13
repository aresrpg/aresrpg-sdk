import { MIST_PER_SUI } from '@mysten/sui/utils'
import { BigNumber as BN } from 'bignumber.js'

import { get_pet_feed_value } from './read/get_pet_feed_value.js'
import { get_suifren_object_accessory } from './read/get_suifren_accessories.js'

function mists_to_sui(balance) {
  return BN(balance).dividedBy(MIST_PER_SUI.toString()).toNumber()
}

function get_element_from_hex(hex_color) {
  switch (hex_color) {
    case '#42FF00':
    case '#6B956C':
      return 'agility'
    case '#707070':
    case '#A17E52':
      return 'strength'
    case '#5E44FF':
    case '#AC90F8':
      return 'wisdom'
    case '#6FBBEE':
    case '#ADC0F4':
    case '#AEE0F5':
    case '#4FCAC0':
      return 'chance'
    case '#FF008A':
    case '#C75151':
      return 'vitality'
    case '#DA8E2F':
    case '#FCE370':
    case '#FF5C00':
      return 'intelligence'
    default:
      return 'chance'
  }
}

function get_divide_factor(powerfull, element) {
  if (element === 'wisdom') return powerfull ? 3 : 5
  if (element === 'vitality') return powerfull ? 1.1 : 1.4
  return powerfull ? 1.5 : 2
}

export async function get_suifren_stats(context, suifren) {
  const accessory = await get_suifren_object_accessory(context)(suifren.id)
  const { last_feed, stomach } = await get_pet_feed_value(context)(suifren.id)
  const element = get_element_from_hex(suifren.attributes[1])
  // I just like this object :D #basecamp
  const powerfull = accessory === 'bonsoir shark pote doll'
  // having the shark doll allows more stats on the fren
  const divide_factor = get_divide_factor(powerfull, element)
  const feed_level = mists_to_sui(stomach)
  const stat_value = Math.floor(feed_level / divide_factor)

  return {
    [element]: stat_value,
    last_feed,
    feed_level,
  }
}
