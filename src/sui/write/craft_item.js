import { Transaction } from '@mysten/sui/transactions'

import { object_or_ref } from '../object_or_ref.js'

/** @param {import("../../../types.js").Context} context */
export function craft_item({ types }) {
  return ({
    tx = new Transaction(),
    recipe,
    finished_craft,
    kiosk,
    kiosk_cap,
  }) => {
    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::item_recipe::craft_item`,
      arguments: [
        tx.object(recipe),
        tx.object(finished_craft),
        tx.object('0x8'),
        object_or_ref(tx, kiosk),
        object_or_ref(tx, kiosk_cap),
        tx.object(types.ITEM_POLICY),
        tx.object(types.VERSION),
      ],
    })
  }
}
