export class PathFinder {
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
     * @private
     * @default null
     */
    private origin;
    /**
     * @public
     * @param {GridCoord} coords
     * @returns {void}
     */
    public setOrigin(coords: GridCoord): void;
    /**
     * @public
     * @param {number} [max_distance=Number.MAX_SAFE_INTEGER]
     * @returns {GridCell[]}
     */
    public getReachableCells(max_distance?: number): GridCell[];
    /**
     * @public
     * @param {GridCoord} coords
     * @returns {GridCoord[] | null}
     */
    public findPathTo(coords: GridCoord): GridCoord[] | null;
    /**
     * @private
     * @param {GridCoord} coords
     * @returns {GridCell}
     */
    private get_cell;
    /**
     * @private
     * @param {GridCoord} coords
     * @returns {GridCell | null}
     */
    private try_get_cell;
    /**
     * @private
     * @param {GridCoord} coords
     * @returns {GridCell[]}
     */
    private get_neighbouring_cells;
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
    walkable: boolean;
    distance: number;
    x: number;
    z: number;
};
export type Grid = {
    size: GridCoord;
    cells: ReadonlyArray<GridCell>;
};
export type Vec2 = {
    x: number;
    z: number;
};
