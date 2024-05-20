import { TransactionBlock } from '@mysten/sui.js/transactions'

import { borrow_kiosk_item } from '../borrow_kiosk_item.js'

const SUIFREN_PACKAGE_MAINNET =
  '0xee496a0cc04d06a345982ba6697c90c619020de9e274408c7819f787ff66e1a1'
const SUIFREN_PACKAGE_TESTNET =
  '0x80d7de9c4a56194087e0ba0bf59492aa8e6a5ee881606226930827085ddf2332'

const CAPY_TYPE_MAINNET = `${SUIFREN_PACKAGE_MAINNET}::capy::Capy`
const CAPY_TYPE_TESTNET = `${SUIFREN_PACKAGE_TESTNET}::capy::Capy`

const BULLSHARK_TYPE_MAINNET =
  '0x8894fa02fc6f36cbc485ae9145d05f247a78e220814fb8419ab261bd81f08f32::bullshark::Bullshark'
const BULLSHARK_TYPE_TESTNET = '' // ??

/** @param {import("../../types.js").Context} context */
export function feed_suifren({ types, network }) {
  return ({
    tx = new TransactionBlock(),
    kiosk_id,
    kiosk_cap,
    suifren_id,
    coin,
    fren_type,
  }) => {
    let subtype = CAPY_TYPE_MAINNET
    let suifren_package = SUIFREN_PACKAGE_MAINNET

    if (network === 'mainnet') {
      if (fren_type === 'suifren_capy') subtype = CAPY_TYPE_MAINNET
      else if (fren_type === 'suifren_bullshark')
        subtype = BULLSHARK_TYPE_MAINNET
      else throw new Error('Invalid fren type')
    }

    if (network === 'testnet') {
      suifren_package = SUIFREN_PACKAGE_TESTNET
      if (fren_type === 'suifren_capy') subtype = CAPY_TYPE_TESTNET
      else if (fren_type === 'suifren_bullshark')
        subtype = BULLSHARK_TYPE_TESTNET
      else throw new Error('Invalid fren type')
    }

    borrow_kiosk_item({
      tx,
      kiosk_id: tx.object(kiosk_id),
      kiosk_cap_id: tx.object(kiosk_cap),
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
