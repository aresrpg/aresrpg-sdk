import { TransactionBlock } from '@mysten/sui.js/transactions'

import { sanitized } from '../sanitize.js'

/** @param {import("../../types.js").Context} context */
export function merge_items({ types }) {
  return ({
    tx = new TransactionBlock(),
    kiosk,
    kiosk_cap,
    target_item_id,
    items_ids,
  }) => {
    const txb = sanitized(tx)

    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::item_manager::merge_items`,
      arguments: [
        txb._.object(kiosk),
        txb._.object(kiosk_cap),
        tx.object(types.ITEM_PROTECTED_POLICY),
        txb._.pure(target_item_id),
        tx.makeMoveVec({
          objects: items_ids.map(id => tx.pure.id(id)),
          type: `0x2::object::ID`,
        }),
        tx.object(types.VERSION),
      ],
    })

    return tx
  }
}
