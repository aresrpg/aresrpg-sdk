import { TransactionBlock } from '@mysten/sui.js/transactions'

import { sanitized } from '../sanitize.js'
import { add_header } from '../header.js'

/** @param {import("../../types.js").Context} context */
export function admin_promote({ types }) {
  return ({ tx = new TransactionBlock(), recipient }) => {
    add_header(tx, types)

    const txb = sanitized(tx)

    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::admin::admin_promote_address`,
      arguments: [txb._.object(types.ADMIN_CAP), txb._.pure(recipient)],
    })

    return tx
  }
}
