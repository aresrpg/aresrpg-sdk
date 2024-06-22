import { ITEM_CATEGORY } from '../items.js'

export const CAPY = {
  mainnet:
    '0xee496a0cc04d06a345982ba6697c90c619020de9e274408c7819f787ff66e1a1::suifrens::SuiFren<0xee496a0cc04d06a345982ba6697c90c619020de9e274408c7819f787ff66e1a1::capy::Capy>',
  testnet:
    '0x80d7de9c4a56194087e0ba0bf59492aa8e6a5ee881606226930827085ddf2332::suifrens::SuiFren<0x80d7de9c4a56194087e0ba0bf59492aa8e6a5ee881606226930827085ddf2332::capy::Capy>',
}
export const BULLSHARK = {
  mainnet:
    '0xee496a0cc04d06a345982ba6697c90c619020de9e274408c7819f787ff66e1a1::suifrens::SuiFren<0x8894fa02fc6f36cbc485ae9145d05f247a78e220814fb8419ab261bd81f08f32::bullshark::Bullshark>',
  testnet:
    '0x80d7de9c4a56194087e0ba0bf59492aa8e6a5ee881606226930827085ddf2332::suifrens::SuiFren<0x297d8afb6ede450529d347cf9254caeea2b685c8baef67b084122291ebaefb38::bullshark::Bullshark>',
}
export const PRIME_MACHIN = {
  testnet: '',
  mainnet:
    '0x034c162f6b594cb5a1805264dd01ca5d80ce3eca6522e6ee37fd9ebfb9d3ddca::factory::PrimeMachin',
}

export const AFEGG = {
  mainnet:
    '0x484932c474bf09f002b82e4a57206a6658a0ca6dbdb15896808dcd1929c77820::egg::AfEgg',
  testnet:
    '0xe638169c0c173d069996cace570b44cf6cb48365c77a058cb4a9bf8ad757a51d::eggdeniyi::AfEggdeniyi',
}

export const VAPOREON = {
  testnet:
    '0xe3a1731e77249efa892e3a050c96f0de1be9bb5ef3c855a50766077be2d8411c::vaporeon::Vaporeon',
}

export const SUPPORTED_NFTS = network => {
  const result = {
    [AFEGG[network]]: {
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
    [CAPY[network]]: {
      item_category: ITEM_CATEGORY.PET,
      item_set: 'SuiFrens',
      item_type: 'suifren_capy',
      level: 3,
      name: 'Capy',
      amount: 1,
    },
    [BULLSHARK[network]]: {
      item_category: ITEM_CATEGORY.PET,
      item_set: 'SuiFrens',
      item_type: 'suifren_bullshark',
      level: 3,
      name: 'Bullshark',
      amount: 1,
    },
    [PRIME_MACHIN[network]]: {
      item_category: ITEM_CATEGORY.TITLE,
      item_set: 'Mirai',
      item_type: 'primemachin',
      level: 10,
      strength: 40,
      intelligence: 40,
      raw_damage: 3,
      amount: 1,
    },
    [VAPOREON[network]]: {
      item_category: ITEM_CATEGORY.PET,
      item_set: 'Hsui',
      item_type: 'vaporeon',
      level: 1,
      amount: 1,
    },
  }

  // prevent undefined values
  delete result['']
  delete result[undefined]

  return result
}
