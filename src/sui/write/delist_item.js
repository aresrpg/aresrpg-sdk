import { Transaction } from '@mysten/sui/transactions'

import { object_or_ref } from '../object_or_ref.js'

export function delist_item() {
  return ({ tx = new Transaction(), kiosk, kiosk_cap, item_id, item_type }) => {
    const kiosk_ref = object_or_ref(tx, kiosk)
    const kiosk_cap_ref = object_or_ref(tx, kiosk_cap)

    tx.moveCall({
      target: '0x2::kiosk::set_owner',
      arguments: [kiosk_ref, kiosk_cap_ref],
    })

    tx.moveCall({
      target: '0x2::kiosk::delist',
      arguments: [kiosk_ref, kiosk_cap_ref, tx.pure.id(item_id)],
      typeArguments: [item_type],
    })
  }
}
