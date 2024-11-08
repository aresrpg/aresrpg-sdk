import { Transaction } from '@mysten/sui/transactions'

import { object_or_ref } from '../object_or_ref.js'

/** @param {import("../../../types.js").Context} context */
export function delete_character({ types }) {
  return ({ tx = new Transaction(), kiosk_id, kiosk_cap, character_id }) => {
    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::character_manager::delete_character`,
      arguments: [
        object_or_ref(tx, kiosk_id),
        object_or_ref(tx, kiosk_cap),
        tx.object(types.NAME_REGISTRY),
        tx.pure.id(character_id),
        tx.object(types.CHARACTER_PROTECTED_POLICY),
        tx.object(types.VERSION),
      ],
    })

    return tx
  }
}
