export type Context = {
  sui_client: import('@mysten/sui.js/client').SuiClient
  kiosk_client: import('@mysten/kiosk').KioskClient
  types: import('./types-parser.js').SuiIds
  network: import('@mysten/kiosk').Network
}

export type ItemDamage = {
  from: number
  to: number
  damage_type: string
  element: string
}

export type SuiItem = {
  id: string
  name: string
  item_category: string
  item_set: string
  item_type: string
  level: number
  vitality?: number
  wisdom?: number
  strength?: number
  intelligence?: number
  chance?: number
  agility?: number
  range?: number
  movement?: number
  action?: number
  critical?: number
  raw_damage?: number

  critical_chance?: number
  critical_outcomes?: number

  earth_resistance?: number
  fire_resistance?: number
  water_resistance?: number
  air_resistance?: number

  damages: ItemDamage[]

  // kiosk related
  kiosk_id: string
  is_kiosk_personal: boolean
  personal_kiosk_cap_id: string

  // type related
  is_aresrpg_item: boolean
  image_url: string
  _type: string

  // for pets
  last_feed?: number
  feed_level?: number
}

export type SuiCharacter = {
  id: string
  name: string
  classe: string
  sex: string

  position: { x: number; y: number; z: number }
  experience: number
  health: number
  selected: boolean
  soul: number
  available_points: number

  vitality: number
  wisdom: number
  strength: number
  intelligence: number
  chance: number
  agility: number

  kiosk_id: string
  personal_kiosk_cap_id: string

  relic_1?: SuiItem
  relic_2?: SuiItem
  relic_3?: SuiItem
  relic_4?: SuiItem
  relic_5?: SuiItem
  relic_6?: SuiItem
  title?: SuiItem
  amulet?: SuiItem
  weapon?: SuiItem
  left_ring?: SuiItem
  belt?: SuiItem
  right_ring?: SuiItem
  boots?: SuiItem
  hat?: SuiItem
  cloack?: SuiItem
  pet?: SuiItem

  _type: string
}
