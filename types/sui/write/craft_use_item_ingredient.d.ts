/** @param {import("../../../types.js").Context} context */
export function craft_use_item_ingredient({ types }: import("../../../types.js").Context): ({ tx, craft, kiosk, kiosk_cap, item_id }: {
    tx?: Transaction;
    craft: any;
    kiosk: any;
    kiosk_cap: any;
    item_id: any;
}) => import("@mysten/sui/transactions").TransactionResult;
import { Transaction } from '@mysten/sui/transactions';
