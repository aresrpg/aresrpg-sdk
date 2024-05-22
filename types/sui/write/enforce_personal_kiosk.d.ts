/** @param {import("../../types.js").Context} context */
export function enforce_personal_kiosk({ kiosk_client, types }: import("../../types.js").Context): ({ tx, recipient }: {
    tx?: TransactionBlock;
    recipient: any;
}) => Promise<{
    kiosk_tx: KioskTransaction;
    kiosk_id: any;
    kiosk_cap: any;
}>;
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { KioskTransaction } from '@mysten/kiosk';
