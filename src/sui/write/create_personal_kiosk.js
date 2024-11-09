import { KioskTransaction } from '@mysten/kiosk'
import { Transaction } from '@mysten/sui/transactions'

/** @param {import("../../../types.js").Context} context */
export function create_personal_kiosk({ kiosk_client }) {
  return async ({ tx = new Transaction() }) => {
    const kiosk_tx = new KioskTransaction({
      transaction: tx,
      kioskClient: kiosk_client,
    })

    kiosk_tx.createPersonal(true)

    return {
      kiosk_tx,
      kiosk_id: kiosk_tx.getKiosk(),
      kiosk_cap: kiosk_tx.getKioskCap(),
    }
  }
}
