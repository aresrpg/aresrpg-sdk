const balance = result => result.data.content.fields.balance

/** @param {import("../../../types.js").Context} context */
export function get_policies_profit({ sui_client, kiosk_client, types }) {
  return async address => {
    const [item_policy, character_policy] = await sui_client.multiGetObjects({
      ids: [types.ITEM_POLICY, types.CHARACTER_POLICY],
      options: {
        showContent: true,
      },
    })

    const [character_policy_cap] =
      await kiosk_client.getOwnedTransferPoliciesByType({
        type: `${types.PACKAGE_ID}::character::Character`,
        address,
      })

    const [item_policy_cap] = await kiosk_client.getOwnedTransferPoliciesByType(
      {
        type: `${types.PACKAGE_ID}::item::Item`,
        address,
      },
    )

    return {
      is_owner: !!(character_policy_cap && item_policy_cap),
      character_profits: balance(character_policy),
      item_profits: balance(item_policy),
    }
  }
}
