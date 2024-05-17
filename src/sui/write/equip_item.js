import { TransactionBlock } from '@mysten/sui.js/transactions'

import { sanitized } from '../sanitize.js'
import { add_header } from '../header.js'

/** @param {import("../../types.js").Context} context */
export function equip_item({ types }) {
  return ({
    tx = new TransactionBlock(),
    kiosk,
    kiosk_cap,
    item_kiosk,
    item_kiosk_cap,
    item_id,
    character_id,
    slot,
    item_type,
  }) => {
    add_header(tx, types)

    const txb = sanitized(tx)

    const param_kiosk = txb._.object(kiosk)
    const param_kiosk_cap = txb._.object(kiosk_cap)
    const param_item_kiosk = txb._.object(item_kiosk)
    const param_item_kiosk_cap = txb._.object(item_kiosk_cap)

    const [purchase_cap] = tx.moveCall({
      target: '0x2::kiosk::list_with_purchase_cap',
      arguments: [
        param_item_kiosk,
        param_item_kiosk_cap,
        tx.pure.id(item_id),
        // listing for the max amount of MIST, to prevent buying the item
        tx.pure.u64(18446744073709551615n),
      ],
      typeArguments: [item_type],
    })

    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::character_inventory::equip_item`,
      arguments: [
        param_kiosk,
        param_kiosk_cap,
        tx.pure.id(character_id),
        tx.pure.string(slot),
        purchase_cap,
        tx.object(types.VERSION),
      ],
      typeArguments: [item_type],
    })

    return tx
  }
}
