/** @param {import("../../../types.js").Context} context */
export function split_item({ types }: import("../../../types.js").Context): ({ tx, kiosk, kiosk_cap, item_id, amount, }: {
    tx?: TransactionBlock;
    kiosk: any;
    kiosk_cap: any;
    item_id: any;
    amount: any;
}) => TransactionBlock;
import { TransactionBlock } from '@mysten/sui.js/transactions';
