import { create_world_settings } from './world/world_settings.js'

// @ts-ignore
const schematic_files = import.meta.glob('/src/world/schematics/**/*.schem', {
  eager: true,
  import: 'default',
  query: '?url',
})

const SCHEMATICS_FILES = Object.fromEntries(
  Object.entries(schematic_files).map(([path, url]) => {
    // Extract the path after 'terrain/' and before '.schem'
    const match = path.match(/terrain\/(.+)\.schem/)
    const relative_path = match ? match[1] : path
    return [relative_path, url]
  }),
)

export {
  hex_to_int,
  BLOCKS_COLOR_MAPPING,
  color_to_block_type,
} from './world/world_settings.js'

/** @type {import("@aresrpg/aresrpg-world")["worldEnv"]} */
export const world_settings = create_world_settings(SCHEMATICS_FILES)
