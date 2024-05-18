/** @param {import("../../types.js").Context} context */
export function admin_freeze_contract({ types }: import("../../types.js").Context): ({ tx }: {
    tx?: TransactionBlock;
}) => TransactionBlock;
import { TransactionBlock } from '@mysten/sui.js/transactions';
