import { Transaction } from '@mysten/sui/transactions'

export function list_item() {
  return ({
    tx = new Transaction(),
    kiosk,
    kiosk_cap,
    item_id,
    item_type,
    price,
  }) => {
    const kiosk_ref = tx.object(kiosk)
    tx.moveCall({
      target: '0x2::kiosk::set_owner',
      arguments: [kiosk_ref, kiosk_cap],
    })

    tx.moveCall({
      target: '0x2::kiosk::list',
      arguments: [kiosk_ref, kiosk_cap, item_id, tx.pure.u64(price)],
      typeArguments: [item_type],
    })
  }
}
