import { Transaction } from '@mysten/sui/transactions'

import { object_or_ref } from '../object_or_ref.js'

export function list_item() {
  return ({
    tx = new Transaction(),
    kiosk,
    kiosk_cap,
    item_id,
    item_type,
    price,
  }) => {
    const kiosk_ref = object_or_ref(tx, kiosk)
    const kiosk_cap_ref = object_or_ref(tx, kiosk_cap)

    tx.moveCall({
      target: '0x2::kiosk::set_owner',
      arguments: [kiosk_ref, kiosk_cap_ref],
    })

    tx.moveCall({
      target: '0x2::kiosk::list',
      arguments: [kiosk_ref, kiosk_cap_ref, item_id, tx.pure.u64(price)],
      typeArguments: [item_type],
    })
  }
}
