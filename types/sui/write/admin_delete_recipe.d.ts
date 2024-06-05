/** @param {import("../../../types.js").Context} context */
export function admin_delete_recipe({ types }: import("../../../types.js").Context): ({ tx, admin_cap, recipe }: {
    tx?: Transaction;
    admin_cap: any;
    recipe: any;
}) => Transaction;
import { Transaction } from '@mysten/sui/transactions';
