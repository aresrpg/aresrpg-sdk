/** @param {import("../../../types.js").Context} context */
export function get_owned_admin_cap({ sui_client, types }) {
  return async address => {
    const result = await sui_client.getOwnedObjects({
      owner: address,
      options: { showContent: true },
      filter: { StructType: `${types.PACKAGE_ID}::admin::AdminCap` },
    })

    return result.data.map(({ data }) => data.objectId)
  }
}
