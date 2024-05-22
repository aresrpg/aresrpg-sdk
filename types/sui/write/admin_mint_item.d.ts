/** @param {import("../../types.js").Context} context */
export function admin_mint_item({ types }: import("../../types.js").Context): ({ tx, recipient_kiosk, admin_cap, name, item_category, item_set, item_type, level, amount, stackable, stats, damages, }: {
    tx?: TransactionBlock;
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
}) => TransactionBlock;
import { TransactionBlock } from '@mysten/sui.js/transactions';
