import { Transaction } from '@mysten/sui/transactions'

/** @param {import("../../../types.js").Context} context */
export function admin_delete_admin_cap({ types }) {
  return ({ tx = new Transaction(), admin_cap }) => {
    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::admin::delete_admin_cap`,
      arguments: [tx.object(admin_cap)],
    })

    return tx
  }
}
