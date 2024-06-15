import { Transaction } from '@mysten/sui/transactions'

/** @param {import("../../../types.js").Context} context */
export function craft_prove_ingredients_used({ types }) {
  return ({ tx = new Transaction(), craft }) => {
    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::item_recipe::prove_all_ingredients_used`,
      arguments: [craft],
    })
  }
}
