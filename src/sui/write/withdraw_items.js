import { Transaction } from '@mysten/sui/transactions'

import { object_or_ref } from '../object_or_ref.js'

/** @param {import("../../../types.js").Context} context */
export function withdraw_items({ types }) {
  return ({ tx = new Transaction(), kiosk_id, kiosk_cap, item_ids }) => {
    const kiosk_id_ref = object_or_ref(tx, kiosk_id)
    const kiosk_cap_ref = object_or_ref(tx, kiosk_cap)

    item_ids.forEach(item_id => {
      tx.moveCall({
        target: `${types.LATEST_PACKAGE_ID}::item_manager::withdraw`,
        arguments: [
          kiosk_id_ref,
          kiosk_cap_ref,
          tx.object(types.ITEM_POLICY),
          tx.pure.id(item_id),
          tx.object(types.VERSION),
        ],
      })
    })

    return tx
  }
}
