export function borrow_kiosk_item({
  tx,
  kiosk_id,
  kiosk_cap_id,
  handler,
  item_id,
  item_type,
}) {
  const [item, promise] = tx.moveCall({
    target: '0x2::kiosk::borrow_val',
    arguments: [kiosk_id, kiosk_cap_id, item_id],
    typeArguments: [item_type],
  })

  handler(item)

  tx.moveCall({
    target: `0x2::kiosk::return_val`,
    arguments: [kiosk_id, item, promise],
    typeArguments: [item_type],
  })

  return tx
}
