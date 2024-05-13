export type Context = {
  sui_client: import('@mysten/sui.js/client').SuiClient
  kiosk_client: import('@mysten/kiosk').KioskClient
  types: import('./types-parser.js').SuiIds
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

  kiosk_id: string
  personal_kiosk_cap_id: string

  is_aresrpg_item: boolean
}
