/** @param {import("../../../types.js").Context} context */
export function get_aresrpg_kiosk({ kiosk_client }) {
  return async address => {
    const { kioskOwnerCaps } = await kiosk_client.getOwnedKiosks({
      address,
    })

    const first_personal_kiosk = kioskOwnerCaps.find(
      ({ isPersonal }) => !!isPersonal,
    )

    return first_personal_kiosk
  }
}
