import { Transaction } from '@mysten/sui/transactions'

/** @param {import("../../../types.js").Context} context */
export function add_stats({ types }) {
  return ({
    tx = new Transaction(),
    kiosk,
    kiosk_cap,
    character_id,
    stat,
    amount,
  }) => {
    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::character_stats::add_${stat}`,
      arguments: [
        tx.object(kiosk),
        kiosk_cap,
        tx.pure.id(character_id),
        tx.pure.u16(amount),
        tx.object(types.VERSION),
      ],
    })
  }
}

/** @param {import("../../../types.js").Context} context */
export function reset_character_stats({ types }) {
  return ({
    tx = new Transaction(),
    item_kiosk,
    item_kiosk_cap,
    character_kiosk,
    character_kiosk_cap,
    character_id,
    item_id,
  }) => {
    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::character_stats::reset_character_stats`,
      arguments: [
        tx.object(item_kiosk),
        item_kiosk_cap,
        tx.object(character_kiosk),
        character_kiosk_cap,
        tx.pure.id(character_id),
        tx.pure.id(item_id),
        tx.object(types.ITEM_PROTECTED_POLICY),
        tx.object(types.VERSION),
      ],
    })
  }
}
