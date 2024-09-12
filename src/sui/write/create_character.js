import { Transaction } from '@mysten/sui/transactions'

/** @param {import("../../../types.js").Context} context */
export function create_character({ types }) {
  return ({
    tx = new Transaction(),
    name,
    classe,
    male = true,
    kiosk_id,
    kiosk_cap,
  }) => {
    console.dir({
      kiosk_id,
      kiosk_cap,
      register: types.NAME_REGISTRY,
      policy: types.CHARACTER_POLICY,
      name,
      classe,
      male,
      version: types.VERSION,
    })
    const [character_id] = tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::character_manager::create_and_lock_character`,
      arguments: [
        typeof kiosk_id === 'string' ? tx.object(kiosk_id) : kiosk_id,
        kiosk_cap,
        tx.object(types.NAME_REGISTRY),
        tx.object(types.CHARACTER_POLICY),
        tx.pure.string(name),
        tx.pure.string(classe),
        tx.pure.bool(male),
        tx.object(types.VERSION),
      ],
    })

    return character_id
  }
}
