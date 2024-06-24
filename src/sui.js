import { KioskClient, Network } from '@mysten/kiosk'
import { SuiClient, SuiHTTPTransport, getFullnodeUrl } from '@mysten/sui/client'
import { LRUCache } from 'lru-cache'
import { iter } from 'iterator-helper'
import { SuiGraphQLClient } from '@mysten/sui/graphql'
import { graphql } from '@mysten/sui/graphql/schemas/2024.4'

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
import { get_locked_characters_by_ids } from './sui/read/get_locked_characters_by_ids.js'
import { list_item } from './sui/write/list_item.js'
import { SUPPORTED_NFTS, VAPOREON } from './sui/supported_nfts.js'
import { get_items, get_recipe } from './sui/cache.js'
import { delist_item } from './sui/write/delist_item.js'
import { admin_delete_admin_cap } from './sui/write/admin_delete_admin_cap.js'
import { admin_withdraw_profit } from './sui/write/admin_withdraw_profit.js'
import { get_policies_profit } from './sui/read/get_policies_profit.js'
import { delete_item } from './sui/write/delete_item.js'
import { admin_create_recipe } from './sui/write/admin_create_recipe.js'
import { admin_delete_recipe } from './sui/write/admin_delete_recipe.js'
import { get_owned_admin_cap } from './sui/read/get_owned_admin_cap.js'
import { get_supported_tokens } from './sui/read/get_supported_tokens.js'
import { HSUI, SUPPORTED_TOKENS } from './sui/supported_tokens.js'
import { craft_start } from './sui/write/craft_start.js'
import { craft_item } from './sui/write/craft_item.js'
import { craft_prove_ingredients_used } from './sui/write/craft_prove_ingredients_used.js'
import { craft_use_item_ingredient } from './sui/write/craft_use_item_ingredient.js'
import { craft_use_token_ingredient } from './sui/write/craft_use_token_ingredient.js'
import { merge_items } from './sui/write/merge_items.js'
import { split_item } from './sui/write/split_item.js'
import { get_finished_crafts } from './sui/read/get_finished_crafts.js'
import { get_kiosk_owner_cap } from './sui/read/get_kiosk_owner_cap.js'
import { get_aresrpg_kiosk } from './sui/read/get_aresrpg_kiosk.js'
import { ITEM_CATEGORY } from './items.js'
import { feed_vaporeon } from './sui/write/feed_vaporeon.js'

const {
  TESTNET_PUBLISH_DIGEST = 'A8XVjuPtAiQSPDhzcAbNHhhhpQoVUPG4ybgF1jmSCWj3',
  TESTNET_POLICIES_DIGEST = 'Emv7hF6g9w8P8HSGYCpt9n3xcL6jNLVwSjK7DQ65wP8F',
  TESTNET_UPGRADE_DIGEST = 'DcQPRjMKdh9brPHWTNc3Z1fbKrueBGwokSx7f6SqkLZh',
  MAINNET_PUBLISH_DIGEST = '4BSMGH5Mf62rNXB9Wi1YJvjtMVBNWe8RvvDaHgF47qQX',
  MAINNET_POLICIES_DIGEST = '',
  MAINNET_UPGRADE_DIGEST = '',
} = process.env

const item_listed = type => `0x2::kiosk::ItemListed<${type}>`
const item_purchased = type => `0x2::kiosk::ItemPurchased<${type}>`
const item_delisted = type => `0x2::kiosk::ItemDelisted<${type}>`

// keep fetched balances for 3s to avoid spamming the nodes
const balances_cache = new LRUCache({ max: 100, ttl: 3000 })

async function get_client(rpc_url, wss_url, network, allow_fallback) {
  const sui_client = new SuiClient({
    transport: new SuiHTTPTransport({
      url: rpc_url,
      websocket: {
        reconnectTimeout: 1000,
        url: wss_url,
      },
    }),
  })

  try {
    await sui_client.getLatestCheckpointSequenceNumber()
    return sui_client
  } catch (error) {
    if (!allow_fallback) throw new Error('SUI node is offline')
    console.error('Node unresponsive, defaulting to public node')
    return get_client(
      getFullnodeUrl(network),
      getFullnodeUrl(network).replace('http', 'ws'),
      network,
    )
  }
}

