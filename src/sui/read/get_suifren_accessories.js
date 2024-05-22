const SUIFREN_ACCESSORY_MAINNET =
  '0x7aee872d77cade27e7d9b79bf9c67ac40bfb1b797e8b7438ee73f0af21bb4664'

const SUIFREN_ACCESSORY_TESTNET =
  '0x15a2fe781ae848c3f108eddc0298649ed9e76da4e9103b5e0bd6f363cca1d56d'

/** @param {import("../../../types.js").Context} context */
export function get_suifren_object_accessory({ sui_client, network }) {
  const SUIFREN_ACCESSORY =
    network === 'mainnet'
      ? SUIFREN_ACCESSORY_MAINNET
      : SUIFREN_ACCESSORY_TESTNET

  return async suifren_id => {
    try {
      const result = await sui_client.getDynamicFieldObject({
        parentId: suifren_id,
        name: {
          type: `${SUIFREN_ACCESSORY}::accessories::AccessoryKey`,
          value: { type: 'object' },
        },
      })

      // @ts-ignore
      return result.data.content.fields.name
    } catch (error) {
      return null
    }
  }
}
