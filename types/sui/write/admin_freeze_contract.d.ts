/** @param {import("../../../types.js").Context} context */
export function admin_freeze_contract({ types }: import("../../../types.js").Context): ({ tx }: {
    tx?: Transaction;
}) => Transaction;
import { Transaction } from '@mysten/sui/transactions';
