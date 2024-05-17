import { TransactionBlock } from '@mysten/sui.js/transactions'

import { sanitized } from '../sanitize.js'

/** @param {import("../../types.js").Context} context */
export function split_item({ types }) {
  return ({
    tx = new TransactionBlock(),
    kiosk,
    kiosk_cap,
    item_id,
    amount,
  }) => {
    const txb = sanitized(tx)

    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::item_manager::split_item`,
      arguments: [
        txb._.object(kiosk),
        txb._.object(kiosk_cap),
        tx.object(types.ITEM_POLICY),
        txb._.pure(item_id),
        tx.pure.u32(amount),
        tx.object(types.VERSION),
      ],
    })

    return tx
  }
}
