/** @param {import("../../../types.js").Context} context */
export function enforce_personal_kiosk({ kiosk_client }: import("../../../types.js").Context): ({ tx, recipient }: {
    tx?: Transaction;
    recipient: any;
}) => Promise<{
    kiosk_tx: KioskTransaction;
    kiosk_id: import("@mysten/sui/transactions").TransactionObjectArgument;
    kiosk_cap: import("@mysten/sui/transactions").TransactionObjectArgument;
    personal_cap: {
        $kind: "Input";
        Input: number;
        type?: "object";
    };
}>;
import { Transaction } from '@mysten/sui/transactions';
import { KioskTransaction } from '@mysten/kiosk';
