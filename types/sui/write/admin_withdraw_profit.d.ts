/** @param {import("../../../types.js").Context} context */
export function admin_withdraw_profit({ types, kiosk_client }: import("../../../types.js").Context): ({ tx, address }: {
    tx?: TransactionBlock;
    address: any;
}) => Promise<TransactionBlock>;
import { TransactionBlock } from '@mysten/sui.js/transactions';
