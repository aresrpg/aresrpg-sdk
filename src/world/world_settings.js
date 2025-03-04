import {
  applyWorldEnv,
  BiomeType,
  BlockType,
  getWorldEnv,
} from '@aresrpg/aresrpg-world'

import TEMPERATE from './biomes/temperate.js'
import GRASSLAND from './biomes/grassland.js'
import TROPICAL from './biomes/tropical.js'
import SWAMP from './biomes/swamp.js'
import DESERT from './biomes/desert.js'
import TAIGA from './biomes/taiga.js'
import ARCTIC from './biomes/arctic.js'
import SCORCHED from './biomes/scorched.js'
import GLACIER from './biomes/glacier.js'
import { BLOCKS, SCHEMATICS_BLOCKS } from './blocks.js'

// Convert hex string to number
export const hex_to_int = value => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return parseInt(value.replace('#', ''), 16)
  if (typeof value === 'object' && value !== null) {
    return typeof value.color === 'string'
      ? parseInt(value.color.replace('#', ''), 16)
      : value.color
  }
  throw new Error(`Invalid color value: ${value}`)
}

// Extract unique colors from block definitions
const unique_block_colors = [
  ...new Set(
    Object.values({
      ...BLOCKS,
      ...SCHEMATICS_BLOCKS,
    }),
  ),
]

const normalize_material = value => {
  if (typeof value === 'object' && value !== null) {
    return {
      color: hex_to_int(value.color),
      emission: value.emission ?? 0,
    }
  }
  return hex_to_int(value)
}

// Generate new block type entries for each unique color/material
const additional_block_types = unique_block_colors.reduce(
  (mapping, value, index) => ({
    ...mapping,
    [BlockType.LAST_PLACEHOLDER + index]: normalize_material(value),
  }),
  {},
)

function map_blocks_to_type(biome) {
  return Object.entries(biome).reduce((acc, [key, value]) => {
    // For types that are strings (hex colors) or objects with color property
    const type =
      typeof value.type === 'object' || typeof value.type === 'string'
        ? color_to_block_type[hex_to_int(value.type)]
        : value.type

    // Same for subtypes
    const subtype =
      typeof value.subtype === 'object' || typeof value.subtype === 'string'
        ? color_to_block_type[hex_to_int(value.subtype)]
        : value.subtype

    // If we get undefined, fallback to original value (in case mapping fails)
    return {
      ...acc,
      [key]: {
        ...value,
        type: type !== undefined ? type : value.type,
        subtype: subtype !== undefined ? subtype : value.subtype,
      },
    }
  }, {})
}

// Schematics blocks mapping as NUMBER (block type) to NUMBER (color)
// { 0: 0x000000 }
export const BLOCKS_COLOR_MAPPING = {
  [BlockType.NONE]: 0x000000,
  [BlockType.HOLE]: 0x000000,
  [BlockType.BEDROCK]: 0xababab,
  [BlockType.WATER]: 0x74ccf4,
  [BlockType.ICE]: { color: 0x74ccf5, emission: 0.1 },
  [BlockType.MUD]: 0x795548,
  [BlockType.TRUNK]: 0x795549,
  [BlockType.SAND]: 0xc2b280,
  [BlockType.GRASS]: 0x41980a,
  [BlockType.ROCK]: 0xababab,
  [BlockType.SNOW]: 0xe5e5e5,
  [BlockType.FOLIAGE_LIGHT]: 0x558b2f,
  [BlockType.FOLIAGE_DARK]: 0x33691e,

  ...additional_block_types,
}

// Create a reverse mapping from color to block type id for efficient lookup
export const color_to_block_type = Object.entries(BLOCKS_COLOR_MAPPING).reduce(
  (type_lookup, [type_id, material]) => ({
    ...type_lookup,
    [typeof material === 'object' ? material.color : material]: +type_id,
  }),
  {},
)

// TODO: maybe this is not needed and could be ignored in the world?
const ignored_blocks = [
  'air',
  'jungle_fence',
  'grass',
  'player_wall_head',
  'cobbled_deepslate',
  'iron_trapdoor',
  'iron_bars',
  'stick',
  'stone_brick_slab',
]

// Schematics blocks mapping as STRING (block name) to NUMBER (block type)
// { 'air': 0 }
export const SCHEMATICS_BLOCKS_MAPPING = {
  air: BlockType.NONE,
  ...Object.fromEntries(
    ignored_blocks.map(block_name => [block_name, BlockType.NONE]),
  ),
  ...Object.entries({
    ...BLOCKS,
    ...SCHEMATICS_BLOCKS,
  }).reduce(
    (block_mappings, [block_name, color]) => ({
      ...block_mappings,
      [block_name.toLowerCase()]: color_to_block_type[hex_to_int(color)],
    }),
    {},
  ),
}

export const LANDSCAPE = {
  [BiomeType.Arctic]: map_blocks_to_type(ARCTIC),
  [BiomeType.Desert]: map_blocks_to_type(DESERT),
  [BiomeType.Glacier]: map_blocks_to_type(GLACIER),
  [BiomeType.Grassland]: map_blocks_to_type(GRASSLAND),
  [BiomeType.Scorched]: map_blocks_to_type(SCORCHED),
  [BiomeType.Swamp]: map_blocks_to_type(SWAMP),
  [BiomeType.Taiga]: map_blocks_to_type(TAIGA),
  [BiomeType.Temperate]: map_blocks_to_type(TEMPERATE),
  [BiomeType.Tropical]: map_blocks_to_type(TROPICAL),
}

/** @type {(schematics_files) => import("@aresrpg/aresrpg-world")["worldEnv"]} */
export const create_world_settings = schematics_files => {
  const settings = getWorldEnv({
    seeds: {
      main: 'aresrpg',
      overrides: {},
    },

    patchPowSize: 6,
    cachePowLimit: 2, // 4 => 16 patches radius
    distributionMapPeriod: 4,
    patchViewRanges: {
      near: 4, // undeground view dist
      far: 8, // ground surface view dist
    },

    schematics: {
      globalBlocksMapping: SCHEMATICS_BLOCKS_MAPPING,
      localBlocksMapping: {},
      filesIndex: schematics_files,
    },

    boards: {
      boardRadius: 15,
      boardThickness: 3,
    },

    biomes: {
      rawConf: LANDSCAPE,
      seaLevel: 76,
      periodicity: 8, // size of the biomes
      bilinearInterpolationRange: 0.1, // from 0 to 0.1
    },
  })

  // TODO: This is a global mutation and should be avoided
  applyWorldEnv(settings.rawSettings)

  return settings
}
