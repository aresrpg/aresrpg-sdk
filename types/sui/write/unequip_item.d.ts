/** @param {import("../../../types.js").Context} context */
export function unequip_item({ types }: import("../../../types.js").Context): ({ tx, kiosk, kiosk_cap, item_kiosk, character_id, slot, item_type, }: {
    tx?: TransactionBlock;
    kiosk: any;
    kiosk_cap: any;
    item_kiosk: any;
    character_id: any;
    slot: any;
    item_type: any;
}) => TransactionBlock;
import { TransactionBlock } from '@mysten/sui.js/transactions';
