import { TransactionBlock } from '@mysten/sui.js/transactions'

import { sanitized } from '../sanitize.js'

/** @param {import("../../../types.js").Context} context */
export function withdraw_items({ types }) {
  return ({ tx = new TransactionBlock(), kiosk_id, kiosk_cap, item_ids }) => {
    const txb = sanitized(tx)

    const param_kiosk_id = txb._.object(kiosk_id)
    const param_kiosk_cap = txb._.object(kiosk_cap)
    const param_item_policy = tx.object(types.ITEM_POLICY)
    const param_version = tx.object(types.VERSION)

    item_ids.forEach(item_id => {
      tx.moveCall({
        target: `${types.LATEST_PACKAGE_ID}::item_manager::withdraw`,
        arguments: [
          param_kiosk_id,
          param_kiosk_cap,
          param_item_policy,
          txb._.pure(item_id),
          param_version,
        ],
      })
    })

    return tx
  }
}
