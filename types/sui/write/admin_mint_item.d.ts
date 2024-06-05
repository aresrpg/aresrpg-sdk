/** @param {import("../../../types.js").Context} context */
export function admin_mint_item({ types }: import("../../../types.js").Context): ({ tx, recipient_kiosk, admin_cap, name, item_category, item_set, item_type, level, amount, stackable, stats, damages, }: {
    tx?: Transaction;
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
}) => Transaction;
import { Transaction } from '@mysten/sui/transactions';
