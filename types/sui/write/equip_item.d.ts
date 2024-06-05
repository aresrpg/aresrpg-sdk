/** @param {import("../../../types.js").Context} context */
export function equip_item({ types }: import("../../../types.js").Context): ({ tx, kiosk, kiosk_cap, item_kiosk, item_kiosk_cap, item_id, character_id, slot, item_type, }: {
    tx?: Transaction;
    kiosk: any;
    kiosk_cap: any;
    item_kiosk: any;
    item_kiosk_cap: any;
    item_id: any;
    character_id: any;
    slot: any;
    item_type: any;
}) => Transaction;
import { Transaction } from '@mysten/sui/transactions';
