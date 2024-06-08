import { Network, KioskClient } from '@mysten/kiosk'
import { SuiClient } from '@mysten/sui/client'

import { SUPPORTED_NFTS } from './sui/supported_nfts.js'
import { SUPPORTED_TOKENS, USDC } from './sui/supported_tokens.js'
export function SDK({
  rpc_url,
  wss_url,
  network,
  websocket_constructor,
}: {
  rpc_url?:
    | 'https://fullnode.mainnet.sui.io:443'
    | 'https://fullnode.testnet.sui.io:443'
    | 'https://fullnode.devnet.sui.io:443'
    | 'http://127.0.0.1:9000'
  wss_url?: string
  network?: Network
  websocket_constructor?: any
}): Promise<{
  get_locked_characters: (
    address: string,
  ) => Promise<import('../types.js').SuiCharacter[]>
  get_unlocked_characters: (
    address: string,
  ) => Promise<import('../types.js').SuiCharacter[]>
  get_character_by_id: (id: any) => Promise<import('../types.js').SuiCharacter>
  get_kiosk_id: (character_id: any) => Promise<any>
  get_locked_items: (
    address: string,
  ) => Promise<import('../types.js').SuiItem[]>
  get_unlocked_items: (
    address: string,
    only_listed: any,
  ) => Promise<import('../types.js').SuiItem[]>
  get_item_by_id: (id: string) => Promise<import('../types.js').SuiItem>
  get_suifren_object_accessory: (suifren_id: any) => Promise<any>
  get_pet_feed_value: (pet_id: any) => Promise<{
    last_feed: any
    stomach: any
  }>
  get_locked_characters_by_ids: (
    ids: string[],
  ) => Promise<Map<string, import('../types.js').SuiCharacter>>
  get_policies_profit: (address: any) => Promise<{
    is_owner: boolean
    character_profits: any
    item_profits: any
  }>
  get_owned_admin_cap: (address: any) => Promise<string[]>
  get_supported_tokens: (
    address: string,
  ) => Promise<import('../types.js').SuiToken[]>
  get_finished_crafts: (owner: any) => Promise<any[]>
  get_user_kiosks: ({
    tx,
    address,
  }: {
    tx?: import('@mysten/sui/transactions').Transaction
    address: any
  }) => Promise<{
    tx: import('@mysten/sui/transactions').Transaction
    kiosks: Map<string, any>
    finalize(): void
  }>
  create_character: ({
    tx,
    name,
    classe,
    sex,
    kiosk_id,
    kiosk_cap,
  }: {
    tx?: import('@mysten/sui/transactions').Transaction
    name: any
    classe: any
    sex?: string
    kiosk_id: any
    kiosk_cap: any
  }) => {
    $kind: 'NestedResult'
    NestedResult: [number, number]
  }
  select_character: ({
    character_id,
    kiosk_id,
    kiosk_cap,
    tx,
  }: {
    character_id: any
    kiosk_id: any
    kiosk_cap: any
    tx?: import('@mysten/sui/transactions').Transaction
  }) => import('@mysten/sui/transactions').Transaction
  unselect_character: ({
    character_id,
    kiosk_id,
    kiosk_cap,
    tx,
  }: {
    character_id: any
    kiosk_id: any
    kiosk_cap: any
    tx?: import('@mysten/sui/transactions').Transaction
  }) => import('@mysten/sui/transactions').Transaction
  delete_character: ({
    tx,
    kiosk_id,
    kiosk_cap,
    character_id,
  }: {
    tx?: import('@mysten/sui/transactions').Transaction
    kiosk_id: any
    kiosk_cap: any
    character_id: any
  }) => import('@mysten/sui/transactions').Transaction
  is_character_name_taken: ({
    address,
    name,
  }: {
    address: any
    name: any
  }) => Promise<boolean>
  borrow_personal_kiosk_cap: ({
    personal_kiosk_cap_id,
    tx,
    handler,
  }: {
    personal_kiosk_cap_id: any
    tx?: import('@mysten/sui/transactions').Transaction
    handler: any
  }) => import('@mysten/sui/transactions').Transaction
  enforce_personal_kiosk: ({
    tx,
    recipient,
  }: {
    tx?: import('@mysten/sui/transactions').Transaction
    recipient: any
  }) => Promise<{
    kiosk_tx: import('@mysten/kiosk').KioskTransaction
    kiosk_id: import('@mysten/sui/transactions').TransactionObjectArgument
    kiosk_cap: import('@mysten/sui/transactions').TransactionObjectArgument
    personal_cap: {
      $kind: 'Input'
      Input: number
      type?: 'object'
    }
  }>
  withdraw_items: ({
    tx,
    kiosk_id,
    kiosk_cap,
    item_ids,
  }: {
    tx?: import('@mysten/sui/transactions').Transaction
    kiosk_id: any
    kiosk_cap: any
    item_ids: any
  }) => import('@mysten/sui/transactions').Transaction
  equip_item: ({
    tx,
    kiosk,
    kiosk_cap,
    item_kiosk,
    item_kiosk_cap,
    item_id,
    character_id,
    slot,
    item_type,
  }: {
    tx?: import('@mysten/sui/transactions').Transaction
    kiosk: any
    kiosk_cap: any
    item_kiosk: any
    item_kiosk_cap: any
    item_id: any
    character_id: any
    slot: any
    item_type: any
  }) => import('@mysten/sui/transactions').Transaction
  unequip_item: ({
    tx,
    kiosk,
    kiosk_cap,
    item_kiosk,
    character_id,
    slot,
    item_type,
  }: {
    tx?: import('@mysten/sui/transactions').Transaction
    kiosk: any
    kiosk_cap: any
    item_kiosk: any
    character_id: any
    slot: any
    item_type: any
  }) => import('@mysten/sui/transactions').Transaction
  feed_suifren: ({
    tx,
    kiosk_id,
    kiosk_cap,
    suifren_id,
    coin,
    fren_type,
  }: {
    tx?: import('@mysten/sui/transactions').Transaction
    kiosk_id: any
    kiosk_cap: any
    suifren_id: any
    coin: any
    fren_type: any
  }) => void
  list_item: ({
    tx,
    kiosk,
    kiosk_cap,
    item_id,
    item_type,
    price,
  }: {
    tx?: import('@mysten/sui/transactions').Transaction
    kiosk: any
    kiosk_cap: any
    item_id: any
    item_type: any
    price: any
  }) => void
  delist_item: ({
    tx,
    kiosk,
    kiosk_cap,
    item_id,
    item_type,
  }: {
    tx?: import('@mysten/sui/transactions').Transaction
    kiosk: any
    kiosk_cap: any
    item_id: any
    item_type: any
  }) => void
  delete_item: ({
    tx,
    kiosk_id,
    kiosk_cap,
    item_id,
  }: {
    tx?: import('@mysten/sui/transactions').Transaction
    kiosk_id: any
    kiosk_cap: any
    item_id: any
  }) => import('@mysten/sui/transactions').Transaction
  craft_start: ({
    tx,
    recipe,
  }: {
    tx?: import('@mysten/sui/transactions').Transaction
    recipe: any
  }) => import('@mysten/sui/transactions').TransactionResult
  craft_item: ({
    tx,
    recipe,
    finished_craft,
    kiosk,
    kiosk_cap,
  }: {
    tx?: import('@mysten/sui/transactions').Transaction
    recipe: any
    finished_craft: any
    kiosk: any
    kiosk_cap: any
  }) => void
  craft_prove_ingredients_used: ({
    tx,
    craft,
  }: {
    tx?: import('@mysten/sui/transactions').Transaction
    craft: any
  }) => void
  craft_use_item_ingredient: ({
    tx,
    craft,
    kiosk,
    kiosk_cap,
    item_id,
  }: {
    tx?: import('@mysten/sui/transactions').Transaction
    craft: any
    kiosk: any
    kiosk_cap: any
    item_id: any
  }) => void
  craft_use_token_ingredient: ({
    tx,
    craft,
    coin,
    coin_type,
  }: {
    tx?: import('@mysten/sui/transactions').Transaction
    craft: any
    coin: any
    coin_type: any
  }) => void
  merge_items: ({
    tx,
    target_kiosk,
    target_kiosk_cap,
    target_item_id,
    item_id,
    item_kiosk,
    item_kiosk_cap,
  }: {
    tx?: import('@mysten/sui/transactions').Transaction
    target_kiosk: any
    target_kiosk_cap: any
    target_item_id: any
    item_id: any
    item_kiosk: any
    item_kiosk_cap: any
  }) => import('@mysten/sui/transactions').Transaction
  split_item: ({
    tx,
    kiosk,
    kiosk_cap,
    item_id,
    amount,
  }: {
    tx?: import('@mysten/sui/transactions').Transaction
    kiosk: any
    kiosk_cap: any
    item_id: any
    amount: any
  }) => {
    $kind: 'NestedResult'
    NestedResult: [number, number]
  }
  add_header: (tx: any) => any
  admin_promote: ({
    tx,
    recipient,
  }: {
    tx?: import('@mysten/sui/transactions').Transaction
    recipient: any
  }) => import('@mysten/sui/transactions').Transaction
  admin_mint_item: ({
    tx,
    recipient_kiosk,
    admin_cap,
    name,
    item_category,
    item_set,
    item_type,
    level,
    amount,
    stackable,
    stats,
    damages,
  }: {
    tx?: import('@mysten/sui/transactions').Transaction
    recipient_kiosk: any
    admin_cap?: any
    name: any
    item_category: any
    item_set?: string
    item_type: any
    level?: number
    amount?: number
    stackable?: boolean
    stats?: any
    damages?: any[]
  }) => import('@mysten/sui/transactions').Transaction
  admin_freeze_contract: ({
    tx,
  }: {
    tx?: import('@mysten/sui/transactions').Transaction
  }) => import('@mysten/sui/transactions').Transaction
  admin_delete_admin_cap: ({
    tx,
    admin_cap,
  }: {
    tx?: import('@mysten/sui/transactions').Transaction
    admin_cap: any
  }) => import('@mysten/sui/transactions').Transaction
  admin_withdraw_profit: ({
    tx,
    address,
  }: {
    tx?: import('@mysten/sui/transactions').Transaction
    address: any
  }) => Promise<import('@mysten/sui/transactions').Transaction>
  admin_create_recipe: ({
    tx,
    admin_cap,
    level,
    ingredients,
    template,
  }: {
    tx?: import('@mysten/sui/transactions').Transaction
    admin_cap: any
    level: any
    ingredients: any
    template: any
  }) => import('@mysten/sui/transactions').Transaction
  admin_delete_recipe: ({
    tx,
    admin_cap,
    recipe,
  }: {
    tx?: import('@mysten/sui/transactions').Transaction
    admin_cap: any
    recipe: any
  }) => import('@mysten/sui/transactions').Transaction
  get_items: (ids: any) => Promise<Map<string, import('../types.js').SuiItem>>
  get_recipe: (id: any) => Promise<import('../types.js').Recipe>
  /** @return {Promise<bigint>} balance */
  get_sui_balance(owner: any): Promise<bigint>
  subscribe(on_message: any): Promise<import('@mysten/sui/client').Unsubscribe>
  DISPLAY_CHARACTER: any
  NAME_REGISTRY: any
  ADMIN_CAP: any
  VERSION: any
  PUBLISHER_CHARACTER: any
  PUBLISHER_ITEM: any
  PACKAGE_ID: any
  UPGRADE_CAP: any
  DISPLAY_ITEM: any
  CHARACTER_PROTECTED_POLICY: any
  ITEM_PROTECTED_POLICY: any
  CHARACTER_POLICY: any
  ITEM_POLICY: any
  LATEST_PACKAGE_ID: string
  sui_client: SuiClient
  kiosk_client: KioskClient
}>
export { SUPPORTED_NFTS, SUPPORTED_TOKENS, USDC }
