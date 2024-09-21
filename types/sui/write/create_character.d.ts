/** @param {import("../../../types.js").Context} context */
export function create_character({ types }: import("../../../types.js").Context): ({ tx, name, classe, male, kiosk_id, kiosk_cap, color_1, color_2, color_3, }: {
    tx?: Transaction;
    name: any;
    classe: any;
    male?: boolean;
    kiosk_id: any;
    kiosk_cap: any;
    color_1: any;
    color_2: any;
    color_3: any;
}) => {
    $kind: "NestedResult";
    NestedResult: [number, number];
};
import { Transaction } from '@mysten/sui/transactions';
