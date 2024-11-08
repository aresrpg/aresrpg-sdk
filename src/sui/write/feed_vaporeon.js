import { Transaction } from '@mysten/sui/transactions'

import { borrow_kiosk_item } from '../borrow_kiosk_item.js'
import { VAPOREON } from '../supported_nfts.js'
import { HSUI } from '../supported_tokens.js'
import { object_or_ref } from '../object_or_ref.js'

/** @param {import("../../../types.js").Context} context */
export function feed_vaporeon({ types, network }) {
  return ({
    tx = new Transaction(),
    kiosk_id,
    kiosk_cap,
    vaporeon_id,
    coin,
  }) => {
    const [vaporeon_package] = VAPOREON[network].split('::')

    borrow_kiosk_item({
      tx,
      kiosk_id: object_or_ref(tx, kiosk_id),
      kiosk_cap_id: object_or_ref(tx, kiosk_cap),
      item_id: tx.pure.id(vaporeon_id),
      item_type: `${vaporeon_package}::vaporeon::Vaporeon`,
      handler(vaporeon) {
        tx.moveCall({
          target: `${types.LATEST_PACKAGE_ID}::item_feed::feed_vaporeon`,
          arguments: [vaporeon, coin, tx.object(types.VERSION)],
          typeArguments: [HSUI[network].address],
        })
      },
    })
  }
}
