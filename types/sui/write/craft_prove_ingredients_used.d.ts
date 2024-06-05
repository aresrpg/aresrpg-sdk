/** @param {import("../../../types.js").Context} context */
export function craft_prove_ingredients_used({ types }: import("../../../types.js").Context): ({ tx, craft }: {
    tx?: Transaction;
    craft: any;
}) => import("@mysten/sui/transactions").TransactionResult;
import { Transaction } from '@mysten/sui/transactions';
