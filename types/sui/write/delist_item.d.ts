export function delist_item(): ({ tx, kiosk, kiosk_cap, item_id, item_type }: {
    tx?: Transaction;
    kiosk: any;
    kiosk_cap: any;
    item_id: any;
    item_type: any;
}) => void;
import { Transaction } from '@mysten/sui/transactions';
