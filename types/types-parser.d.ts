/** @return {Promise<SuiIds & { LATEST_PACKAGE_ID: string }>} */
export function find_types({ publish_digest, policies_digest, upgrade_digest }: {
    publish_digest: any;
    policies_digest: any;
    upgrade_digest: any;
}, client: any): Promise<SuiIds & {
    LATEST_PACKAGE_ID: string;
}>;
export type SuiIds = ReturnType<typeof parse_result>;
/** @typedef {ReturnType<typeof parse_result>} SuiIds */
declare function parse_result(parsed: any): {
    DISPLAY_CHARACTER: any;
    NAME_REGISTRY: any;
    ADMIN_CAP: any;
    VERSION: any;
    PUBLISHER_CHARACTER: any;
    PUBLISHER_ITEM: any;
    PACKAGE_ID: any;
    UPGRADE_CAP: any;
    DISPLAY_ITEM: any;
    CHARACTER_PROTECTED_POLICY: any;
    ITEM_PROTECTED_POLICY: any;
    CHARACTER_POLICY: any;
    ITEM_POLICY: any;
};
export {};
