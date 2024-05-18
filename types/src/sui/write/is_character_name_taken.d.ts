/** @param {import("../../types.js").Context} context */
export function is_character_name_taken({ types, sui_client }: import("../../types.js").Context): ({ address, name }: {
    address: any;
    name: any;
}) => Promise<boolean>;
