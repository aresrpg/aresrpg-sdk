import { Transaction } from '@mysten/sui/transactions'

function borrow_kiosk_cap({ kiosk_client, tx, personal_kiosk_cap_id }) {
  const personal_kiosk_package_id = kiosk_client.getRulePackageId(
    'personalKioskRulePackageId',
  )

  const [kiosk_cap, promise] = tx.moveCall({
    target: `${personal_kiosk_package_id}::personal_kiosk::borrow_val`,
    arguments: [personal_kiosk_cap_id],
  })

  return {
    kiosk_cap,
    resolve_promise() {
      tx.moveCall({
        target: `${personal_kiosk_package_id}::personal_kiosk::return_val`,
        arguments: [personal_kiosk_cap_id, kiosk_cap, promise],
      })
    },
  }
}

/**
 * Returns all users kiosks and their kiosk caps, (borrow personal ones if needed)
 * @param {import("../../../types.js").Context} context */
export function get_user_kiosks({ kiosk_client }) {
  return async ({ tx = new Transaction(), address }) => {
    const { kioskOwnerCaps } = await kiosk_client.getOwnedKiosks({
      address,
      // take 25 first kiosks, more than that is not a normal user behavior
      // and will be handled later eventually
      pagination: { limit: 25 },
    })

    const finalizations = []

    return {
      tx,
      kiosks: new Map(
        kioskOwnerCaps.map(({ isPersonal, kioskId, objectId }) => {
          if (isPersonal) {
            const { kiosk_cap, resolve_promise } = borrow_kiosk_cap({
              kiosk_client,
              tx,
              personal_kiosk_cap_id: tx.object(objectId),
            })
            finalizations.push(resolve_promise)
            return [kioskId, kiosk_cap]
          }
          return [kioskId, tx.object(objectId)]
        }),
      ),
      finalize() {
        finalizations.forEach(finalize => finalize())
      },
    }
  }
}
