import { Transaction } from '@mysten/sui/transactions'

import { borrow_kiosk_item } from '../borrow_kiosk_item.js'
import { BULLSHARK, CAPY } from '../supported_nfts.js'
import { object_or_ref } from '../object_or_ref.js'

/** @param {import("../../../types.js").Context} context */
export function feed_suifren({ types, network }) {
  return ({
    tx = new Transaction(),
    kiosk_id,
    kiosk_cap,
    suifren_id,
    coin,
    fren_type,
  }) => {
    const [suifren_package] = CAPY[network].split('::')
    const subtype =
      fren_type === 'suifren_capy'
        ? CAPY[network].split('<')[1].slice(0, -1)
        : BULLSHARK[network].split('<')[1].slice(0, -1)

    borrow_kiosk_item({
      tx,
      kiosk_id: object_or_ref(tx, kiosk_id),
      kiosk_cap_id: object_or_ref(tx, kiosk_cap),
      item_id: tx.pure.id(suifren_id),
      item_type: `${suifren_package}::suifrens::SuiFren<${subtype}>`,
      handler(suifren) {
        tx.moveCall({
          target: `${types.LATEST_PACKAGE_ID}::item_feed::feed_suifren`,
          arguments: [suifren, coin, tx.object(types.VERSION)],
          typeArguments: [subtype],
        })
      },
    })
  }
}
