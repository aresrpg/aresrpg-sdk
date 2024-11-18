export class LineOfSight {
    /**
     * @public
     * @param {Parameters} params
     */
    constructor(params: Parameters);
    /**
     * @private
     * @readonly
     */
    private readonly grid;
    /**
     * @public
     * @param {GridCoord} origin
     * @param {number} max_distance
     * @returns {GridVisibility}
     */
    public compute_cells_visibility(origin: GridCoord, max_distance: number): GridVisibility;
}
export type GridCoord = {
    x: number;
    z: number;
};
export type InputGrid = {
    size: GridCoord;
    cells: ReadonlyArray<boolean>;
};
export type Parameters = {
    grid: InputGrid;
};
export type GridCell = {
    viewBlocking: boolean;
    x: number;
    z: number;
};
export type Grid = {
    size: GridCoord;
    cells: ReadonlyArray<GridCell>;
};
export type CellVisibility = "visible" | "hidden" | "neutral";
export type GridVisibility = {
    size: GridCoord;
    cells: ReadonlyArray<{
        x: number;
        z: number;
        visibility: CellVisibility;
    }>;
};
export type Vec2 = {
    x: number;
    z: number;
};
