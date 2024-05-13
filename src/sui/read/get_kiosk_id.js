
/** @param {import("../../types.js").Context} context */
export function get_kiosk_id({ sui_client }) {
  return async character_id => {
    const { data } = await sui_client.getDynamicFieldObject({
      parentId: character_id,
      name: {
        type: 'vector<u8>',
        value: [...new TextEncoder().encode('kiosk_id')],
      },
    })

    // @ts-ignore
    return data.content.fields.value
  }
}
