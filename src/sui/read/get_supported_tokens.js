import { SUPPORTED_TOKENS } from '../supported_tokens.js'

/** @return {Promise<import("@mysten/sui/client").CoinStruct[]>} */
async function get_all_coins({
  sui_client,
  type,
  address,
  cursor = null,
  result = [],
}) {
  const { data, hasNextPage, nextCursor } = await sui_client.getCoins({
    owner: address,
    coinType: type,
    cursor,
  })
  result.push(data)
  if (hasNextPage)
    return get_all_coins({
      sui_client,
      type,
      address,
      result,
      cursor: nextCursor,
    })
  return result.flat(Infinity)
}

/** @param {import("../../../types.js").Context} context */
export function get_supported_tokens(context) {
  const { sui_client, network } = context
  /** @type {(address: string) => Promise<import("../../../types.js").SuiToken[]>} */
  return async address =>
    // @ts-ignore
    Promise.all(
      Object.entries(SUPPORTED_TOKENS(network)).map(
        async ([token_type, token]) => {
          const coins = await get_all_coins({
            sui_client,
            type: token_type,
            address,
          })

          if (!coins.length) return null

          return {
            ...token,
            amount: coins.reduce(
              (acc, { balance }) => acc + BigInt(balance),
              0n,
            ),
            ids: coins.map(({ coinObjectId }) => coinObjectId),
          }
        },
      ),
    ).then(tokens => tokens.filter(Boolean))
}
