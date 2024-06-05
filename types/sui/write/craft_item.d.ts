/** @param {import("../../../types.js").Context} context */
export function craft_item({ types }: import("../../../types.js").Context): ({ tx, recipe, finished_craft, kiosk, kiosk_cap, }: {
    tx?: Transaction;
    recipe: any;
    finished_craft: any;
    kiosk: any;
    kiosk_cap: any;
}) => void;
import { Transaction } from '@mysten/sui/transactions';
