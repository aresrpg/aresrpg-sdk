/** @param {import("../../../types.js").Context} context */
export function create_character({ types }: import("../../../types.js").Context): ({ tx, name, classe, sex, kiosk_id, kiosk_cap, }: {
    tx?: Transaction;
    name: any;
    classe: any;
    sex?: string;
    kiosk_id: any;
    kiosk_cap: any;
}) => {
    $kind: "NestedResult";
    NestedResult: [number, number];
};
import { Transaction } from '@mysten/sui/transactions';
