import { Transaction } from '@mysten/sui/transactions'

import { object_or_ref } from '../object_or_ref.js'

/** @param {import("../../../types.js").Context} context */
export function create_character({ types }) {
  return ({
    tx = new Transaction(),
    name,
    classe,
    male = true,
    kiosk_id,
    kiosk_cap,
    color_1,
    color_2,
    color_3,
  }) => {
    const [character_id] = tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::character_manager::create_and_lock_character`,
      arguments: [
        object_or_ref(tx, kiosk_id),
        object_or_ref(tx, kiosk_cap),
        tx.object(types.NAME_REGISTRY),
        tx.object(types.CHARACTER_POLICY),
        tx.pure.string(name),
        tx.pure.string(classe),
        tx.pure.bool(male),
        tx.pure.u32(color_1),
        tx.pure.u32(color_2),
        tx.pure.u32(color_3),
        tx.object(types.VERSION),
      ],
    })

    return character_id
  }
}
