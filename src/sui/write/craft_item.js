import { Transaction } from '@mysten/sui/transactions'

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
        finished_craft,
        tx.object('0x8'),
        tx.object(kiosk),
        kiosk_cap,
        tx.object(types.ITEM_POLICY),
        tx.object(types.VERSION),
      ],
    })
  }
}
