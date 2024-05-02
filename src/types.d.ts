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
  available_stat_points: number

  vitality: number
  wisdom: number
  strength: number
  intelligence: number
  chance: number
  agility: number
}
