/** @param {import("../../../types.js").Context} context */
export function add_stats({ types }: import("../../../types.js").Context): ({ tx, kiosk, kiosk_cap, character_id, stat, amount, }: {
    tx?: Transaction;
    kiosk: any;
    kiosk_cap: any;
    character_id: any;
    stat: any;
    amount: any;
}) => void;
/** @param {import("../../../types.js").Context} context */
export function reset_character_stats({ types }: import("../../../types.js").Context): ({ tx, item_kiosk, item_kiosk_cap, character_kiosk, character_kiosk_cap, character_id, item_id, }: {
    tx?: Transaction;
    item_kiosk: any;
    item_kiosk_cap: any;
    character_kiosk: any;
    character_kiosk_cap: any;
    character_id: any;
    item_id: any;
}) => void;
import { Transaction } from '@mysten/sui/transactions';
