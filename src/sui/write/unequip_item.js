import { TransactionBlock } from '@mysten/sui.js/transactions'

import { sanitized } from '../sanitize.js'
import { add_header } from '../header.js'

/** @param {import("../../types.js").Context} context */
export function unequip_item({ types }) {
  return ({
    tx = new TransactionBlock(),
    kiosk,
    kiosk_cap,
    item_kiosk,
    character_id,
    slot,
    item_type,
  }) => {
    add_header(tx, types)

    const txb = sanitized(tx)

    const param_kiosk = txb._.object(kiosk)
    const param_kiosk_cap = txb._.object(kiosk_cap)
    const param_item_kiosk = txb._.object(item_kiosk)

    const [purchase_cap] = tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::character_inventory::unequip_item`,
      arguments: [
        param_kiosk,
        param_kiosk_cap,
        tx.pure.id(character_id),
        tx.pure.string(slot),
        tx.object(types.VERSION),
      ],
      typeArguments: [item_type],
    })

    tx.moveCall({
      target: '0x2::kiosk::return_purchase_cap',
      arguments: [param_item_kiosk, purchase_cap],
      typeArguments: [item_type],
    })

    return tx
  }
}
