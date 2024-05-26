export function list_item(): ({ tx, kiosk, kiosk_cap, item_id, item_type, price, }: {
    tx?: TransactionBlock;
    kiosk: any;
    kiosk_cap: any;
    item_id: any;
    item_type: any;
    price: any;
}) => void;
import { TransactionBlock } from '@mysten/sui.js/transactions';
