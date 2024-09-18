/**
 * @param {Vec2} v
 * @returns {Vec2}
 */
function normalize_vec2(v) {
  const length = Math.sqrt(v.x * v.x + v.z * v.z)
  if (length === 0) {
    v.x = 0
    v.z = 0
  }
  v.x /= length
  v.z /= length
  return v
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
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @returns {number}
 */
function dot_vec2(v1, v2) {
  return v1.x * v2.x + v1.z * v2.z
}

class PathFinder {
  /**
   * @private
   * @readonly
   */
  grid
  /**
   * @private
   * @default null
   */
  origin = null

  /**
   * @public
   * @param {Parameters} params
   */
  constructor(params) {
    this.grid = {
      size: params.grid.size,
      cells: params.grid.cells.map((walkable, index) => ({
        walkable,
        distance: -1,
        x: index % params.grid.size.x,
        z: Math.floor(index / params.grid.size.x),
      })),
    }
  }

  /**
   * @public
   * @param {GridCoord} coords
   * @returns {void}
   */
  setOrigin(coords) {
    if (
      this.origin &&
      this.origin.x === coords.x &&
      this.origin.z === coords.z
    ) {
      return
    }
    if (!this.getCell(coords).walkable) {
      return
    }
    this.origin = coords
    for (const cell of this.grid.cells) {
      cell.distance = -1
    }
    this.getCell(this.origin).distance = 0
    const max_distance = 150
    let keep_searching = true
    for (
      let distance = 1;
      distance < max_distance && keep_searching;
      distance++
    ) {
      let found_new_path = false
      const cell_coords = { x: 0, z: 0 }
      for (
        cell_coords.z = 0;
        cell_coords.z < this.grid.size.z;
        cell_coords.z++
      ) {
        for (
          cell_coords.x = 0;
          cell_coords.x < this.grid.size.x;
          cell_coords.x++
        ) {
          const cell = this.getCell(cell_coords)
          if (cell.walkable && cell.distance < 0) {
            // cell has not been reached yet
            for (const neighbour of this.get_neighbouring_cells(cell_coords)) {
              if (neighbour.distance === distance - 1) {
                cell.distance = distance
                found_new_path = true
                break
              }
            }
          }
        }
      }
      keep_searching = found_new_path
    }
    if (keep_searching) {
      throw new Error('Distance is too big to compute.')
    }
  }

  /**
   * @public
   * @param {number} [max_distance=Number.MAX_SAFE_INTEGER]
   * @returns {GridCell[]}
   */
  getReachableCells(max_distance = Number.MAX_SAFE_INTEGER) {
    if (!this.origin) {
      throw new Error('Must specify an origin before asking for a path.')
    }
    const reachable_cells = this.grid.cells.filter(
      cell => cell.distance >= 0 && cell.distance <= max_distance,
    )
    return reachable_cells.map(cell => ({ ...cell }))
  }

  /**
   * @public
   * @param {GridCoord} coords
   * @returns {GridCoord[] | null}
   */
  findPathTo(coords) {
    if (!this.origin) {
      throw new Error('Must specify an origin before asking for a path.')
    }
    const target_cell = this.getCell(coords)
    if (target_cell.distance < 0) {
      // no path
      return null
    }
    const target_to_origin = normalize_vec2(substract_vec2(coords, this.origin))
    let last_cell = target_cell
    const reverse_path = [last_cell]
    while (last_cell.distance > 0) {
      const potential_previous_steps = []
      for (const neighbour of this.get_neighbouring_cells(last_cell)) {
        if (neighbour.distance === last_cell.distance - 1) {
          const neighbour_to_origin = normalize_vec2(
            substract_vec2(neighbour, this.origin),
          )
          const alignment = dot_vec2(target_to_origin, neighbour_to_origin)
          potential_previous_steps.push({ cell: neighbour, alignment })
        }
      }
      // eslint-disable-next-line prefer-destructuring
      let best_previous_step = potential_previous_steps[0]
      if (!best_previous_step) {
        throw new Error()
      }
      for (const potential_previous_step of potential_previous_steps) {
        if (potential_previous_step.alignment > best_previous_step.alignment) {
          best_previous_step = potential_previous_step
        }
      }
      reverse_path.push(best_previous_step.cell)
      last_cell = best_previous_step.cell
    }
    return reverse_path.reverse().map(cell => ({ x: cell.x, z: cell.z }))
  }

  /**
   * @private
   * @param {GridCoord} coords
   * @returns {GridCell}
   */
  getCell(coords) {
    if (
      coords.x < 0 ||
      coords.z < 0 ||
      coords.x >= this.grid.size.x ||
      coords.z >= this.grid.size.z
    ) {
      throw new Error(
        `Invalid grid coords ${coords.x}x${coords.z} (size is ${this.grid.size.x}x${this.grid.size.z})`,
      )
    }
    return this.grid.cells[coords.x + this.grid.size.x * coords.z]
  }

  /**
   * @private
   * @param {GridCoord} coords
   * @returns {GridCell | null}
   */
  try_get_cell(coords) {
    try {
      return this.getCell(coords)
    } catch {}
    return null
  }

  /**
   * @private
   * @param {GridCoord} coords
   * @returns {GridCell[]}
   */
  get_neighbouring_cells(coords) {
    const result = []
    for (const delta of [
      { x: -1, z: 0 },
      { x: +1, z: 0 },
      { x: 0, z: -1 },
      { x: 0, z: 1 },
    ]) {
      const neighbour = this.try_get_cell({
        x: coords.x + delta.x,
        z: coords.z + delta.z,
      })
      if (neighbour) {
        result.push(neighbour)
      }
    }
    return result
  }
}

export { PathFinder }

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
 * @property {boolean} walkable
 * @property {number} distance
 * @property {number} x
 * @property {number} z
 */
/**
 * @typedef {Object} Grid
 * @property {GridCoord} size
 * @property {ReadonlyArray<GridCell>} cells
 */
/**
 * @typedef {Object} Vec2
 * @property {number} x
 * @property {number} z
 */
