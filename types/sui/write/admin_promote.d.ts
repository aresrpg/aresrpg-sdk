/** @param {import("../../../types.js").Context} context */
export function admin_promote({ types }: import("../../../types.js").Context): ({ tx, recipient }: {
    tx?: Transaction;
    recipient: any;
}) => Transaction;
import { Transaction } from '@mysten/sui/transactions';
