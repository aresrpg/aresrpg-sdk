import { Transaction } from '@mysten/sui/transactions'

/** @param {import("../../../types.js").Context} context */
export function admin_delete_recipe({ types }) {
  return ({ tx = new Transaction(), admin_cap, recipe }) => {
    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::item_recipe::admin_delete_recipe`,
      arguments: [tx.object(admin_cap), tx.object(recipe)],
    })

    return tx
  }
}
