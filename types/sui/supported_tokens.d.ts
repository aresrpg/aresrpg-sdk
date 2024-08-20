export namespace HSUI {
    namespace mainnet {
        let address: string;
        let decimal: number;
        let iconUrl: string;
        let symbol: string;
    }
    namespace testnet {
        let address_1: string;
        export { address_1 as address };
        let decimal_1: number;
        export { decimal_1 as decimal };
        let iconUrl_1: string;
        export { iconUrl_1 as iconUrl };
        let symbol_1: string;
        export { symbol_1 as symbol };
    }
}
export function SUPPORTED_TOKENS(network: any): {
    [x: number]: any;
};
