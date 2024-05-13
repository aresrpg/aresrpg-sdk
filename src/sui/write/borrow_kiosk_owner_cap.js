import { TransactionBlock } from '@mysten/sui.js/transactions'

import { sanitized } from '../sanitize.js'

/** @param {import("../../types.js").Context} context */
export function borrow_kiosk_owner_cap({ kiosk_client }) {
  return ({ personal_kiosk_cap_id, tx = new TransactionBlock(), handler }) => {
    const personal_kiosk_package_id = kiosk_client.getRulePackageId(
      'personalKioskRulePackageId',
    )

    const txb = sanitized(tx)

    const [kiosk_cap, promise] = tx.moveCall({
      target: `${personal_kiosk_package_id}::personal_kiosk::borrow_val`,
      arguments: [txb._.object(personal_kiosk_cap_id)],
    })

    handler(kiosk_cap)

    tx.moveCall({
      target: `${personal_kiosk_package_id}::personal_kiosk::return_val`,
      arguments: [txb._.object(personal_kiosk_cap_id), kiosk_cap, promise],
    })

    return tx
  }
}
