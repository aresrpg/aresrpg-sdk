export const HSUI = {
  mainnet: {
    address:
      '0x8c47c0bde84b7056520a44f46c56383e714cc9b6a55e919d8736a34ec7ccb533::suicune::SUICUNE',
    decimal: 9,
    iconUrl: 'https://assets.aresrpg.world/tokens/hsui.jpg',
    symbol: 'HSUI',
  },
  testnet: {
    address:
      '0x02a56d35041b2974ec23aff7889d8f7390b53b08e8d8bb91aa55207a0d5dd723::hsui::HSUI',
    decimal: 9,
    iconUrl: 'https://assets.aresrpg.world/tokens/hsui.jpg',
    symbol: 'HSUI',
  },
}
const AFSUI = {
  mainnet: {
    address:
      '0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI',
  },
  testnet: {
    address:
      '0x02a56d35041b2974ec23aff7889d8f7390b53b08e8d8bb91aa55207a0d5dd723::afsui::AFSUI',
    decimal: 9,
  },
}

export const SUPPORTED_TOKENS = network => {
  const result = {
    [HSUI[network]]: { item_type: HSUI[network] },
    [AFSUI[network]]: { item_type: AFSUI[network] },
  }

  delete result['']
  delete result[undefined]

  return result
}
