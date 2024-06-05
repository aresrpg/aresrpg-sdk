/** @param {import("../../../types.js").Context} context */
export function delete_item({ types }: import("../../../types.js").Context): ({ tx, kiosk_id, kiosk_cap, item_id }: {
    tx?: Transaction;
    kiosk_id: any;
    kiosk_cap: any;
    item_id: any;
}) => Transaction;
import { Transaction } from '@mysten/sui/transactions';
