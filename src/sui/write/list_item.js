import { TransactionBlock } from '@mysten/sui.js/transactions'

import { sanitized } from '../sanitize.js'

export function list_item() {
  return ({
    tx = new TransactionBlock(),
    kiosk,
    kiosk_cap,
    item_id,
    item_type,
    price,
  }) => {
    const txb = sanitized(tx)

    tx.moveCall({
      target: '0x2::kiosk::set_owner',
      arguments: [txb._.object(kiosk), txb._.object(kiosk_cap)],
    })

    tx.moveCall({
      target: '0x2::kiosk::list',
      arguments: [
        txb._.object(kiosk),
        txb._.object(kiosk_cap),
        txb._.pure(item_id),
        tx.pure.u64(price),
      ],
      typeArguments: [item_type],
    })
  }
}
