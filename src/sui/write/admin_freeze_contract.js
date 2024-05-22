import { TransactionBlock } from '@mysten/sui.js/transactions'

/** @param {import("../../../types.js").Context} context */
export function admin_freeze_contract({ types }) {
  return ({ tx = new TransactionBlock() }) => {
    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::version::admin_freeze`,
      arguments: [tx.object(types.VERSION), tx.object(types.ADMIN_CAP)],
    })

    return tx
  }
}
