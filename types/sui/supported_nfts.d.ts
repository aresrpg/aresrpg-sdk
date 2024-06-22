export namespace CAPY {
    let mainnet: string;
    let testnet: string;
}
export namespace BULLSHARK {
    let mainnet_1: string;
    export { mainnet_1 as mainnet };
    let testnet_1: string;
    export { testnet_1 as testnet };
}
export namespace PRIME_MACHIN {
    let testnet_2: string;
    export { testnet_2 as testnet };
    let mainnet_2: string;
    export { mainnet_2 as mainnet };
}
export namespace AFEGG {
    let mainnet_3: string;
    export { mainnet_3 as mainnet };
    let testnet_3: string;
    export { testnet_3 as testnet };
}
export namespace VAPOREON {
    let testnet_4: string;
    export { testnet_4 as testnet };
}
export function SUPPORTED_NFTS(network: any): {
    [x: number]: {
        item_category: string;
        item_set: string;
        item_type: string;
        level: number;
        wisdom: number;
        earth_resistance: number;
        fire_resistance: number;
        water_resistance: number;
        air_resistance: number;
        amount: number;
        name?: undefined;
        strength?: undefined;
        intelligence?: undefined;
        raw_damage?: undefined;
    } | {
        item_category: string;
        item_set: string;
        item_type: string;
        level: number;
        name: string;
        amount: number;
        wisdom?: undefined;
        earth_resistance?: undefined;
        fire_resistance?: undefined;
        water_resistance?: undefined;
        air_resistance?: undefined;
        strength?: undefined;
        intelligence?: undefined;
        raw_damage?: undefined;
    } | {
        item_category: string;
        item_set: string;
        item_type: string;
        level: number;
        strength: number;
        intelligence: number;
        raw_damage: number;
        amount: number;
        wisdom?: undefined;
        earth_resistance?: undefined;
        fire_resistance?: undefined;
        water_resistance?: undefined;
        air_resistance?: undefined;
        name?: undefined;
    } | {
        item_category: string;
        item_set: string;
        item_type: string;
        level: number;
        amount: number;
        wisdom?: undefined;
        earth_resistance?: undefined;
        fire_resistance?: undefined;
        water_resistance?: undefined;
        air_resistance?: undefined;
        name?: undefined;
        strength?: undefined;
        intelligence?: undefined;
        raw_damage?: undefined;
    };
};
