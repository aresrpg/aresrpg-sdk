import { ITEM_CATEGORY } from '../items.js'

export const BULLSHARK =
  '0x80d7de9c4a56194087e0ba0bf59492aa8e6a5ee881606226930827085ddf2332::suifrens::SuiFren<0x80d7de9c4a56194087e0ba0bf59492aa8e6a5ee881606226930827085ddf2332::capy::Capy>'
export const PRIME_MACHIN =
  '0x034c162f6b594cb5a1805264dd01ca5d80ce3eca6522e6ee37fd9ebfb9d3ddca::factory::PrimeMachin'

export const EGGDENIYI =
  '0xe638169c0c173d069996cace570b44cf6cb48365c77a058cb4a9bf8ad757a51d::eggdeniyi::AfEggdeniyi'

export const SUPPORTED_NFTS = {
  [EGGDENIYI]: {
    item_category: ITEM_CATEGORY.PET,
    item_set: 'Aftermath',
    item_type: 'afegg',
    level: 5,
    wisdom: 30,
    earth_resistance: 3,
    fire_resistance: 3,
    water_resistance: 3,
    air_resistance: 3,
    amount: 1,
  },
  [BULLSHARK]: {
    item_category: ITEM_CATEGORY.PET,
    item_set: 'SuiFrens',
    item_type: 'suifren_capy',
    level: 3,
    name: 'Capy',
    amount: 1,
  },
  [PRIME_MACHIN]: {
    item_category: ITEM_CATEGORY.PET,
    item_set: 'Mirai',
    item_type: 'prime_machin',
    level: 10,
    strength: 40,
    intelligence: 40,
    raw_damage: 3,
    amount: 1,
  },
}
