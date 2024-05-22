/** @param {import("../../types.js").Context} context */
export function delete_character({ types }: import("../../types.js").Context): ({ tx, kiosk_id, kiosk_cap, character_id, }: {
    tx?: TransactionBlock;
    kiosk_id: any;
    kiosk_cap: any;
    character_id: any;
}) => TransactionBlock;
import { TransactionBlock } from '@mysten/sui.js/transactions';
