import { TransactionBlock } from '@mysten/sui.js/transactions'

import { sanitized } from '../sanitize.js'
import { add_header } from '../header.js'

/** @param {import("../../types.js").Context} context */
export function unselect_character({ types }) {
  return ({
    character_id,
    kiosk_id,
    kiosk_cap,
    tx = new TransactionBlock(),
  }) => {
    add_header(tx, types)

    const txb = sanitized(tx)

    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::character_manager::unselect_character`,
      arguments: [
        txb._.object(kiosk_id),
        txb._.object(kiosk_cap),
        txb._.object(types.CHARACTER_POLICY),
        txb._.pure(character_id),
        txb._.object(types.VERSION),
      ],
    })

    return tx
  }
}