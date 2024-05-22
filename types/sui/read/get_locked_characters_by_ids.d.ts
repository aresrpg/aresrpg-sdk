/** @param {import("../../../types.js").Context} context */
export function get_locked_characters_by_ids({ sui_client, types }: import("../../../types.js").Context): (ids: string[]) => Promise<Map<string, import("../../../types.js").SuiCharacter>>;
