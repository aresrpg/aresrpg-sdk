/** @param {import("../../../types.js").Context} context */
export function admin_delete_admin_cap({ types }: import("../../../types.js").Context): ({ tx, admin_cap }: {
    tx?: TransactionBlock;
    admin_cap: any;
}) => TransactionBlock;
import { TransactionBlock } from '@mysten/sui.js/transactions';
