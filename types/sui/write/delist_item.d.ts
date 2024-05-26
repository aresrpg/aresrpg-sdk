export function delist_item(): ({ tx, kiosk, kiosk_cap, item_id, item_type, }: {
    tx?: TransactionBlock;
    kiosk: any;
    kiosk_cap: any;
    item_id: any;
    item_type: any;
}) => void;
import { TransactionBlock } from '@mysten/sui.js/transactions';
