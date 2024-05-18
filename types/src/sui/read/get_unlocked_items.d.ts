/** @param {import("../../types.js").Context} context */
export function get_unlocked_items({ kiosk_client, types, sui_client }: import("../../types.js").Context): (address: string) => Promise<import("../../types.js").SuiItem[]>;
