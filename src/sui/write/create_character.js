import { TransactionBlock } from '@mysten/sui.js/transactions'

import { sanitized } from '../sanitize.js'

/** @param {import("../../types.js").Context} context */
export function create_character({ types }) {
  return ({
    tx = new TransactionBlock(),
    name,
    classe,
    sex = 'male',
    kiosk_id,
    kiosk_cap,
  }) => {
    const txb = sanitized(tx)
    const [character_id] = tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::character_manager::create_and_lock_character`,
      arguments: [
        txb._.object(kiosk_id),
        txb._.object(kiosk_cap),
        txb._.object(types.NAME_REGISTRY),
        txb._.object(types.CHARACTER_POLICY),
        txb._.pure(name),
        txb._.pure(classe),
        txb._.pure(sex),
        txb._.object(types.VERSION),
      ],
    })

    return character_id
  }
}
