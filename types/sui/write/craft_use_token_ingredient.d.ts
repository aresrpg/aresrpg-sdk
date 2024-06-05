/** @param {import("../../../types.js").Context} context */
export function craft_use_token_ingredient({ types }: import("../../../types.js").Context): ({ tx, craft, coin, coin_type }: {
    tx?: Transaction;
    craft: any;
    coin: any;
    coin_type: any;
}) => import("@mysten/sui/transactions").TransactionResult;
import { Transaction } from '@mysten/sui/transactions';
