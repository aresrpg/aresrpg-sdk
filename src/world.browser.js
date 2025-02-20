import { create_world_settings } from './world/world_settings.js'

// @ts-ignore
const schematic_files = import.meta.glob('./world/schematics/**/*.schem', {
  eager: true,
  import: 'default',
  query: '?url',
})

const SCHEMATICS_FILES = Object.fromEntries(
  Object.entries(schematic_files).map(([path, url]) => {
    // Extract everything after 'schematics/' and before '.schem'
    const [, name] = path.match(/schematics\/(.+)\.schem/)
    return [name, url]
  }),
)

if (!Object.keys(SCHEMATICS_FILES).length)
  throw new Error('No schematics found')

export {
  hex_to_int,
  BLOCKS_COLOR_MAPPING,
  color_to_block_type,
} from './world/world_settings.js'

/** @type {import("@aresrpg/aresrpg-world")["worldEnv"]} */
export const world_settings = create_world_settings(SCHEMATICS_FILES)
