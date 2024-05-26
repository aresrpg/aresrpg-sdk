import { TransactionBlock } from '@mysten/sui.js/transactions'

import { sanitized } from '../sanitize.js'

export function delist_item() {
  return ({
    tx = new TransactionBlock(),
    kiosk,
    kiosk_cap,
    item_id,
    item_type,
  }) => {
    const txb = sanitized(tx)

    tx.moveCall({
      target: '0x2::kiosk::set_owner',
      arguments: [txb._.object(kiosk), txb._.object(kiosk_cap)],
    })

    tx.moveCall({
      target: '0x2::kiosk::delist',
      arguments: [
        txb._.object(kiosk),
        txb._.object(kiosk_cap),
        txb._.pure(item_id),
      ],
      typeArguments: [item_type],
    })
  }
}
