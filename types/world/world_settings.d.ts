export function hex_to_int(value: any): any;
export const BLOCKS_COLOR_MAPPING: {
    0: number;
    1: number;
    2: number;
    3: number;
    4: {
        color: number;
        emission: number;
    };
    5: number;
    6: number;
    7: number;
    8: number;
    9: number;
    10: number;
    11: number;
    12: number;
};
export const color_to_block_type: {};
export namespace SCHEMATICS_BLOCKS_MAPPING {
    let air: BlockType;
}
export namespace LANDSCAPE {
    let arctic: {};
    let desert: {};
    let glacier: {};
    let grassland: {};
    let scorched: {};
    let swamp: {};
    let taiga: {};
    let temperate: {};
    let tropical: {};
}
export function create_world_settings(schematics_files: any): WorldLocals;
import { BlockType } from '@aresrpg/aresrpg-world';
import { WorldLocals } from '@aresrpg/aresrpg-world';
