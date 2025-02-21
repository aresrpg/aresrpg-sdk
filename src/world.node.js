import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readdirSync, statSync } from 'fs'

import { create_world_settings } from './world/world_settings.js'

function scan_directory(dir, pattern) {
  const files = []

  for (const file of readdirSync(dir)) {
    const path = join(dir, file)
    const stats = statSync(path)

    if (stats.isDirectory()) {
      files.push(...scan_directory(path, pattern))
      continue
    }

    if (pattern.test(path)) files.push(path)
  }

  return files
}

const BASE_DIR = dirname(fileURLToPath(import.meta.url))
const SCHEMATICS_DIR = join(BASE_DIR, 'world/schematics')

const schematic_files = scan_directory(SCHEMATICS_DIR, /\.schem$/)

const SCHEMATICS_FILES = Object.fromEntries(
  schematic_files.map(path => {
    const [, name] = path.match(/world\/schematics\/(.+)\.schem/)
    return [name, path]
  }),
)

if (!Object.keys(SCHEMATICS_FILES).length)
  throw new Error(`No schematics found, path: ${SCHEMATICS_DIR}`)

export {
  hex_to_int,
  BLOCKS_COLOR_MAPPING,
  color_to_block_type,
} from './world/world_settings.js'

/** @type {import("@aresrpg/aresrpg-world")["worldEnv"]} */
export const world_settings = create_world_settings(SCHEMATICS_FILES)
