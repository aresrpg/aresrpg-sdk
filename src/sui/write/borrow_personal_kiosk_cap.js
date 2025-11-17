import { Transaction } from '@mysten/sui/transactions'

/** @param {import("../../../types.js").Context} context */
export function borrow_personal_kiosk_cap({ kiosk_client }) {
  return ({ personal_kiosk_cap_id, tx = new Transaction(), handler }) => {
    const personal_kiosk_package_id = kiosk_client.getRulePackageId(
      'personalKioskRulePackageId'
    )

    const personal_kiosk_cap_ref = tx.object(personal_kiosk_cap_id)

    const [kiosk_cap, promise] = tx.moveCall({
      target: `${personal_kiosk_package_id}::personal_kiosk::borrow_val`,
      arguments: [personal_kiosk_cap_ref],
    })

    handler(kiosk_cap)

    tx.moveCall({
      target: `${personal_kiosk_package_id}::personal_kiosk::return_val`,
      arguments: [personal_kiosk_cap_ref, kiosk_cap, promise],
    })

    return tx
  }
}
