/** @param {import("../../../types.js").Context} context */
export function add_header({ types }) {
  return (tx) =>
    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::header::aresrpg`,
    })
}
