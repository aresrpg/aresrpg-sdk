import types from '../types.json' with { type: 'json' }

import {
  AFEGG,
  ANIMA_CHARACTER,
  BULLSHARK,
  CAPY,
  PRIME_MACHIN,
  VAPOREON,
} from './supported_nfts.js'

const POLICIES = {
  VAPOREON: {
    testnet:
      '0xe09afd8f6204162b5e612847f5ab34cab8ab78dbeccc374c661cf2e4a647f93f',
    mainnet: '',
  },
  AFEGG: {
    testnet:
      '0x6e6a70451035b37de75173c61e0ecb6a6edcc712fc4655a1cdd20247c3ec6de4',
    mainnet: '',
  },
  SUIFREN_CAPY: {
    testnet:
      '0xd1ca1cec3875e3183a336ced8c9ee8995e64ab74d8f243889379fff69812a0c9',
    mainnet: '',
  },
  SUIFREN_BULLSHARK: {
    testnet:
      '0xad1a47472658e18963bd50b017ad418177917f6178d80462ca317d98d2d8daf7',
    mainnet: '',
  },
  PRIME_MACHIN: {
    testnet: '',
    mainnet: '',
  },
  ANIMA_CHARACTER: {
    testnet: '',
    mainnet: '',
  },
}

export const TRANSFER_POLICIES = (network) => ({
  [VAPOREON[network]]: POLICIES.VAPOREON[network],
  [AFEGG[network]]: POLICIES.AFEGG[network],
  [CAPY[network]]: POLICIES.SUIFREN_CAPY[network],
  [BULLSHARK[network]]: POLICIES.SUIFREN_BULLSHARK[network],
  [PRIME_MACHIN[network]]: POLICIES.PRIME_MACHIN[network],
  [ANIMA_CHARACTER[network]]: POLICIES.ANIMA_CHARACTER[network],
  [`${types.PACKAGE_ID}::item::Item`]: types.ITEM_POLICY,
  [`${types.PACKAGE_ID}::character::Character`]: types.CHARACTER_POLICY,
})

// {
//   events(filter: { eventType: "0x2::transfer_policy::TransferPolicyCreated<type>"}) {
//     nodes {
//       contents {
//         json
//       }
//     }
//   }
// }
