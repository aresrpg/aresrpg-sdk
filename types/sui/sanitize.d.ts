/** @typedef {import("@mysten/sui/transactions").Transaction} Transaction */
/** @param {Transaction} tx */
export function sanitized(tx: Transaction): import("@mysten/sui/transactions").Transaction & {
    _: {
        object: (unkown: any) => any;
        pure: (unkown: any) => any;
    };
};
export type Transaction = import("@mysten/sui/transactions").Transaction;
