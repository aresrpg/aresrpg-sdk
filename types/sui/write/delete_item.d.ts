/** @param {import("../../../types.js").Context} context */
export function delete_item({ types }: import("../../../types.js").Context): ({ tx, kiosk_id, kiosk_cap, item_id }: {
    tx?: TransactionBlock;
    kiosk_id: any;
    kiosk_cap: any;
    item_id: any;
}) => TransactionBlock;
import { TransactionBlock } from '@mysten/sui.js/transactions';
