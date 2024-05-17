export function add_header(tx, types) {
  tx.moveCall({
    target: `${types.LATEST_PACKAGE_ID}::header::aresrpg`,
  })
}
