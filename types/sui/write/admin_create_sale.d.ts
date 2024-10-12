/** @param {import("../../../types.js").Context} context */
export function admin_create_sale({ types }: import("../../../types.js").Context): ({ tx, admin_cap, price, amount, stock, template, }: {
    tx?: Transaction;
    admin_cap: any;
    price: any;
    amount: any;
    stock: any;
    template: any;
}) => Transaction;
import { Transaction } from '@mysten/sui/transactions';
