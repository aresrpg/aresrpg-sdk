import { TransactionBlock } from '@mysten/sui.js/transactions'

import { sanitized } from '../sanitize.js'
import { add_header } from '../header.js'

/** @param {import("../../types.js").Context} context */
export function delete_character({ types }) {
  return ({
    tx = new TransactionBlock(),
    kiosk_id,
    kiosk_cap,
    character_id,
  }) => {
    add_header(tx, types)

    const txb = sanitized(tx)

    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::character_manager::delete_character`,
      arguments: [
        txb._.object(kiosk_id),
        txb._.object(kiosk_cap),
        txb._.object(types.NAME_REGISTRY),
        txb._.pure(character_id),
        txb._.object(types.CHARACTER_PROTECTED_POLICY),
        txb._.object(types.VERSION),
      ],
    })

    return tx
  }
}
