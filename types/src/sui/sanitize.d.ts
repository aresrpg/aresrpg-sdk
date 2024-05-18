/** @typedef {import("@mysten/sui.js/transactions").TransactionBlock} TransactionBlock */
/** @param {TransactionBlock} tx */
export function sanitized(tx: TransactionBlock): import("@mysten/sui.js/transactions").TransactionBlock & {
    _: {
        object: (unkown: any) => any;
        pure: (unkown: any) => any;
    };
};
export type TransactionBlock = import("@mysten/sui.js/transactions").TransactionBlock;