export async function SDK({
  rpc_url = getFullnodeUrl('testnet'),
  wss_url = getFullnodeUrl('testnet').replace('http', 'ws'),
  network = Network.TESTNET,
  websocket_constructor = undefined,
  allow_fallback = true,
}) {
  const sui_client = await get_client(rpc_url, wss_url, network, allow_fallback)
  const kiosk_client = new KioskClient({
    client: sui_client,
    network,
  })

  const gql_client = new SuiGraphQLClient({
    url: `https://sui-${network}.mystenlabs.com/graphql`,
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

  const supported_tokens = SUPPORTED_TOKENS(network)
  const supported_nfts = SUPPORTED_NFTS(network)

  await iter(Object.values(supported_tokens))
    .toAsyncIterator()
    .forEach(async token => {
      const { decimals, iconUrl, symbol } = await sui_client.getCoinMetadata({
        coinType: token.item_type,
      })

      Object.assign(token, {
        decimal: decimals,
        image_url: iconUrl,
        name: symbol,
        is_token: true,
        item_set: 'none',
        item_category: ITEM_CATEGORY.RESOURCE,
        level: 1,
      })
    })
    .catch(console.error)

  const context = {
    sui_client,
    kiosk_client,
    types,
    network,
    supported_tokens,
    HSUI: HSUI[network],
  }

  return {
    sui_client,
    kiosk_client,
    ...types,
    SUPPORTED_TOKENS: supported_tokens,
    SUPPORTED_NFTS: supported_nfts,
    HSUI: HSUI[network],

    get_locked_characters: get_locked_characters(context),
    get_unlocked_characters: get_unlocked_characters(context),
    get_character_by_id: get_character_by_id(context),
    get_kiosk_id: get_kiosk_id(context),
    get_locked_items: get_locked_items(context),
    get_unlocked_items: get_unlocked_items(context),
    get_item_by_id: get_item_by_id(context),
    get_suifren_object_accessory: get_suifren_object_accessory(context),
    get_pet_feed_value: get_pet_feed_value(context),
    get_locked_characters_by_ids: get_locked_characters_by_ids(context),
    get_policies_profit: get_policies_profit(context),
    get_owned_admin_cap: get_owned_admin_cap(context),
    get_supported_tokens: get_supported_tokens(context),
    get_finished_crafts: get_finished_crafts(context),
    get_kiosk_owner_cap: get_kiosk_owner_cap(context),
    get_aresrpg_kiosk: get_aresrpg_kiosk(context),

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
    feed_vaporeon: feed_vaporeon(context),
    list_item: list_item(),
    delist_item: delist_item(),
    delete_item: delete_item(context),
    craft_start: craft_start(context),
    craft_item: craft_item(context),
    craft_prove_ingredients_used: craft_prove_ingredients_used(context),
    craft_use_item_ingredient: craft_use_item_ingredient(context),
    craft_use_token_ingredient: craft_use_token_ingredient(context),
    merge_items: merge_items(context),
    split_item: split_item(context),

    add_header: add_header(context),

    admin_promote: admin_promote(context),
    admin_mint_item: admin_mint_item(context),
    admin_freeze_contract: admin_freeze_contract(context),
    admin_delete_admin_cap: admin_delete_admin_cap(context),
    admin_withdraw_profit: admin_withdraw_profit(context),
    admin_create_recipe: admin_create_recipe(context),
    admin_delete_recipe: admin_delete_recipe(context),

    get_items: ids => get_items(context, ids, { allow_characters: true }),
    get_recipe: id => get_recipe(context, id),

    async verify_zk_personal_message({ bytes, signature, sender }) {
      const { data } = await gql_client.query({
        query: graphql(`
          query verifyZkPersonalMessage(
            $bytes: String!
            $signature: String!
            $sender: String!
            $scope: String!
          ) {
            verifyZkloginSignature(
              bytes: $bytes
              signature: $signature
              intentScope: $scope
              author: $sender
            ) {
              success
            }
          }
        `),
        variables: {
          bytes,
          signature,
          sender,
          scope: 'PERSONAL_MESSAGE',
        },
      })

      return data?.verifyZkloginSignature?.success
    },

    /** @return {Promise<bigint>} balance */
    async get_sui_balance(owner) {
      if (!balances_cache.has(owner)) {
        const { totalBalance } = await sui_client.getBalance({
          owner,
        })
        balances_cache.set(owner, BigInt(totalBalance))
      }

      // @ts-ignore
      return balances_cache.get(owner)
    },
    async subscribe(on_message) {
      const supported_types = [
        `${types.PACKAGE_ID}::character::Character`,
        `${types.PACKAGE_ID}::item::Item`,
        ...Object.keys(SUPPORTED_NFTS(network)),
      ]
      return sui_client.subscribeEvent({
        onMessage: on_message,
        filter: {
          Any: [
            { Package: types.PACKAGE_ID },
            {
              MoveEventType: `${VAPOREON[network].split('::')[0]}::vaporeon::VaporeonMintEvent`,
            },
            ...supported_types.flatMap(type => [
              { MoveEventType: item_listed(type) },
              { MoveEventType: item_purchased(type) },
              { MoveEventType: item_delisted(type) },
            ]),
          ],
        },
      })
    },
  }
}
