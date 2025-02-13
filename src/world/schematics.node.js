import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

import { glob } from 'glob'

// Synchronously load all files at startup
const schematic_files = glob.sync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../world/schematics/**/*.schem',
  ),
)

export const SCHEMATICS_FILES = Object.fromEntries(
  schematic_files.map(path => {
    // Extract the path after 'terrain/' and before '.schem'
    const [, name] = path.match(/world\/schematics\/(.+)\.schem/)
    return [name, path]
  }),
)
