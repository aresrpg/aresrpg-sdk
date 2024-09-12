// TODO put Math functions in common utils file

function vec2_sub(v1, v2) {
  return { x: v1.x - v2.x, y: v1.y - v2.y }
}

function vec2_dist(v1, v2) {
  const diff = vec2_sub(v1, v2)
  return Math.sqrt(diff.x * diff.x + diff.y * diff.y)
}

function vec2_dot(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y
}

const get_board_bounds = board => {
  const origin = { x: board.origin.x, y: board.origin.z }
  const end = { x: origin.x + board.size.x, y: origin.y + board.size.y }
  const center = {
    x: origin.x + board.size.x / 2,
    y: origin.y + board.size.y / 2,
  }
  return { origin, end, center }
}

export const format_board_data = board_element => ({
  materialId: board_element.type,
  type: board_element.category,
})

export function* iter_board_data(board) {
  const { origin, end } = get_board_bounds(board)
  let index = 0

  for (let { y } = origin; y < end.y; y++) {
    for (let { x } = origin; x < end.x; x++) {
      const data = board.data[index]
      if (data?.type) {
        const pos = { x, y }
        const block = {
          index,
          pos,
          data,
        }
        yield block
      }
      index++
    }
  }
}

export const extract_border_blocks = board => {
  const border_blocks = []
  const blocks = iter_board_data(board)
  const is_edge_block = block_index => {
    const neighbours = [
      block_index - 1,
      block_index + 1,
      block_index + board.size.x,
      block_index - board.size.x,
    ].map(index => board.data[index]?.type)
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
  const { center, end } = get_board_bounds(board)
  let nearest_edge = end

  const edge_blocks = extract_border_blocks(board)
  for (const block of edge_blocks) {
    nearest_edge =
      vec2_dist(block.pos, center) < vec2_dist(nearest_edge, center)
        ? block.pos
        : nearest_edge
  }

  // compute board dividing axis
  const split_axis = vec2_sub(nearest_edge, center)
  return split_axis
}

export const sort_by_side = (input_blocks, board) => {
  const sorted_blocks = {
    first: [],
    second: [],
  }
  const { center } = get_board_bounds(board)
  const split_axis = find_split_axis(board)
  const project_axis = { x: split_axis.y, y: -split_axis.x }
  const is_first_side = pos => {
    const diff = vec2_sub(pos, center)
    const projection = vec2_dot(diff, project_axis)
    return projection < 0
  }
  for (const block of input_blocks) {
    if (block.data.category === 0) {
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
  while (selected.length < count) {
    const item_index = Math.round(Math.random() * (items.length - 1))
    const item = items[item_index]
    if (item) {
      selected.push(item)
    } else {
      console.warn(`unexpected, selected index: ${item_index}, items: `, items)
    }
  }
  return selected
}
