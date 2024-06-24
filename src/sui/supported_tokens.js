export const HSUI = {
  mainnet: '',
  testnet:
    '0x02a56d35041b2974ec23aff7889d8f7390b53b08e8d8bb91aa55207a0d5dd723::hsui::HSUI',
}
const FUD = {
  mainnet: '',
  testnet:
    '0x02a56d35041b2974ec23aff7889d8f7390b53b08e8d8bb91aa55207a0d5dd723::fud::FUD',
}
const AFSUI = {
  mainnet: '',
  testnet:
    '0x02a56d35041b2974ec23aff7889d8f7390b53b08e8d8bb91aa55207a0d5dd723::afsui::AFSUI',
}
const KARES = {
  mainnet: '',
  testnet:
    '0x02a56d35041b2974ec23aff7889d8f7390b53b08e8d8bb91aa55207a0d5dd723::kares::KARES',
}

export const SUPPORTED_TOKENS = network => {
  const result = {
    [HSUI[network]]: { item_type: HSUI[network] },
    [FUD[network]]: { item_type: FUD[network] },
    [AFSUI[network]]: { item_type: AFSUI[network] },
    [KARES[network]]: { item_type: KARES[network] },
  }

  delete result['']
  delete result[undefined]

  return result
}
