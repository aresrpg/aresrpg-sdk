/** @param {import("../../../types.js").Context} context */
export function admin_create_recipe({ types }: import("../../../types.js").Context): ({ tx, admin_cap, level, ingredients, template, }: {
    tx?: Transaction;
    admin_cap: any;
    level: any;
    ingredients: any;
    template: any;
}) => Transaction;
import { Transaction } from '@mysten/sui/transactions';
