import { BigNumber as BN } from 'bignumber.js'

import { get_pet_feed_value } from './read/get_pet_feed_value.js'

function from_decimal(balance, decimal) {
  return BN(balance).dividedBy(BN(10).pow(decimal))
}

export async function get_vaporeon_stats(context, vaporeon) {
  const { last_feed, stomach } = await get_pet_feed_value(context)(vaporeon.id)
  const feed_level = from_decimal(
    stomach,
    context.supported_tokens[context.HSUI].decimal,
  )
  const shiny = vaporeon.name.includes('shiny')

  return {
    chance: feed_level.toNumber() / 5,
    last_feed,
    feed_level,
    max_feed_level: 500,
    food_name: 'Hsui',
    required_food: 5,
    ...(shiny && { movement: 1 }),
  }
}
