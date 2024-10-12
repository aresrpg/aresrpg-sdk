/** @param {import("../../../types.js").Context} context */
export function admin_withdraw_sale_profits({ types }: import("../../../types.js").Context): ({ tx, recipient, admin_cap, sale }: {
    tx?: Transaction;
    recipient: any;
    admin_cap: any;
    sale: any;
}) => Transaction;
import { Transaction } from '@mysten/sui/transactions';
