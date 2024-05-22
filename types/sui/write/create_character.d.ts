/** @param {import("../../../types.js").Context} context */
export function create_character({ types }: import("../../../types.js").Context): ({ tx, name, classe, sex, kiosk_id, kiosk_cap, }: {
    tx?: TransactionBlock;
    name: any;
    classe: any;
    sex?: string;
    kiosk_id: any;
    kiosk_cap: any;
}) => any;
import { TransactionBlock } from '@mysten/sui.js/transactions';
