export function SDK({ rpc_url, network, }: {
    rpc_url?: "https://fullnode.mainnet.sui.io:443" | "https://fullnode.testnet.sui.io:443" | "https://fullnode.devnet.sui.io:443" | "http://127.0.0.1:9000";
    network?: Network;
}): Promise<{
    SUPPORTED_TOKENS: {
        [x: number]: any;
    };
    SUPPORTED_NFTS: {
        [x: number]: {
            item_category: string;
            item_set: string;
            item_type: string;
            level: number;
            wisdom: number;
            earth_resistance: number;
            fire_resistance: number;
            water_resistance: number;
            air_resistance: number;
            amount: number;
            name?: undefined;
            strength?: undefined;
            intelligence?: undefined;
            raw_damage?: undefined;
        } | {
            item_category: string;
            item_set: string;
            item_type: string;
            level: number;
            name: string;
            amount: number;
            wisdom?: undefined;
            earth_resistance?: undefined;
            fire_resistance?: undefined;
            water_resistance?: undefined;
            air_resistance?: undefined;
            strength?: undefined;
            intelligence?: undefined;
            raw_damage?: undefined;
        } | {
            item_category: string;
            item_set: string;
            item_type: string;
            level: number;
            strength: number;
            intelligence: number;
            raw_damage: number;
            amount: number;
            wisdom?: undefined;
            earth_resistance?: undefined;
            fire_resistance?: undefined;
            water_resistance?: undefined;
            air_resistance?: undefined;
            name?: undefined;
        } | {
            item_category: string;
            item_set: string;
            item_type: string;
            level: number;
            amount: number;
            wisdom?: undefined;
            earth_resistance?: undefined;
            fire_resistance?: undefined;
            water_resistance?: undefined;
            air_resistance?: undefined;
            name?: undefined;
            strength?: undefined;
            intelligence?: undefined;
            raw_damage?: undefined;
        };
    };
    HSUI: any;
    VAPOREON: any;
    get_locked_characters: (address: string) => Promise<import("../types.js").SuiCharacter[]>;
    get_unlocked_characters: (address: string) => Promise<import("../types.js").SuiCharacter[]>;
    get_kiosk_id: (character_id: any) => Promise<any>;
    get_locked_items: (address: string) => Promise<import("../types.js").SuiItem[]>;
    get_unlocked_items: (address: string, only_listed: any) => Promise<import("../types.js").SuiItem[]>;
    get_item_by_id: (id: string) => Promise<import("../types.js").SuiItem>;
    get_suifren_object_accessory: (suifren_id: any) => Promise<any>;
    get_pet_feed_value: (pet_id: any) => Promise<{
        last_feed: any;
        stomach: any;
    }>;
    get_locked_characters_by_ids: (ids: string[]) => Promise<Map<string, import("../types.js").SuiCharacter>>;
    get_policies_profit: (address: any) => Promise<{
        is_owner: boolean;
        character_profits: any;
        item_profits: any;
    }>;
    get_royalty_fee: (item_type: any) => Promise<any>;
    get_owned_admin_cap: (address: any) => Promise<string[]>;
    get_supported_tokens: (address: string) => Promise<import("../types.js").SuiToken[]>;
    get_finished_crafts: (owner: any) => Promise<any[]>;
    get_kiosk_owner_cap: ({ address, kiosk_id }: {
        address: any;
        kiosk_id: any;
    }) => Promise<{}>;
    get_user_kiosks: ({ tx, address }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        address: any;
    }) => Promise<{
        tx: import("@mysten/sui/transactions").Transaction;
        kiosks: Map<string, any>;
        finalize(): void;
    }>;
    create_character: ({ tx, name, classe, male, kiosk_id, kiosk_cap, color_1, color_2, color_3, }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        name: any;
        classe: any;
        male?: boolean;
        kiosk_id: any;
        kiosk_cap: any;
        color_1: any;
        color_2: any;
        color_3: any;
    }) => {
        $kind: "NestedResult";
        NestedResult: [number, number];
    };
    select_character: ({ character_id, kiosk_id, kiosk_cap, tx }: {
        character_id: any;
        kiosk_id: any;
        kiosk_cap: any;
        tx?: import("@mysten/sui/transactions").Transaction;
    }) => import("@mysten/sui/transactions").Transaction;
    unselect_character: ({ character_id, kiosk_id, kiosk_cap, tx }: {
        character_id: any;
        kiosk_id: any;
        kiosk_cap: any;
        tx?: import("@mysten/sui/transactions").Transaction;
    }) => import("@mysten/sui/transactions").Transaction;
    delete_character: ({ tx, kiosk_id, kiosk_cap, character_id }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        kiosk_id: any;
        kiosk_cap: any;
        character_id: any;
    }) => import("@mysten/sui/transactions").Transaction;
    is_character_name_taken: ({ address, name }: {
        address: any;
        name: any;
    }) => Promise<boolean>;
    borrow_personal_kiosk_cap: ({ personal_kiosk_cap_id, tx, handler }: {
        personal_kiosk_cap_id: any;
        tx?: import("@mysten/sui/transactions").Transaction;
        handler: any;
    }) => import("@mysten/sui/transactions").Transaction;
    create_personal_kiosk: ({ tx }: {
        tx?: import("@mysten/sui/transactions").Transaction;
    }) => Promise<{
        kiosk_tx: import("@mysten/kiosk").KioskTransaction;
        kiosk_id: import("@mysten/sui/transactions").TransactionObjectArgument;
        kiosk_cap: import("@mysten/sui/transactions").TransactionObjectArgument;
    }>;
    withdraw_items: ({ tx, kiosk_id, kiosk_cap, item_ids }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        kiosk_id: any;
        kiosk_cap: any;
        item_ids: any;
    }) => import("@mysten/sui/transactions").Transaction;
    equip_item: ({ tx, kiosk, kiosk_cap, item_kiosk, item_kiosk_cap, item_id, character_id, slot, item_type, }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        kiosk: any;
        kiosk_cap: any;
        item_kiosk: any;
        item_kiosk_cap: any;
        item_id: any;
        character_id: any;
        slot: any;
        item_type: any;
    }) => import("@mysten/sui/transactions").Transaction;
    unequip_item: ({ tx, kiosk, kiosk_cap, item_kiosk, character_id, slot, item_type, }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        kiosk: any;
        kiosk_cap: any;
        item_kiosk: any;
        character_id: any;
        slot: any;
        item_type: any;
    }) => import("@mysten/sui/transactions").Transaction;
    feed_suifren: ({ tx, kiosk_id, kiosk_cap, suifren_id, coin, fren_type, }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        kiosk_id: any;
        kiosk_cap: any;
        suifren_id: any;
        coin: any;
        fren_type: any;
    }) => void;
    feed_vaporeon: ({ tx, kiosk_id, kiosk_cap, vaporeon_id, coin, }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        kiosk_id: any;
        kiosk_cap: any;
        vaporeon_id: any;
        coin: any;
    }) => void;
    list_item: ({ tx, kiosk, kiosk_cap, item_id, item_type, price, }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        kiosk: any;
        kiosk_cap: any;
        item_id: any;
        item_type: any;
        price: any;
    }) => void;
    delist_item: ({ tx, kiosk, kiosk_cap, item_id, item_type }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        kiosk: any;
        kiosk_cap: any;
        item_id: any;
        item_type: any;
    }) => void;
    delete_item: ({ tx, kiosk_id, kiosk_cap, item_id }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        kiosk_id: any;
        kiosk_cap: any;
        item_id: any;
    }) => import("@mysten/sui/transactions").Transaction;
    craft_start: ({ tx, recipe }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        recipe: any;
    }) => import("@mysten/sui/transactions").TransactionResult;
    craft_item: ({ tx, recipe, finished_craft, kiosk, kiosk_cap, }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        recipe: any;
        finished_craft: any;
        kiosk: any;
        kiosk_cap: any;
    }) => void;
    craft_prove_ingredients_used: ({ tx, craft }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        craft: any;
    }) => void;
    craft_use_item_ingredient: ({ tx, craft, kiosk, kiosk_cap, item_id }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        craft: any;
        kiosk: any;
        kiosk_cap: any;
        item_id: any;
    }) => void;
    craft_use_token_ingredient: ({ tx, craft, coin, coin_type }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        craft: any;
        coin: any;
        coin_type: any;
    }) => void;
    merge_items: ({ tx, target_kiosk, target_kiosk_cap, target_item_id, item_id, item_kiosk, item_kiosk_cap, }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        target_kiosk: any;
        target_kiosk_cap: any;
        target_item_id: any;
        item_id: any;
        item_kiosk: any;
        item_kiosk_cap: any;
    }) => import("@mysten/sui/transactions").Transaction;
    split_item: ({ tx, kiosk, kiosk_cap, item_id, amount }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        kiosk: any;
        kiosk_cap: any;
        item_id: any;
        amount: any;
    }) => {
        $kind: "NestedResult";
        NestedResult: [number, number];
    };
    add_header: (tx: any) => any;
    admin_promote: ({ tx, recipient }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        recipient: any;
    }) => import("@mysten/sui/transactions").Transaction;
    admin_mint_item: ({ tx, recipient_kiosk, admin_cap, name, item_category, item_set, item_type, level, amount, stackable, stats, damages, }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        recipient_kiosk: any;
        admin_cap?: any;
        name: any;
        item_category: any;
        item_set?: string;
        item_type: any;
        level?: number;
        amount?: number;
        stackable?: boolean;
        stats?: any;
        damages?: any[];
    }) => import("@mysten/sui/transactions").Transaction;
    admin_freeze_contract: ({ tx }: {
        tx?: import("@mysten/sui/transactions").Transaction;
    }) => import("@mysten/sui/transactions").Transaction;
    admin_delete_admin_cap: ({ tx, admin_cap }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        admin_cap: any;
    }) => import("@mysten/sui/transactions").Transaction;
    admin_withdraw_profit: ({ tx, address }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        address: any;
    }) => Promise<import("@mysten/sui/transactions").Transaction>;
    admin_create_recipe: ({ tx, admin_cap, level, ingredients, template, }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        admin_cap: any;
        level: any;
        ingredients: any;
        template: any;
    }) => import("@mysten/sui/transactions").Transaction;
    admin_delete_recipe: ({ tx, admin_cap, recipe }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        admin_cap: any;
        recipe: any;
    }) => import("@mysten/sui/transactions").Transaction;
    get_items: (ids: any) => Promise<Map<string, import("../types.js").SuiItem>>;
    get_recipe: (id: any) => Promise<import("../types.js").Recipe>;
    verify_zk_personal_message({ bytes, signature, sender }: {
        bytes: any;
        signature: any;
        sender: any;
    }): Promise<boolean>;
    /** @return {Promise<bigint>} balance */
    get_sui_balance(owner: any): Promise<bigint>;
    DISPLAY_CHARACTER: string;
    NAME_REGISTRY: string;
    ADMIN_CAP: string;
    VERSION: string;
    PUBLISHER_CHARACTER: string;
    PUBLISHER_ITEM: string;
    PACKAGE_ID: string;
    UPGRADE_CAP: string;
    DISPLAY_ITEM: string;
    CHARACTER_PROTECTED_POLICY: string;
    ITEM_PROTECTED_POLICY: string;
    CHARACTER_POLICY: string;
    ITEM_POLICY: string;
    LATEST_PACKAGE_ID: string;
    sui_client: SuiClient;
    kiosk_client: KioskClient;
}>;
import { Network } from '@mysten/kiosk';
import { SuiClient } from '@mysten/sui/client';
import { KioskClient } from '@mysten/kiosk';
