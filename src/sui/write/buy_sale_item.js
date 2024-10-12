import { Transaction } from '@mysten/sui/transactions'

/** @param {import("../../../types.js").Context} context */
export function craft_item({ types }) {
  return ({ tx = new Transaction(), sale, coin, kiosk, kiosk_cap }) => {
    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::item_sale::buy_item`,
      arguments: [
        tx.object(sale),
        tx.object(coin),
        tx.object('0x8'),
        tx.object(kiosk),
        tx.object(kiosk_cap),
        tx.object(types.ITEM_POLICY),
        tx.object(types.VERSION),
      ],
    })
  }
}
