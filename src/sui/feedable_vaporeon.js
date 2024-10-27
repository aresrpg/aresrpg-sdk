import { BigNumber as BN } from 'bignumber.js'

function from_decimal(balance, decimal) {
  return BN(balance).dividedBy(BN(10).pow(decimal)).toNumber()
}

export function get_vaporeon_stats(context) {
  return ({ stomach = 0, name }) => {
    const feed_level = from_decimal(
      stomach,
      context.supported_tokens[context.HSUI].decimal,
    )
    const shiny = name.includes('shiny')

    return {
      chance: feed_level / 5,
      feed_level,
      max_feed_level: 500,
      food_name: 'Hsui',
      required_food: 5,
      ...(shiny && { movement: 1 }),
    }
  }
}
