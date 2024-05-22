/** @param {import("../../types.js").Context} context */
export function get_pet_feed_value({ sui_client, types }: import("../../types.js").Context): (pet_id: any) => Promise<{
    last_feed: any;
    stomach: any;
}>;
