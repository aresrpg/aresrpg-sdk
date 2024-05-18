export function SDK({ rpc_url, wss_url, network, }: {
    rpc_url?: "https://fullnode.mainnet.sui.io:443" | "https://fullnode.testnet.sui.io:443" | "https://fullnode.devnet.sui.io:443" | "http://127.0.0.1:9000";
    wss_url?: string;
    network?: Network;
}): Promise<{
    get_locked_characters: (address: string) => Promise<import("./types.js").SuiCharacter[]>;
    get_unlocked_characters: (address: string) => Promise<import("./types.js").SuiCharacter[]>;
    get_character_by_id: (id: any) => Promise<import("./types.js").SuiCharacter>;
    get_kiosk_id: (character_id: any) => Promise<any>;
    get_locked_items: (address: string) => Promise<import("./types.js").SuiItem[]>;
    get_unlocked_items: (address: string) => Promise<import("./types.js").SuiItem[]>;
    get_item_by_id: (id: string) => Promise<import("./types.js").SuiItem>;
    get_user_kiosks: ({ tx, address }: {
        tx?: import("@mysten/sui.js/transactions").TransactionBlock;
        address: any;
    }) => Promise<{
        tx: import("@mysten/sui.js/transactions").TransactionBlock;
        kiosks: Map<string, any>;
        finalize(): void;
    }>;
    create_character: ({ tx, name, classe, sex, kiosk_id, kiosk_cap, }: {
        tx?: import("@mysten/sui.js/transactions").TransactionBlock;
        name: any;
        classe: any;
        sex?: string;
        kiosk_id: any;
        kiosk_cap: any;
    }) => any;
    select_character: ({ character_id, kiosk_id, kiosk_cap, tx, }: {
        character_id: any;
        kiosk_id: any;
        kiosk_cap: any;
        tx?: import("@mysten/sui.js/transactions").TransactionBlock;
    }) => import("@mysten/sui.js/transactions").TransactionBlock;
    unselect_character: ({ character_id, kiosk_id, kiosk_cap, tx, }: {
        character_id: any;
        kiosk_id: any;
        kiosk_cap: any;
        tx?: import("@mysten/sui.js/transactions").TransactionBlock;
    }) => import("@mysten/sui.js/transactions").TransactionBlock;
    delete_character: ({ tx, kiosk_id, kiosk_cap, character_id, }: {
        tx?: import("@mysten/sui.js/transactions").TransactionBlock;
        kiosk_id: any;
        kiosk_cap: any;
        character_id: any;
    }) => import("@mysten/sui.js/transactions").TransactionBlock;
    is_character_name_taken: ({ address, name }: {
        address: any;
        name: any;
    }) => Promise<boolean>;
    borrow_kiosk_owner_cap: ({ personal_kiosk_cap_id, tx, handler }: {
        personal_kiosk_cap_id: any;
        tx?: import("@mysten/sui.js/transactions").TransactionBlock;
        handler: any;
    }) => import("@mysten/sui.js/transactions").TransactionBlock;
    enforce_personal_kiosk: ({ tx, recipient }: {
        tx?: import("@mysten/sui.js/transactions").TransactionBlock;
        recipient: any;
    }) => Promise<{
        kiosk_tx: import("@mysten/kiosk").KioskTransaction;
        kiosk_id: any;
        kiosk_cap: any;
    }>;
    withdraw_items: ({ tx, kiosk_id, kiosk_cap, item_ids }: {
        tx?: import("@mysten/sui.js/transactions").TransactionBlock;
        kiosk_id: any;
        kiosk_cap: any;
        item_ids: any;
    }) => import("@mysten/sui.js/transactions").TransactionBlock;
    equip_item: ({ tx, kiosk, kiosk_cap, item_kiosk, item_kiosk_cap, item_id, character_id, slot, item_type, }: {
        tx?: import("@mysten/sui.js/transactions").TransactionBlock;
        kiosk: any;
        kiosk_cap: any;
        item_kiosk: any;
        item_kiosk_cap: any;
        item_id: any;
        character_id: any;
        slot: any;
        item_type: any;
    }) => import("@mysten/sui.js/transactions").TransactionBlock;
    unequip_item: ({ tx, kiosk, kiosk_cap, item_kiosk, character_id, slot, item_type, }: {
        tx?: import("@mysten/sui.js/transactions").TransactionBlock;
        kiosk: any;
        kiosk_cap: any;
        item_kiosk: any;
        character_id: any;
        slot: any;
        item_type: any;
    }) => import("@mysten/sui.js/transactions").TransactionBlock;
    add_header: (tx: any) => any;
    admin_promote: ({ tx, recipient }: {
        tx?: import("@mysten/sui.js/transactions").TransactionBlock;
        recipient: any;
    }) => import("@mysten/sui.js/transactions").TransactionBlock;
    admin_mint_item: ({ tx, recipient_kiosk, admin_cap, name, item_category, item_set, item_type, level, amount, stackable, stats, damages, }: {
        tx?: import("@mysten/sui.js/transactions").TransactionBlock;
        recipient_kiosk: any;
        admin_cap?: any;
        name: any;
        item_category: any;
        item_set?: string;
        item_type: any;
        level: any;
        amount?: number;
        stackable?: boolean;
        stats?: any;
        damages?: any[];
    }) => import("@mysten/sui.js/transactions").TransactionBlock;
    admin_freeze_contract: ({ tx }: {
        tx?: import("@mysten/sui.js/transactions").TransactionBlock;
    }) => import("@mysten/sui.js/transactions").TransactionBlock;
    get_sui_balance(owner: any): Promise<bigint>;
    subscribe(on_message: any): Promise<import("@mysten/sui.js/client").Unsubscribe>;
    DISPLAY_CHARACTER: any;
    NAME_REGISTRY: any;
    ADMIN_CAP: any;
    VERSION: any;
    PUBLISHER_CHARACTER: any;
    PUBLISHER_ITEM: any;
    PACKAGE_ID: any;
    UPGRADE_CAP: any;
    DISPLAY_ITEM: any;
    CHARACTER_PROTECTED_POLICY: any;
    ITEM_PROTECTED_POLICY: any;
    CHARACTER_POLICY: any;
    ITEM_POLICY: any;
    LATEST_PACKAGE_ID: string;
    sui_client: SuiClient;
    kiosk_client: KioskClient;
}>;
import { Network } from '@mysten/kiosk';
import { SuiClient } from '@mysten/sui.js/client';
import { KioskClient } from '@mysten/kiosk';