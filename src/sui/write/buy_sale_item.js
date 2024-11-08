import { Transaction } from '@mysten/sui/transactions'

import { object_or_ref } from '../object_or_ref.js'

/** @param {import("../../../types.js").Context} context */
export function buy_sale_item({ types }) {
  return ({ tx = new Transaction(), sale, coin, kiosk, kiosk_cap }) => {
    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::item_sale::buy_item`,
      arguments: [
        tx.object(sale),
        tx.object(coin),
        tx.object('0x8'),
        object_or_ref(tx, kiosk),
        object_or_ref(tx, kiosk_cap),
        tx.object(types.ITEM_POLICY),
        tx.object(types.VERSION),
      ],
    })
  }
}
