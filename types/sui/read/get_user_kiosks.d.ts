/**
 * Returns all users kiosks and their kiosk caps, (borrow personal ones if needed)
 * @param {import("../../../types.js").Context} context */
export function get_user_kiosks({ kiosk_client }: import("../../../types.js").Context): ({ tx, address }: {
    tx?: Transaction;
    address: any;
}) => Promise<{
    tx: Transaction;
    kiosks: Map<string, () => any>;
    finalize(): void;
}>;
import { Transaction } from '@mysten/sui/transactions';
