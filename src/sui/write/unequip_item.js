import { Transaction } from '@mysten/sui/transactions'

import { object_or_ref } from '../object_or_ref.js'

/** @param {import("../../../types.js").Context} context */
export function unequip_item({ types }) {
  return ({
    tx = new Transaction(),
    kiosk,
    kiosk_cap,
    item_kiosk,
    character_id,
    slot,
    item_type,
  }) => {
    const [purchase_cap] = tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::character_inventory::unequip_item`,
      arguments: [
        object_or_ref(tx, kiosk),
        object_or_ref(tx, kiosk_cap),
        tx.pure.id(character_id),
        tx.pure.string(slot),
        tx.object(types.VERSION),
      ],
      typeArguments: [item_type],
    })

    tx.moveCall({
      target: '0x2::kiosk::return_purchase_cap',
      arguments: [tx.object(item_kiosk), purchase_cap],
      typeArguments: [item_type],
    })

    return tx
  }
}
