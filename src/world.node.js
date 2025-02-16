import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

import glob_pkg from 'glob'

import { create_world_settings } from './world/world_settings.js'

// Synchronously load all files at startup
const schematic_files = glob_pkg.glob.sync(
  join(dirname(fileURLToPath(import.meta.url)), 'world/schematics/**/*.schem'),
)

const SCHEMATICS_FILES = Object.fromEntries(
  schematic_files.map(path => {
    // Extract the path after 'terrain/' and before '.schem'
    const [, name] = path.match(/world\/schematics\/(.+)\.schem/)
    return [name, path]
  }),
)

export {
  hex_to_int,
  BLOCKS_COLOR_MAPPING,
  color_to_block_type,
} from './world/world_settings.js'

/** @type {import("@aresrpg/aresrpg-world")["worldEnv"]} */
export const world_settings = create_world_settings(SCHEMATICS_FILES)
