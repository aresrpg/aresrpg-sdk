import { vec2_dist, vec2_dot, vec2_sub } from './utils/math.js'

const get_board_center = board_bounds => {
  const { min: origin, max: end } = board_bounds
  const board_size = vec2_sub(end, origin)
  const board_center = {
    x: origin.x + board_size.x / 2,
    y: origin.y + board_size.y / 2,
  }
  return board_center
}

export function* iter_board_data(board) {
  const { min: origin, max: end } = board.bounds
  let index = 0

  for (let { y } = origin; y < end.y; y++) {
    for (let { x } = origin; x < end.x; x++) {
      const type = board.content[index]
      if (type) {
        const pos = { x, y }
        const block = {
          index,
          pos,
          type,
        }
        yield block
      }
      index++
    }
  }
}

export const extract_border_blocks = board => {
  const { min: origin, max: end } = board.bounds
  const board_size = vec2_sub(end, origin)
  const border_blocks = []
  const blocks = iter_board_data(board)
  const is_edge_block = block_index => {
    const neighbours = [
      block_index - 1,
      block_index + 1,
      block_index + board_size.x,
      block_index - board_size.x,
    ].map(index => board.content[index])
    return neighbours.filter(val => val).length < neighbours.length
  }

  for (const block of blocks) {
    if (is_edge_block(block.index)) {
      border_blocks.push(block)
    }
  }
  return border_blocks
}

export const find_split_axis = board => {
  // find nearest edge block from board center
  const board_center = get_board_center(board.bounds)
  let nearest_edge = board.bounds.max

  const edge_blocks = extract_border_blocks(board)
  for (const block of edge_blocks) {
    nearest_edge =
      vec2_dist(block.pos, board_center) < vec2_dist(nearest_edge, board_center)
        ? block.pos
        : nearest_edge
  }

  // compute board dividing axis
  const split_axis = vec2_sub(nearest_edge, board_center)
  return split_axis
}

export const sort_by_side = (input_blocks, board) => {
  const sorted_blocks = {
    first: [],
    second: [],
  }
  const board_center = get_board_center(board.bounds)
  const split_axis = find_split_axis(board)
  const project_axis = { x: split_axis.y, y: -split_axis.x }
  const is_first_side = pos => {
    const diff = vec2_sub(pos, board_center)
    const projection = vec2_dot(diff, project_axis)
    return projection < 0
  }
  for (const block of input_blocks) {
    if (block.type) {
      const is_first_side_block = is_first_side(block.pos)
      is_first_side_block
        ? sorted_blocks.first.push(block)
        : sorted_blocks.second.push(block)
    }
  }
  return sorted_blocks
}

export const random_select_items = (items, count) => {
  const selected = []
  if (items.length > count) {
    while (selected.length < count) {
      const item_index = Math.round(Math.random() * (items.length - 1))
      const item = items[item_index]
      if (item) {
        selected.push(item)
      } else {
        console.warn(
          `unexpected, selected index: ${item_index}, items: `,
          items,
        )
      }
    }
  } else {
    console.warn(
      `bad input: argument count ${count} must be higher than provided items length ${items.length} `,
    )
  }
  return selected
}

export { LineOfSight } from './board/line_of_sight.js'
export { PathFinder } from './board/path_finder.js'
