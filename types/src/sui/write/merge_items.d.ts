/** @param {import("../../types.js").Context} context */
export function merge_items({ types }: import("../../types.js").Context): ({ tx, kiosk, kiosk_cap, target_item_id, items_ids, }: {
    tx?: TransactionBlock;
    kiosk: any;
    kiosk_cap: any;
    target_item_id: any;
    items_ids: any;
}) => TransactionBlock;
import { TransactionBlock } from '@mysten/sui.js/transactions';
