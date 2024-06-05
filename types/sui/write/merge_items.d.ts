/** @param {import("../../../types.js").Context} context */
export function merge_items({ types }: import("../../../types.js").Context): ({ tx, target_kiosk, target_kiosk_cap, target_item_id, item_id, item_kiosk, item_kiosk_cap, }: {
    tx?: Transaction;
    target_kiosk: any;
    target_kiosk_cap: any;
    target_item_id: any;
    item_id: any;
    item_kiosk: any;
    item_kiosk_cap: any;
}) => Transaction;
import { Transaction } from '@mysten/sui/transactions';
