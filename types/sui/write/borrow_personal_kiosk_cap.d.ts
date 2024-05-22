/** @param {import("../../../types.js").Context} context */
export function borrow_personal_kiosk_cap({ kiosk_client }: import("../../../types.js").Context): ({ personal_kiosk_cap_id, tx, handler }: {
    personal_kiosk_cap_id: any;
    tx?: TransactionBlock;
    handler: any;
}) => TransactionBlock;
import { TransactionBlock } from '@mysten/sui.js/transactions';
