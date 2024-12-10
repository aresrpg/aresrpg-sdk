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
    TRANSFER_POLICIES: {
        [x: string]: string;
        [x: number]: any;
    };
    HSUI: any;
    VAPOREON: any;
    SUIFREN_CAPY: any;
    SUIFREN_BULLSHARK: any;
    get_policies_profit: (address: any) => Promise<{
        is_owner: boolean;
        character_profits: any;
        item_profits: any;
    }>;
    get_royalty_fee: (item_type: any) => Promise<any>;
    get_supported_tokens: (address: string) => Promise<import("../types.js").SuiToken[]>;
    get_suifren_stats: typeof get_suifren_stats;
    get_vaporeon_stats: ({ stomach, name }: {
        stomach?: number;
        name: any;
    }) => {
        movement: number;
        chance: number;
        feed_level: number;
        max_feed_level: number;
        food_name: string;
        required_food: number;
    };
    get_user_kiosks: ({ tx, address }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        address: any;
    }) => Promise<{
        tx: import("@mysten/sui/transactions").Transaction;
        get_kiosk_cap_ref: (kiosk_id: any) => any;
        kiosks: Map<string, () => any>;
        finalize(): void;
    }>;
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
    add_header: (tx: any) => any;
    admin_promote: ({ tx, recipient }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        recipient: any;
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
    admin_create_sale: ({ tx, admin_cap, price, amount, stock, template, }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        admin_cap: any;
        price: any;
        amount?: number;
        stock: any;
        template: any;
    }) => import("@mysten/sui/transactions").Transaction;
    admin_delete_sale: ({ tx, recipient, admin_cap, sale }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        recipient: any;
        admin_cap: any;
        sale: any;
    }) => import("@mysten/sui/transactions").Transaction;
    admin_mint_caps: ({ tx, amount, recipient }: {
        tx?: import("@mysten/sui/transactions").Transaction;
        amount?: number;
        recipient: any;
    }) => import("@mysten/sui/transactions").Transaction;
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
    LATEST_PACKAGE_ID: string;
    CHARACTER_PROTECTED_POLICY: string;
    ITEM_PROTECTED_POLICY: string;
    CHARACTER_POLICY: string;
    ITEM_POLICY: string;
    sui_client: SuiClient;
    kiosk_client: KioskClient;
    gql_client: SuiGraphQLClient<{}>;
}>;
import { Network } from '@mysten/kiosk';
import { get_suifren_stats } from './sui/feedable_suifrens.js';
import { SuiClient } from '@mysten/sui/client';
import { KioskClient } from '@mysten/kiosk';
import { SuiGraphQLClient } from '@mysten/sui/graphql';
