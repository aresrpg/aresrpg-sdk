/** @param {import("../../../types.js").Context} context */
export function admin_withdraw_profit(context: import("../../../types.js").Context): ({ tx, address }: {
    tx?: Transaction;
    address: any;
}) => Promise<Transaction>;
import { Transaction } from '@mysten/sui/transactions';
