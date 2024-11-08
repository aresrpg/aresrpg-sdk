import { Transaction } from '@mysten/sui/transactions'

import { object_or_ref } from '../object_or_ref.js'

/** @param {import("../../../types.js").Context} context */
export function withdraw_items({ types }) {
  return ({ tx = new Transaction(), kiosk_id, kiosk_cap, item_ids }) => {
    item_ids.forEach(item_id => {
      tx.moveCall({
        target: `${types.LATEST_PACKAGE_ID}::item_manager::withdraw`,
        arguments: [
          object_or_ref(tx, kiosk_id),
          object_or_ref(tx, kiosk_cap),
          tx.object(types.ITEM_POLICY),
          tx.pure.id(item_id),
          tx.object(types.VERSION),
        ],
      })
    })

    return tx
  }
}
