import { Transaction } from '@mysten/sui/transactions'

import { object_or_ref } from '../object_or_ref.js'

/** @param {import("../../../types.js").Context} context */
export function craft_use_item_ingredient({ types }) {
  return ({ tx = new Transaction(), craft, kiosk, kiosk_cap, item_id }) => {
    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::item_recipe::use_item_ingredient`,
      arguments: [
        object_or_ref(tx, kiosk),
        object_or_ref(tx, kiosk_cap),
        item_id,
        tx.object(types.ITEM_PROTECTED_POLICY),
        craft,
      ],
    })
  }
}
