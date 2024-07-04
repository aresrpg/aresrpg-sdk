/** @param {import("../../../types.js").Context} context */
export function get_royalty_fee({ sui_client, kiosk_client }) {
  return async item_type => {
    try {
      const [policy] = await kiosk_client.getTransferPolicies({
        type: item_type,
      })
      const { data } = await sui_client.getDynamicFields({
        parentId: policy.id,
      })
      const {
        name: { type },
      } = data.find(policy => policy.name.type.includes('royalty_rule'))

      const dynamic_field = await sui_client.getDynamicFieldObject({
        parentId: policy.id,
        name: {
          type,
          value: false,
        },
      })
      // @ts-ignore
      return dynamic_field.data.content.fields.value.fields.amount_bp
    } catch (error) {
      return null
    }
  }
}
