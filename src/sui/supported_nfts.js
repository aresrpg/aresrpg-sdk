import { ITEM_CATEGORY } from '../items.js'

const BULLSHARK =
  '0xee496a0cc04d06a345982ba6697c90c619020de9e274408c7819f787ff66e1a1::suifrens::SuiFren<0x8894fa02fc6f36cbc485ae9145d05f247a78e220814fb8419ab261bd81f08f32::bullshark::Bullshark>'
const PRIME_MACHIN =
  '0x034c162f6b594cb5a1805264dd01ca5d80ce3eca6522e6ee37fd9ebfb9d3ddca::factory::PrimeMachin'

const EGGDENIYI =
  '0xe638169c0c173d069996cace570b44cf6cb48365c77a058cb4a9bf8ad757a51d::eggdeniyi::AfEggdeniyi'

const SUPPORTED_NFTS = {
  [EGGDENIYI]: {
    item_category: ITEM_CATEGORY.PET,
    item_set: 'Aftermath',
    item_type: 'eggdeniyi',
    level: 5,
    wisdom: 30,
    earth_resistance: 3,
    fire_resistance: 3,
    water_resistance: 3,
    air_resistance: 3,
  },
  [BULLSHARK]: {
    item_category: ITEM_CATEGORY.PET,
    item_set: 'SuiFrens',
    item_type: 'bullshark',
    level: 1,
    vitality: 20,
  },
  [PRIME_MACHIN]: {
    item_category: ITEM_CATEGORY.PET,
    item_set: 'Mirai',
    item_type: 'prime_machin',
    level: 10,
    strength: 40,
    intelligence: 40,
    raw_damage: 3,
  },
}

export function enforce_ares_item(item, types) {
  item.is_aresrpg_item = item._type === `${types.PACKAGE_ID}::item::Item`

  if (item.is_aresrpg_item) return item

  const external_item = SUPPORTED_NFTS[item._type]

  if (!external_item) return null

  return {
    ...item,
    ...external_item,
  }
}
