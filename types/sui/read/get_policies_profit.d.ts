/** @param {import("../../../types.js").Context} context */
export function get_policies_profit({ sui_client, kiosk_client, types }: import("../../../types.js").Context): (address: any) => Promise<{
    is_owner: boolean;
    character_profits: any;
    item_profits: any;
}>;
