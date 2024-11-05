import { Transaction } from '@mysten/sui/transactions'

/** @param {import("../../../types.js").Context} context */
export function add_stats({ types }) {
  return ({
    tx = new Transaction(),
    kiosk,
    kiosk_cap,
    character_id,
    stat,
    amount,
  }) => {
    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::character_stats::add_${stat}`,
      arguments: [
        tx.object(kiosk),
        kiosk_cap,
        tx.pure.id(character_id),
        tx.pure.u16(amount),
        tx.object(types.VERSION),
      ],
    })
  }
}
