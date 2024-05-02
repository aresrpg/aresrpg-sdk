import { experience_to_level } from './experience.js'

const LIFE_PER_LEVEL = 5
const BASE_LIFE = 30

export function get_max_health({ experience, vitality }) {
  const level = experience_to_level(experience)
  // it's okay to include lvl 1 here, let's start at 25
  const life_level_bonus = level * LIFE_PER_LEVEL
  return BASE_LIFE + life_level_bonus + vitality
}
