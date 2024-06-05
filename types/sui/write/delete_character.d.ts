/** @param {import("../../../types.js").Context} context */
export function delete_character({ types }: import("../../../types.js").Context): ({ tx, kiosk_id, kiosk_cap, character_id }: {
    tx?: Transaction;
    kiosk_id: any;
    kiosk_cap: any;
    character_id: any;
}) => Transaction;
import { Transaction } from '@mysten/sui/transactions';
