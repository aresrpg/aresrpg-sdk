import { experience_to_level } from './experience.js'

const LIFE_PER_LEVEL = 5
const BASE_LIFE = 30

/** @type {(item: import("./../types.js").SuiItem, stat: string) => number} */
function get_item_stat(item, stat) {
  return item?.[stat] ?? 0
}

function get_base_stat(character, stat) {
  switch (stat) {
    case STATISTICS.ACTION:
      return 6
    case STATISTICS.MOVEMENT:
      return 3
    case STATISTICS.CRITICAL:
      return Math.round(get_total_stat(character, STATISTICS.AGILITY) / 40)
    case STATISTICS.RANGE:
    case STATISTICS.RAW_DAMAGE:
    case STATISTICS.EARTH_RESISTANCE:
    case STATISTICS.FIRE_RESISTANCE:
    case STATISTICS.WATER_RESISTANCE:
    case STATISTICS.AIR_RESISTANCE:
      return 0
    default:
      return character[stat]
  }
}

/** @type {(character: import("./../types.js").SuiCharacter, stat: string) => number} */
export function get_total_stat(character, stat) {
  const {
    hat,
    amulet,
    cloak,
    left_ring,
    right_ring,
    belt,
    boots,
    pet,
    weapon,
    relic_1,
    relic_2,
    relic_3,
    relic_4,
    relic_5,
    relic_6,
    title,
  } = character

  const items = [
    hat,
    amulet,
    cloak,
    left_ring,
    right_ring,
    belt,
    boots,
    pet,
    weapon,
    relic_1,
    relic_2,
    relic_3,
    relic_4,
    relic_5,
    relic_6,
    title,
  ]
  const item_stats = items.map((item) => get_item_stat(item, stat))
  return (
    get_base_stat(character, stat) +
    item_stats.reduce((acc, val) => acc + val, 0)
  )
}

/** @type {(character: import("./../types.js").SuiCharacter) => number} */
export function get_max_health(character) {
  const level = experience_to_level(character.experience)
  const vitality = get_total_stat(character, 'vitality')
  // it's okay to include lvl 1 here, let's start at 25
  const life_level_bonus = level * LIFE_PER_LEVEL
  return BASE_LIFE + life_level_bonus + vitality
}

export const STATISTICS = {
  VITALITY: 'vitality',
  WISDOM: 'wisdom',
  STRENGTH: 'strength',
  INTELLIGENCE: 'intelligence',
  CHANCE: 'chance',
  AGILITY: 'agility',

  RANGE: 'range',
  MOVEMENT: 'mp',
  ACTION: 'ap',
  CRITICAL: 'critical',
  RAW_DAMAGE: 'raw_damage',
  CRITICAL_CHANCE: 'critical_chance',
  CRITICAL_OUTCOMES: 'critical_outcomes',
  EARTH_RESISTANCE: 'earth_resistance',
  FIRE_RESISTANCE: 'fire_resistance',
  WATER_RESISTANCE: 'water_resistance',
  AIR_RESISTANCE: 'air_resistance',
}
