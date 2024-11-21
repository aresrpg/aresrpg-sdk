/** @param {import("../../../types.js").Context} context */
export function admin_mint_caps({ types }: import("../../../types.js").Context): ({ tx, amount, recipient }: {
    tx?: Transaction;
    amount?: number;
    recipient: any;
}) => Transaction;
import { Transaction } from '@mysten/sui/transactions';
