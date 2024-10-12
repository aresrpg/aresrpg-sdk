/** @param {import("../../../types.js").Context} context */
export function craft_item({ types }: import("../../../types.js").Context): ({ tx, sale, coin, kiosk, kiosk_cap }: {
    tx?: Transaction;
    sale: any;
    coin: any;
    kiosk: any;
    kiosk_cap: any;
}) => void;
import { Transaction } from '@mysten/sui/transactions';
