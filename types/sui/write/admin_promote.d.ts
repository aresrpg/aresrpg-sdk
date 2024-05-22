/** @param {import("../../../types.js").Context} context */
export function admin_promote({ types }: import("../../../types.js").Context): ({ tx, recipient }: {
    tx?: TransactionBlock;
    recipient: any;
}) => TransactionBlock;
import { TransactionBlock } from '@mysten/sui.js/transactions';
