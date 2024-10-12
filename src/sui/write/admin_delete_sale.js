import { Transaction } from '@mysten/sui/transactions'

/** @param {import("../../../types.js").Context} context */
export function admin_delete_sale({ types }) {
  return ({ tx = new Transaction(), recipient, admin_cap, sale }) => {
    const [coin] = tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::item_sale::admin_delete_sale`,
      arguments: [tx.object(admin_cap), tx.object(sale)],
    })

    tx.transferObjects([coin], recipient)

    return tx
  }
}
