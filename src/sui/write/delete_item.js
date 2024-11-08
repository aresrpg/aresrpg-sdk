import { Transaction } from '@mysten/sui/transactions'

import { object_or_ref } from '../object_or_ref.js'

/** @param {import("../../../types.js").Context} context */
export function delete_item({ types }) {
  return ({ tx = new Transaction(), kiosk_id, kiosk_cap, item_id }) => {
    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::item_manager::destroy_item`,
      arguments: [
        object_or_ref(tx, kiosk_id),
        object_or_ref(tx, kiosk_cap),
        tx.object(types.ITEM_PROTECTED_POLICY),
        tx.pure.id(item_id),
        tx.object(types.VERSION),
      ],
    })

    return tx
  }
}
