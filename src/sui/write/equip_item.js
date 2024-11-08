import { Transaction } from '@mysten/sui/transactions'

import { object_or_ref } from '../object_or_ref.js'

/** @param {import("../../../types.js").Context} context */
export function equip_item({ types }) {
  return ({
    tx = new Transaction(),
    kiosk,
    kiosk_cap,
    item_kiosk,
    item_kiosk_cap,
    item_id,
    character_id,
    slot,
    item_type,
  }) => {
    const [purchase_cap] = tx.moveCall({
      target: '0x2::kiosk::list_with_purchase_cap',
      arguments: [
        object_or_ref(tx, item_kiosk),
        object_or_ref(tx, item_kiosk_cap),
        tx.pure.id(item_id),
        // listing for the max amount of MIST, to prevent buying the item
        tx.pure.u64(18446744073709551615n),
      ],
      typeArguments: [item_type],
    })

    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::character_inventory::equip_item`,
      arguments: [
        object_or_ref(tx, kiosk),
        object_or_ref(tx, kiosk_cap),
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
