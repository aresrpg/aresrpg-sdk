import { Transaction } from '@mysten/sui/transactions'

/** @param {import("../../../types.js").Context} context */
export function craft_use_token_ingredient({ types }) {
  return ({ tx = new Transaction(), craft, coin, coin_type }) => {
    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::item_recipe::use_token_ingredient`,
      arguments: [coin, craft],
      typeArguments: [coin_type],
    })
  }
}
