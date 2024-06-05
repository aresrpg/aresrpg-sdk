import { Transaction } from '@mysten/sui/transactions'

/** @param {import("../../../types.js").Context} context */
export function unselect_character({ types }) {
  return ({ character_id, kiosk_id, kiosk_cap, tx = new Transaction() }) => {
    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::character_manager::unselect_character`,
      arguments: [
        tx.object(kiosk_id),
        kiosk_cap,
        tx.object(types.CHARACTER_POLICY),
        tx.pure.id(character_id),
        tx.object(types.VERSION),
      ],
    })

    return tx
  }
}
