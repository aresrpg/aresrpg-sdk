import { Transaction } from '@mysten/sui/transactions'

/** @param {import("../../../types.js").Context} context */
export function create_character({ types }) {
  return ({
    tx = new Transaction(),
    name,
    classe,
    sex = 'male',
    kiosk_id,
    kiosk_cap,
  }) => {
    const [character_id] = tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::character_manager::create_and_lock_character`,
      arguments: [
        tx.object(kiosk_id),
        kiosk_cap,
        tx.object(types.NAME_REGISTRY),
        tx.object(types.CHARACTER_POLICY),
        tx.pure.string(name),
        tx.pure.string(classe),
        tx.pure.string(sex),
        tx.object(types.VERSION),
      ],
    })

    return character_id
  }
}
