export function iter_board_data(board: any): Generator<{
    index: number;
    pos: {
        x: any;
        y: any;
    };
    type: any;
}, void, unknown>;
export function get_fight_start_positions({ team_1_blocks, team_2_blocks, max_team_size, }: {
    team_1_blocks?: any[];
    team_2_blocks?: any[];
    max_team_size?: number;
}): {
    team_1: any[];
    team_2: any[];
};
export function extract_border_blocks(board: any): {
    index: number;
    pos: {
        x: any;
        y: any;
    };
    type: any;
}[];
export function find_split_axis(board: any): {
    x: number;
    y: number;
};
export function sort_by_side(input_blocks: any, board: any): {
    first: any[];
    second: any[];
};
export { LineOfSight } from "./board/line_of_sight.js";
export { PathFinder } from "./board/path_finder.js";
