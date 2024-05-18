export function parse_sui_object(object: any): any;
export function parse_character({ sui_client, types }: {
    sui_client: any;
    types: any;
}): (character: any) => Promise<import("../types.js").SuiCharacter>;
export function parse_item({ sui_client, types }: {
    sui_client: any;
    types: any;
}): (item: any) => Promise<import("../types.js").SuiItem>;
