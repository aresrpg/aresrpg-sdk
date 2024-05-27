import { TransactionBlock } from '@mysten/sui.js/transactions'

import { sanitized } from '../sanitize.js'

/** @param {import("../../../types.js").Context} context */
export function delete_item({ types }) {
  return ({ tx = new TransactionBlock(), kiosk_id, kiosk_cap, item_id }) => {
    const txb = sanitized(tx)

    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::item_manager::destroy_item`,
      arguments: [
        txb._.object(kiosk_id),
        txb._.object(kiosk_cap),
        txb._.object(types.ITEM_PROTECTED_POLICY),
        txb._.pure(item_id),
        txb._.object(types.VERSION),
      ],
    })

    return tx
  }
}
