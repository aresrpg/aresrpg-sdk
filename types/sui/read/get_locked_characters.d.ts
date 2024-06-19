/** @param {import("../../../types.js").Context} context */
export function get_locked_characters({ kiosk_client, types, sui_client, network, }: import("../../../types.js").Context): (address: string) => Promise<import("../../../types.js").SuiCharacter[]>;
