/** @param {import("../../../types.js").Context} context */
export function admin_delete_admin_cap({ types }: import("../../../types.js").Context): ({ tx, admin_cap }: {
    tx?: Transaction;
    admin_cap: any;
}) => Transaction;
import { Transaction } from '@mysten/sui/transactions';
