import { KioskTransaction } from '@mysten/kiosk'
import { TransactionBlock } from '@mysten/sui.js/transactions'

/** @param {import("../../../types.js").Context} context */
export function enforce_personal_kiosk({ kiosk_client, types }) {
  return async ({ tx = new TransactionBlock(), recipient }) => {
    const { kioskOwnerCaps } = await kiosk_client.getOwnedKiosks({
      address: recipient,
    })

    const first_personal_kiosk = kioskOwnerCaps.find(
      ({ isPersonal }) => !!isPersonal,
    )

    const kiosk_tx = new KioskTransaction({
      transactionBlock: tx,
      kioskClient: kiosk_client,
      ...(first_personal_kiosk && { cap: first_personal_kiosk }),
    })

    if (!first_personal_kiosk) kiosk_tx.createPersonal(true)

    return {
      kiosk_tx,
      kiosk_id: kiosk_tx.getKiosk(),
      kiosk_cap: kiosk_tx.getKioskCap(),
    }
  }
}
