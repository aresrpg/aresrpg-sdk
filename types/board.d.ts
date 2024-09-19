export function iter_board_data(board: any): Generator<{
    index: number;
    pos: {
        x: any;
        y: any;
    };
    data: any;
}, void, unknown>;
export function format_board_data(board_element: any): {
    materialId: any;
    type: any;
};
export function extract_border_blocks(board: any): {
    index: number;
    pos: {
        x: any;
        y: any;
    };
    data: any;
}[];
export function find_split_axis(board: any): {
    x: number;
    y: number;
};
export function sort_by_side(input_blocks: any, board: any): {
    first: any[];
    second: any[];
};
export function random_select_items(items: any, count: any): any[];
