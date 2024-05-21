import { KioskClient, Network } from '@mysten/kiosk'
import {
  SuiClient,
  SuiHTTPTransport,
  getFullnodeUrl,
} from '@mysten/sui.js/client'

import { find_types } from './types-parser.js'
import { get_character_by_id } from './sui/read/get_character_by_id.js'
import { get_kiosk_id } from './sui/read/get_kiosk_id.js'
import { get_unlocked_characters } from './sui/read/get_unlocked_characters.js'
import { get_locked_characters } from './sui/read/get_locked_characters.js'
import { create_character } from './sui/write/create_character.js'
import { is_character_name_taken } from './sui/write/is_character_name_taken.js'
import { borrow_personal_kiosk_cap } from './sui/write/borrow_personal_kiosk_cap.js'
import { select_character } from './sui/write/select_character.js'
import { enforce_personal_kiosk } from './sui/write/enforce_personal_kiosk.js'
import { delete_character } from './sui/write/delete_character.js'
import { unselect_character } from './sui/write/unselect_character.js'
import { admin_promote } from './sui/write/admin_promote.js'
import { admin_mint_item } from './sui/write/admin_mint_item.js'
import { get_locked_items } from './sui/read/get_locked_items.js'
import { get_unlocked_items } from './sui/read/get_unlocked_items.js'
import { withdraw_items } from './sui/write/withdraw_items.js'
import { equip_item } from './sui/write/equip_item.js'
import { unequip_item } from './sui/write/unequip_item.js'
import { get_user_kiosks } from './sui/read/get_user_kiosks.js'
import { admin_freeze_contract } from './sui/write/admin_freeze_contract.js'
import { add_header } from './sui/write/add_header.js'
import { get_item_by_id } from './sui/read/get_item_by_id.js'
import { feed_suifren } from './sui/write/feed_suifren.js'
import { get_suifren_object_accessory } from './sui/read/get_suifren_accessories.js'
import { get_pet_feed_value } from './sui/read/get_pet_feed_value.js'

const {
  TESTNET_PUBLISH_DIGEST = 'EEztDkyUmhVGZpAkXWypSB2bbvJKWR3Yk7LdaMuraGMg',
  TESTNET_POLICIES_DIGEST = '9fQ7Fme3c176gz4nTXWytBUzW7XzzUKHxJfV89PcKrUh',
  TESTNET_UPGRADE_DIGEST = '',
  MAINNET_PUBLISH_DIGEST = '',
  MAINNET_POLICIES_DIGEST = '',
  MAINNET_UPGRADE_DIGEST = '',
} = process.env

export async function SDK({
  rpc_url = getFullnodeUrl('testnet'),
  wss_url = getFullnodeUrl('testnet').replace('http', 'ws'),
  network = Network.TESTNET,
}) {
  const sui_client = new SuiClient({
    transport: new SuiHTTPTransport({
      url: rpc_url,
      websocket: {
        reconnectTimeout: 1000,
        url: wss_url,
      },
    }),
  })
  const kiosk_client = new KioskClient({
    client: sui_client,
    network,
  })

  const types = await find_types(
    {
      publish_digest:
        network === Network.TESTNET
          ? TESTNET_PUBLISH_DIGEST
          : MAINNET_PUBLISH_DIGEST,
      policies_digest:
        network === Network.TESTNET
          ? TESTNET_POLICIES_DIGEST
          : MAINNET_POLICIES_DIGEST,
      upgrade_digest:
        network === Network.TESTNET
          ? TESTNET_UPGRADE_DIGEST
          : MAINNET_UPGRADE_DIGEST,
    },
    sui_client,
  )

  const context = {
    sui_client,
    kiosk_client,
    types,
    network,
  }

  return {
    sui_client,
    kiosk_client,
    ...types,

    get_locked_characters: get_locked_characters(context),
    get_unlocked_characters: get_unlocked_characters(context),
    get_character_by_id: get_character_by_id(context),
    get_kiosk_id: get_kiosk_id(context),
    get_locked_items: get_locked_items(context),
    get_unlocked_items: get_unlocked_items(context),
    get_item_by_id: get_item_by_id(context),
    get_suifren_object_accessory: get_suifren_object_accessory(context),
    get_pet_feed_value: get_pet_feed_value(context),

    get_user_kiosks: get_user_kiosks(context),

    create_character: create_character(context),
    select_character: select_character(context),
    unselect_character: unselect_character(context),
    delete_character: delete_character(context),
    is_character_name_taken: is_character_name_taken(context),
    borrow_personal_kiosk_cap: borrow_personal_kiosk_cap(context),
    enforce_personal_kiosk: enforce_personal_kiosk(context),
    withdraw_items: withdraw_items(context),
    equip_item: equip_item(context),
    unequip_item: unequip_item(context),
    feed_suifren: feed_suifren(context),

    add_header: add_header(context),

    admin_promote: admin_promote(context),
    admin_mint_item: admin_mint_item(context),
    admin_freeze_contract: admin_freeze_contract(context),

    async get_sui_balance(owner) {
      const { totalBalance } = await sui_client.getBalance({
        owner,
      })

      return BigInt(totalBalance)
    },
    async subscribe(on_message) {
      return sui_client.subscribeEvent({
        onMessage: on_message,
        filter: { Package: types.PACKAGE_ID },
      })
    },
  }
}