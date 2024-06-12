import { Transaction } from '@mysten/sui/transactions'

/** @param {import("../../../types.js").Context} context */
export function craft_start({ types }) {
  return ({ tx = new Transaction(), recipe }) => {
    return tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::item_recipe::start_craft`,
      arguments: [tx.object(recipe), tx.object(types.VERSION)],
    })
  }
}
