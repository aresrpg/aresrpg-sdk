import { Transaction } from '@mysten/sui/transactions'

/** @param {import("../../../types.js").Context} context */
export function split_item({ types }) {
  return ({ tx = new Transaction(), kiosk, kiosk_cap, item_id, amount }) => {
    const [result] = tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::item_manager::split_item`,
      arguments: [
        tx.object(kiosk),
        kiosk_cap,
        tx.object(types.ITEM_POLICY),
        tx.pure.id(item_id),
        tx.pure.u32(amount),
        tx.object(types.VERSION),
      ],
    })

    return result
  }
}
