export type Vec2 = {
    x: number;
    z: number;
};

export type Vec3 = {
    x: number;
    y: number;
    z: number;
};

export enum BlockCategory {
    FLAT = 0,
    HOLE = 1,
    OBSTACLE = 2,
}

export type BlockType = number

export type BoardBlock = {
    type: BlockType
    category: BlockCategory
}

export type BoardData = {
    origin: Vec3
    size: Vec2
    data: BoardBlock[]
}

export * as BoardUtils from "../src/board_utils"

export function splitBoard(board: BoardData)