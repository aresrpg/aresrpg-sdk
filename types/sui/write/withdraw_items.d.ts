/** @param {import("../../types.js").Context} context */
export function withdraw_items({ types }: import("../../types.js").Context): ({ tx, kiosk_id, kiosk_cap, item_ids }: {
    tx?: TransactionBlock;
    kiosk_id: any;
    kiosk_cap: any;
    item_ids: any;
}) => TransactionBlock;
import { TransactionBlock } from '@mysten/sui.js/transactions';
