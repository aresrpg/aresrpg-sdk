import { Transaction } from '@mysten/sui/transactions'

/** @param {import("../../../types.js").Context} context */
export function admin_mint_caps({ types }) {
  return ({ tx = new Transaction(), amount = 10, recipient }) => {
    Array.from({ length: amount }).forEach(() => {
      const cap = tx.moveCall({
        target: `${types.LATEST_PACKAGE_ID}::admin::admin_create_admin_cap`,
        arguments: [tx.object(types.ADMIN_CAP)],
      })
      tx.transferObjects([cap], recipient)
    })

    return tx
  }
}
