/** @param {import("../../../types.js").Context} context */
export function create_personal_kiosk({ kiosk_client }: import("../../../types.js").Context): ({ tx }: {
    tx?: Transaction;
}) => Promise<{
    kiosk_tx: KioskTransaction;
    kiosk_id: import("@mysten/sui/transactions").TransactionObjectArgument;
    kiosk_cap: import("@mysten/sui/transactions").TransactionObjectArgument;
}>;
import { Transaction } from '@mysten/sui/transactions';
import { KioskTransaction } from '@mysten/kiosk';
