// dofus retro lvl divided by 10 (to keep u32 on move module)
export const levels = [
  0, // levels starts at 1
  0,
  11,
  71,
  165,
  308,
  528,
  803,
  1155,
  1595,
  2112,
  2772,
  3586,
  4510,
  5555,
  6710,
  8250,
  10010,
  12650,
  15620,
  18810,
  22220,
  25850,
  29700,
  34100,
  38830,
  43835,
  49280,
  55330,
  61710,
  68376,
  75570,
  83050,
  91190,
  100100,
  110000,
  121900,
  135800,
  151700,
  169600,
  189500,
  211400,
  235300,
  261200,
  289100,
  319000,
  350900,
  384800,
  420700,
  458600,
  498500,
  540400,
  584300,
  630200,
  678100,
  728000,
  779900,
  833800,
  889700,
  947600,
  1007500,
  1069400,
  1133300,
  1199200,
  1267100,
  1337000,
  1408900,
  1482800,
  1558700,
  1636600,
  1716500,
  1798400,
  1882300,
  1968200,
  2056100,
  2146000,
  2237900,
  2331800,
  2427700,
  2525600,
  2625500,
  2727400,
  2831300,
  2937200,
  3045100,
  3155000,
  3266900,
  3380800,
  3496700,
  3614600,
  3734500,
  3856400,
  3980300,
  4106200,
  4234100,
  4364000,
  4495900,
  4629800,
  4765700,
  4903600,
  5043500,
]

const reversed_levels = [...levels.entries()].reverse()

/**
 * find the current level and the remaining
 * experience from the total experience
 * @type {(total_experience: number) => number}
 */
export function experience_to_level(total_experience) {
  const [current_level] = reversed_levels.find(
    ([, level_experience]) => level_experience <= total_experience
  ) ?? [levels.length]

  if (current_level + 1 >= levels.length) return levels.length - 1
  return current_level
}

export function level_to_experience(level = 1) {
  return levels[level] ?? 0
}
