export function parse_sui_object({ types }: {
    types: any;
}, object: any): any;
/** @return {Promise<import("@mysten/sui/client").SuiObjectResponse>} */
export function get_dynamic_field_object(sui_client: any, params: any): Promise<import("@mysten/sui/client").SuiObjectResponse>;
export function get_purchase_caps(context: any, caps: any): Promise<any>;
export function get_recipe(context: import("../../types.js").Context, id: string): Promise<import("../../types.js").Recipe>;
export function get_items(context: import("../../types.js").Context, ids: string[], options?: {
    allow_characters?: boolean;
}): Promise<Map<string, import("../../types.js").SuiItem>>;
