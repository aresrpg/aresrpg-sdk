/**
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @returns {number}
 */
function distance_vec2(v1, v2) {
  const delta = substract_vec2(v1, v2)
  return Math.sqrt(delta.x * delta.x + delta.z * delta.z)
}

/**
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @returns {Vec2}
 */
function substract_vec2(v1, v2) {
  return { x: v1.x - v2.x, z: v1.z - v2.z }
}

/**
 * @param {Vec2} p1
 * @param {Vec2} p2
 * @param {Vec2} p3
 * @returns {number}
 */
function sign(p1, p2, p3) {
  return (p1.x - p3.x) * (p2.z - p3.z) - (p2.x - p3.x) * (p1.z - p3.z)
}

/**
 * @param {Vec2} pt
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @param {Vec2} v3
 * @returns {boolean}
 */
function is_point_in_triangle(pt, v1, v2, v3) {
  const d1 = sign(pt, v1, v2)
  const d2 = sign(pt, v2, v3)
  const d3 = sign(pt, v3, v1)
  const has_neg = d1 < 0 || d2 < 0 || d3 < 0
  const has_pos = d1 > 0 || d2 > 0 || d3 > 0
  return !(has_neg && has_pos)
}

export class LineOfSight {
  /**
   * @private
   * @readonly
   */
  grid

  /**
   * @public
   * @param {Parameters} params
   */
  constructor(params) {
    this.grid = {
      size: params.grid.size,
      cells: params.grid.cells.map((view_blocking, index) => ({
        viewBlocking: view_blocking,
        x: index % params.grid.size.x,
        z: Math.floor(index / params.grid.size.x),
      })),
    }
  }

  /**
   * @public
   * @param {GridCoord} origin
   * @param {number} max_distance
   * @returns {GridVisibility}
   */
  compute_cells_visibility(origin, max_distance) {
    const result = {
      size: { ...this.grid.size },
      cells: this.grid.cells.map(cell => ({
        x: cell.x,
        z: cell.z,
        visibility:
          distance_vec2(origin, cell) > max_distance ? 'neutral' : 'visible',
      })),
    }
    const set_cell_visibility = (coords, visibility) => {
      if (
        coords.x < 0 ||
        coords.z < 0 ||
        coords.x >= this.grid.size.x ||
        coords.z >= this.grid.size.z
      ) {
        return
      }
      const index = coords.x + coords.z * this.grid.size.x
      result.cells[index].visibility = visibility
    }
    const viewer_position = { x: origin.x + 0.5, z: origin.z + 0.5 }
    const apply_cast_shadow = (s1, s2, min_distance) => {
      const p1 = viewer_position
      const p2 = {
        x: viewer_position.x + 10000 * (s1.x - viewer_position.x),
        z: viewer_position.z + 10000 * (s1.z - viewer_position.z),
      }
      const p3 = {
        x: viewer_position.x + 10000 * (s2.x - viewer_position.x),
        z: viewer_position.z + 10000 * (s2.z - viewer_position.z),
      }
      for (let i_z = 0; i_z < this.grid.size.z; i_z++) {
        for (let i_x = 0; i_x < this.grid.size.x; i_x++) {
          const cell_center = { x: i_x + 0.5, z: i_z + 0.5 }
          const distance_from_viewer = distance_vec2(
            cell_center,
            viewer_position,
          )
          if (
            distance_from_viewer >= min_distance &&
            distance_from_viewer <= max_distance
          ) {
            if (is_point_in_triangle(cell_center, p1, p2, p3)) {
              set_cell_visibility({ x: i_x, z: i_z }, 'hidden')
            }
          }
        }
      }
    }
    for (const cell of this.grid.cells.filter(cell => cell.viewBlocking)) {
      const cell_center = { x: cell.x + 0.5, z: cell.z + 0.5 }
      const cell_distance_from_viewer = distance_vec2(
        viewer_position,
        cell_center,
      )
      if (cell_distance_from_viewer > max_distance) {
        continue
      }
      const e = 0.01
      const c1 = { x: cell.x + 0.0 + e, z: cell.z + 0.0 + e }
      const c2 = { x: cell.x + 0.0 + e, z: cell.z + 1.0 - e }
      const c3 = { x: cell.x + 1.0 - e, z: cell.z + 1.0 - e }
      const c4 = { x: cell.x + 1.0 - e, z: cell.z + 0.0 + e }
      const segments = [
        [c1, c2],
        [c2, c3],
        [c3, c4],
        [c4, c1],
      ]
      for (const segment of segments) {
        apply_cast_shadow(
          segment[0],
          segment[1],
          cell_distance_from_viewer + 0.001,
        )
      }
    }
    // @ts-ignore
    return result
  }
}

/**
 * @typedef {Object} GridCoord
 * @property {number} x
 * @property {number} z
 */
/**
 * @typedef {Object} InputGrid
 * @property {GridCoord} size
 * @property {ReadonlyArray<boolean>} cells
 */
/**
 * @typedef {Object} Parameters
 * @property {InputGrid} grid
 */
/**
 * @typedef {Object} GridCell
 * @property {boolean} viewBlocking
 * @property {number} x
 * @property {number} z
 */
/**
 * @typedef {Object} Grid
 * @property {GridCoord} size
 * @property {ReadonlyArray<GridCell>} cells
 */
/** @typedef {'visible' | 'hidden' | 'neutral'} CellVisibility */
/**
 * @typedef {Object} GridVisibility
 * @property {GridCoord} size
 * @property {ReadonlyArray<{ x: number; z: number; visibility: CellVisibility }>} cells
 */
/**
 * @typedef {Object} Vec2
 * @property {number} x
 * @property {number} z
 */
