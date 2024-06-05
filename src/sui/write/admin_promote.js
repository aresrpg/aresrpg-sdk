import { Transaction } from '@mysten/sui/transactions'

/** @param {import("../../../types.js").Context} context */
export function admin_promote({ types }) {
  return ({ tx = new Transaction(), recipient }) => {
    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::admin::admin_promote_address`,
      arguments: [tx.object(types.ADMIN_CAP), tx.pure.address(recipient)],
    })

    return tx
  }
}
