/** @param {import("../../../types.js").Context} context */
export function add_stats({ types }: import("../../../types.js").Context): ({ tx, kiosk, kiosk_cap, character_id, stat, amount, }: {
    tx?: Transaction;
    kiosk: any;
    kiosk_cap: any;
    character_id: any;
    stat: any;
    amount: any;
}) => void;
import { Transaction } from '@mysten/sui/transactions';
