import { Transaction } from '@mysten/sui/transactions'

/** @param {import("../../../types.js").Context} context */
export function merge_items({ types }) {
  return ({
    tx = new Transaction(),
    target_kiosk,
    target_kiosk_cap,
    target_item_id,
    item_id,
    item_kiosk,
    item_kiosk_cap,
  }) => {
    if (target_kiosk === item_kiosk) {
      tx.moveCall({
        target: `${types.LATEST_PACKAGE_ID}::item_manager::merge_items_single_kiosk`,
        arguments: [
          tx.object(target_kiosk),
          target_kiosk_cap,
          tx.pure.id(target_item_id),
          tx.pure.id(item_id),
          tx.object(types.ITEM_PROTECTED_POLICY),
          tx.object(types.VERSION),
        ],
      })
    } else
      tx.moveCall({
        target: `${types.LATEST_PACKAGE_ID}::item_manager::merge_items_different_kiosk`,
        arguments: [
          tx.object(target_kiosk),
          target_kiosk_cap,
          tx.pure.id(target_item_id),
          tx.object(item_kiosk),
          item_kiosk_cap,
          tx.pure.id(item_id),
          tx.object(types.ITEM_PROTECTED_POLICY),
          tx.object(types.VERSION),
        ],
      })

    return tx
  }
}
