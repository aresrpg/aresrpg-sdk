/** @param {import("../../../types.js").Context} context */
export function create_character({ types }: import("../../../types.js").Context): ({ tx, name, classe, male, kiosk_id, kiosk_cap, }: {
    tx?: Transaction;
    name: any;
    classe: any;
    male?: boolean;
    kiosk_id: any;
    kiosk_cap: any;
}) => {
    $kind: "NestedResult";
    NestedResult: [number, number];
};
import { Transaction } from '@mysten/sui/transactions';
