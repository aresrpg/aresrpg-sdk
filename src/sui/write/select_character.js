import { Transaction } from '@mysten/sui/transactions'

/** @param {import("../../../types.js").Context} context */
export function select_character({ types }) {
  return ({ character_id, kiosk_id, kiosk_cap, tx = new Transaction() }) => {
    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::character_manager::select_character`,
      arguments: [
        typeof kiosk_id === 'string' ? tx.object(kiosk_id) : kiosk_id,
        kiosk_cap,
        tx.object(types.CHARACTER_PROTECTED_POLICY),
        typeof character_id === 'string'
          ? tx.pure.id(character_id)
          : character_id,
        tx.object(types.VERSION),
      ],
    })

    return tx
  }
}
