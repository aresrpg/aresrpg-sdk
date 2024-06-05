/** @param {import("../../../types.js").Context} context */
export function craft_start({ types }: import("../../../types.js").Context): ({ tx, recipe }: {
    tx?: Transaction;
    recipe: any;
}) => import("@mysten/sui/transactions").TransactionResult;
import { Transaction } from '@mysten/sui/transactions';
