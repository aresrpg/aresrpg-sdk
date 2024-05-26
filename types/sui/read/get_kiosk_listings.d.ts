/** @param {import("../../../types.js").Context} context */
export function get_kiosk_listings({ sui_client }: import("../../../types.js").Context): ({ type, last_list, last_delist, last_purchase }: {
    type: any;
    last_list: any;
    last_delist: any;
    last_purchase: any;
}) => Promise<{
    listings: ListingsMap;
    cursor_list: any;
    cursor_purchase: any;
    cursor_delist: any;
}>;
export function item_listed(type: any): string;
export function item_purchased(type: any): string;
export function item_delisted(type: any): string;
declare class ListingsMap extends Map<any, any> {
    constructor();
    constructor(entries?: readonly (readonly [any, any])[]);
    constructor();
    constructor(iterable?: Iterable<readonly [any, any]>);
    set(key: any, value: any): this;
    delete(key: any, timestamp: any): boolean;
}
export {};
