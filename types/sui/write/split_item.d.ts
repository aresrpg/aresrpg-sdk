/** @param {import("../../../types.js").Context} context */
export function split_item({ types }: import("../../../types.js").Context): ({ tx, kiosk, kiosk_cap, item_id, amount }: {
    tx?: Transaction;
    kiosk: any;
    kiosk_cap: any;
    item_id: any;
    amount: any;
}) => {
    $kind: "NestedResult";
    NestedResult: [number, number];
};
import { Transaction } from '@mysten/sui/transactions';
