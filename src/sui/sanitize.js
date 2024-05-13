/** @typedef {import("@mysten/sui.js/transactions").TransactionBlock} TransactionBlock */

/** @param {TransactionBlock} tx */
export function sanitized(tx) {
  const sanitized = {
    object: unkown => {
      if (typeof unkown === 'object') return unkown
      return tx.object(unkown)
    },
    pure: unkown => {
      if (typeof unkown === 'object') return unkown
      return tx.pure(unkown)
    },
  }

  return Object.assign(tx, { _: sanitized })
}
