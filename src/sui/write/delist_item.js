import { Transaction } from '@mysten/sui/transactions'

export function delist_item() {
  return ({ tx = new Transaction(), kiosk, kiosk_cap, item_id, item_type }) => {
    tx.moveCall({
      target: '0x2::kiosk::set_owner',
      arguments: [tx.object(kiosk), kiosk_cap],
    })

    tx.moveCall({
      target: '0x2::kiosk::delist',
      arguments: [tx.object(kiosk), kiosk_cap, tx.pure.id(item_id)],
      typeArguments: [item_type],
    })
  }
}
