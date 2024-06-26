/** @param {import("../../../types.js").Context} context */
export function feed_suifren({ types, network }: import("../../../types.js").Context): ({ tx, kiosk_id, kiosk_cap, suifren_id, coin, fren_type, }: {
    tx?: Transaction;
    kiosk_id: any;
    kiosk_cap: any;
    suifren_id: any;
    coin: any;
    fren_type: any;
}) => void;
import { Transaction } from '@mysten/sui/transactions';
