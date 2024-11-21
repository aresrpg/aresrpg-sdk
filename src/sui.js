import { KioskClient, Network } from '@mysten/kiosk'
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client'
import { LRUCache } from 'lru-cache'
import { SuiGraphQLClient } from '@mysten/sui/graphql'
import { graphql } from '@mysten/sui/graphql/schemas/2024.4'

import { create_character } from './sui/write/create_character.js'
import { borrow_personal_kiosk_cap } from './sui/write/borrow_personal_kiosk_cap.js'
import { select_character } from './sui/write/select_character.js'
import { delete_character } from './sui/write/delete_character.js'
import { unselect_character } from './sui/write/unselect_character.js'
import { admin_promote } from './sui/write/admin_promote.js'
import { admin_mint_item } from './sui/write/admin_mint_item.js'
import { withdraw_items } from './sui/write/withdraw_items.js'
import { equip_item } from './sui/write/equip_item.js'
import { unequip_item } from './sui/write/unequip_item.js'
import { get_user_kiosks } from './sui/read/get_user_kiosks.js'
import { admin_freeze_contract } from './sui/write/admin_freeze_contract.js'
import { add_header } from './sui/write/add_header.js'
import { feed_suifren } from './sui/write/feed_suifren.js'
import { list_item } from './sui/write/list_item.js'
import { SUPPORTED_NFTS, VAPOREON } from './sui/supported_nfts.js'
import { delist_item } from './sui/write/delist_item.js'
import { admin_delete_admin_cap } from './sui/write/admin_delete_admin_cap.js'
import { admin_withdraw_profit } from './sui/write/admin_withdraw_profit.js'
import { get_policies_profit } from './sui/read/get_policies_profit.js'
import { get_royalty_fee } from './sui/read/get_royalty_fee.js'
import { delete_item } from './sui/write/delete_item.js'
import { admin_create_recipe } from './sui/write/admin_create_recipe.js'
import { admin_delete_recipe } from './sui/write/admin_delete_recipe.js'
import { get_supported_tokens } from './sui/read/get_supported_tokens.js'
import { HSUI, SUPPORTED_TOKENS } from './sui/supported_tokens.js'
import { craft_start } from './sui/write/craft_start.js'
import { craft_item } from './sui/write/craft_item.js'
import { craft_prove_ingredients_used } from './sui/write/craft_prove_ingredients_used.js'
import { craft_use_item_ingredient } from './sui/write/craft_use_item_ingredient.js'
import { craft_use_token_ingredient } from './sui/write/craft_use_token_ingredient.js'
import { merge_items } from './sui/write/merge_items.js'
import { split_item } from './sui/write/split_item.js'
import { ITEM_CATEGORY } from './items.js'
import { feed_vaporeon } from './sui/write/feed_vaporeon.js'
import { create_personal_kiosk } from './sui/write/create_personal_kiosk.js'
import types from './types.json' with { type: 'json' }
import { admin_create_sale } from './sui/write/admin_create_sale.js'
import { admin_delete_sale } from './sui/write/admin_delete_sale.js'
import { buy_sale_item } from './sui/write/buy_sale_item.js'
import { get_suifren_stats } from './sui/feedable_suifrens.js'
import { get_vaporeon_stats } from './sui/feedable_vaporeon.js'
import { TRANSFER_POLICIES } from './sui/transfer_policies.js'
import { add_stats, reset_character_stats } from './sui/write/add_stats.js'
import { admin_mint_caps } from './sui/write/admin_mint_caps.js'

// keep fetched balances for 3s to avoid spamming the nodes
const balances_cache = new LRUCache({ max: 100, ttl: 3000 })

export async function SDK({
  rpc_url = getFullnodeUrl('testnet'),
  network = Network.TESTNET,
}) {
  const sui_client = new SuiClient({ url: rpc_url })
  const kiosk_client = new KioskClient({
    client: sui_client,
    network,
    // seems the kiosk sdk is missing the correct rule
    ...(network === Network.MAINNET
      ? {
          packageIds: {
            personalKioskRulePackageId:
              '0x0cb4bcc0560340eb1a1b929cabe56b33fc6449820ec8c1980d69bb98b649b802',
          },
        }
      : {}),
  })

  const gql_client = new SuiGraphQLClient({
    url: `https://sui-${network}.mystenlabs.com/graphql`,
  })

  const supported_tokens = SUPPORTED_TOKENS(network)
  const supported_nfts = SUPPORTED_NFTS(network)
  const transfer_policies = TRANSFER_POLICIES(network)

  Object.values(supported_tokens).forEach(async token => {
    Object.assign(token, {
      is_token: true,
      item_set: 'none',
      item_type: token.address,
      item_category: ITEM_CATEGORY.RESOURCE,
      level: 1,
    })
  })

  const context = {
    sui_client,
    kiosk_client,
    types,
    network,
    supported_tokens,
    HSUI: HSUI[network].address,
    VAPOREON: VAPOREON[network],
  }

  return {
    sui_client,
    kiosk_client,
    ...types,
    SUPPORTED_TOKENS: supported_tokens,
    SUPPORTED_NFTS: supported_nfts,
    TRANSFER_POLICIES: transfer_policies,
    HSUI: HSUI[network],
    VAPOREON: VAPOREON[network],

    get_policies_profit: get_policies_profit(context),
    get_royalty_fee: get_royalty_fee(context),
    get_supported_tokens: get_supported_tokens(context),
    get_suifren_stats,
    get_vaporeon_stats: get_vaporeon_stats(context),

    get_user_kiosks: get_user_kiosks(context),

    create_character: create_character(context),
    select_character: select_character(context),
    unselect_character: unselect_character(context),
    delete_character: delete_character(context),
    borrow_personal_kiosk_cap: borrow_personal_kiosk_cap(context),
    create_personal_kiosk: create_personal_kiosk(context),
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
    buy_sale_item: buy_sale_item(context),
    add_stats: add_stats(context),
    reset_character_stats: reset_character_stats(context),

    add_header: add_header(context),

    admin_promote: admin_promote(context),
    admin_mint_item: admin_mint_item(context),
    admin_freeze_contract: admin_freeze_contract(context),
    admin_delete_admin_cap: admin_delete_admin_cap(context),
    admin_withdraw_profit: admin_withdraw_profit(context),
    admin_create_recipe: admin_create_recipe(context),
    admin_delete_recipe: admin_delete_recipe(context),
    admin_create_sale: admin_create_sale(context),
    admin_delete_sale: admin_delete_sale(context),
    admin_mint_caps: admin_mint_caps(context),

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
  }
}
