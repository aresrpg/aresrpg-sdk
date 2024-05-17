import { TransactionBlock } from '@mysten/sui.js/transactions'

import { add_header } from '../header.js'

/** @param {import("../../types.js").Context} context */
export function admin_freeze_contract({ types }) {
  return ({ tx = new TransactionBlock() }) => {
    add_header(tx, types)

    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::version::admin_freeze`,
      arguments: [tx.object(types.VERSION), tx.object(types.ADMIN_CAP)],
    })

    return tx
  }
}
