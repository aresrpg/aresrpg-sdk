/** @param {import("../../../types.js").Context} context */
export function select_character({ types }: import("../../../types.js").Context): ({ character_id, kiosk_id, kiosk_cap, tx }: {
    character_id: any;
    kiosk_id: any;
    kiosk_cap: any;
    tx?: Transaction;
}) => Transaction;
import { Transaction } from '@mysten/sui/transactions';
