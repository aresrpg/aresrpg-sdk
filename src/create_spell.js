/* eslint-disable @typescript-eslint/naming-convention */
import { writeFile } from 'fs/promises'

const DamageEffect = ({
  min = 0, // min value apllied to the target
  max = min, // max value applied to the target
  target = 'cell', // target of the spell ['cell', 'self', 'allies', 'enemies', 'trap']
  element = 'raw', // element of the spell ['raw', 'earth', 'fire', 'water', 'air']
  chance = 100, // chance of the effect to trigger
}) => ({
  type: 'damage',
  min,
  max,
  target,
  element,
  chance,
})

// effect applied at the end of the turn
const PoisonEffect = ({
  min = 0, // min value apllied to the target
  max = min, // max value applied to the target
  target = 'cell', // target of the spell ['cell', 'self', 'allies', 'enemies', 'trap']
  chance = 100, // chance of the effect to trigger
  turns = 0, // number of turns the effect lasts
  element = 'raw', // element of the spell ['raw', 'earth', 'fire', 'water', 'air']
}) => ({
  type: 'poison',
  min,
  max,
  target,
  element,
  chance,
  turns,
})

// effect applied at the start of the turn
const CurseEffect = ({
  min = 0, // min value apllied to the target
  max = min, // max value applied to the target
  target = 'cell', // target of the spell ['cell', 'self', 'allies', 'enemies', 'trap']
  chance = 100, // chance of the effect to trigger
  turns = 0, // number of turns the effect lasts
  element = 'raw', // element of the spell ['raw', 'earth', 'fire', 'water', 'air']
}) => ({
  type: 'curse',
  min,
  max,
  target,
  chance,
  turns,
  element,
})

const AddEffect = ({
  min = 0, // min value apllied to the target
  max = min, // max value applied to the target
  target = 'cell', // target of the spell ['cell', 'self', 'allies', 'enemies', 'trap']
  chance = 100, // chance of the effect to trigger
  turns = 0, // number of turns the effect lasts
  statistic = 'damage', // statistic to add ['ap', 'mp', 'range', 'damage', 'critical', 'wisdom', 'strength', 'intelligence', 'chance', 'agility']
}) => ({
  type: 'add',
  min,
  max,
  target,
  chance,
  turns,
  statistic,
})

const TrapModifierEffect = ({
  modifier = 'heal', // modifier to apply ['heal', 'add_damage', 'cancel_damage']
  turns = 1, // number of turns the effect lasts
  chance = 100, // chance of the effect to trigger
}) => ({
  type: 'trap_modifier',
  modifier,
  turns,
  chance,
})

const TeleportEffect = ({
  chance = 100, // chance of the effect to trigger
}) => ({
  type: 'teleport',
  chance,
})

const HealEffect = ({
  min = 0, // min value apllied to the target
  max = min, // max value applied to the target
  target = 'cell', // target of the spell ['cell', 'self', 'allies', 'enemies', 'trap']
  chance = 100, // chance of the effect to trigger
  turns = 0, // number of turns the effect lasts
}) => ({
  type: 'heal',
  min,
  max,
  target,
  chance,
  turns,
})

const StealEffect = ({
  min = 0, // min value apllied to the target
  max = min, // max value applied to the target
  target = 'cell', // target of the spell ['cell', 'self', 'allies', 'enemies', 'trap']
  chance = 100, // chance of the effect to trigger
  turns = 0, // number of turns the effect lasts
  statistic = 'health', // statistic to steal ['health', 'ap', 'mp', 'range', 'damage', 'wisdom', 'strength', 'intelligence', 'chance', 'agility']
}) => ({
  type: 'steal',
  min,
  max,
  target,
  chance,
  turns,
  statistic,
})

const PushEffect = ({
  distance = 1, // distance of the push
  chance = 100, // chance of the effect to trigger
}) => ({
  type: 'push',
  distance,
  chance,
})

const Level = ({
  cost = 1,
  range = [0, 0],
  critical_chance = 100,
  area = 1,
  area_type = 'square',
  casts_per_turn = 0,
  casts_per_target = 0,
  turns_to_recast = 0,
  modifiable_range = true,
  line_of_sight = true,
  linear = false,
  free_cell = false,
  can_critical = true,
  base_effects = [],
  critical_effects = [],
}) => ({
  cost,
  range,
  critical_chance,
  area,
  area_type,
  casts_per_turn,
  casts_per_target,
  turns_to_recast,
  modifiable_range,
  line_of_sight,
  linear,
  free_cell,
  can_critical,
  base_effects,
  critical_effects,
})

const Spell = ({
  name = '',
  icon = '',
  level = 1,
  description = '',
  levels = [Level()],
} = {}) => ({
  name,
  icon,
  level,
  description,
  levels,
})

const iop = {
  slash: Spell({
    name: 'Slash',
    icon: 'iop_slash',
    description:
      'A quick, powerful strike dealing significant damage to a single target within close range.',
    levels: [
      Level({
        cost: 5,
        range: [1, 2],
        modifiable_range: false,
        base_effects: [DamageEffect({ min: 5, max: 10, element: 'earth' })],
        critical_effects: [
          DamageEffect({ min: 7, max: 12, element: 'earth' }),
          PushEffect({ distance: 1, chance: 30 }),
        ],
      }),
      Level({
        cost: 4,
        range: [1, 2],
        modifiable_range: false,
        base_effects: [DamageEffect({ min: 6, max: 13, element: 'earth' })],
        critical_effects: [
          DamageEffect({ min: 7, max: 15, element: 'earth' }),
          PushEffect({ distance: 1, chance: 30 }),
        ],
      }),
    ],
  }),
  jump: Spell({
    name: 'Jump',
    icon: 'iop_jump',
    description:
      'Jump to any targeted cell within range, bypassing obstacles and positioning for tactical advantages.',
    levels: [
      Level({
        cost: 5,
        range: [1, 4],
        modifiable_range: false,
        free_cell: true,
        line_of_sight: false,
        can_critical: false,
        base_effects: [TeleportEffect({})],
      }),
    ],
  }),
  rage: Spell({
    level: 1,
    name: 'Rage',
    icon: 'iop_rage',
    description:
      'Boosts the damage output of the Iop or an ally for several turns, enhancing any attacks.',
    levels: [
      Level({
        cost: 2,
        range: [0, 0],
        critical_chance: 40,
        turns_to_recast: 4,
        area: 2,
        area_type: 'circle',
        base_effects: [
          AddEffect({ min: 3, max: 7, turns: 2, statistic: 'damage' }),
        ],
        critical_effects: [
          AddEffect({ min: 5, max: 10, turns: 3, statistic: 'damage' }),
        ],
      }),
    ],
  }),
}

const sram = {
  trap: Spell({
    name: 'Trap',
    icon: 'sram_trap',
    description:
      'Places an invisible trap on the ground that detonates for damage when an enemy steps on it.',
    levels: [
      Level({
        cost: 4,
        range: [1, 4],
        free_cell: true,
        can_critical: false,
        line_of_sight: false,
        base_effects: [
          DamageEffect({
            min: 5,
            max: 9,
            element: 'earth',
            target: 'trap',
          }),
          PoisonEffect({
            min: 1,
            max: 3,
            turns: 2,
            element: 'air',
            target: 'trap',
            chance: 10,
          }),
        ],
      }),
    ],
  }),
  unfazed: Spell({
    name: 'Unfazed',
    icon: 'sram_unfazed',
    description:
      'Grants immunity to trap effects for the turn and may heal or strengthen the Sram if he pass over one.',
    levels: [
      Level({
        cost: 2,
        turns_to_recast: 4,
        base_effects: [
          TrapModifierEffect({ modifier: 'cancel_damage', turns: 2 }),
          TrapModifierEffect({ modifier: 'heal', chance: 50, turns: 2 }),
          TrapModifierEffect({
            modifier: 'add_damage',
            chance: 50,
            turns: 2,
          }),
        ],
        critical_effects: [
          TrapModifierEffect({ modifier: 'cancel_damage', turns: 3 }),
          TrapModifierEffect({ modifier: 'heal', chance: 50, turns: 3 }),
          TrapModifierEffect({
            modifier: 'add_damage',
            chance: 50,
            turns: 3,
          }),
        ],
      }),
    ],
  }),
  flying_soul: Spell({
    name: 'Flying Soul',
    icon: 'sram_flying_soul',
    description:
      'Sends out a soul projectile that deals damage to an enemy, effective at medium to long range.',
    levels: [
      Level({
        cost: 6,
        range: [2, 4],
        area: 2,
        area_type: 'line',
        linear: true,
        base_effects: [
          DamageEffect({ min: 6, max: 11, element: 'air' }),
          StealEffect({
            min: 1,
            max: 4,
            turns: 1,
            statistic: 'agility',
            chance: 50,
          }),
        ],
        critical_effects: [
          DamageEffect({ min: 12, max: 15, element: 'air' }),
          StealEffect({
            min: 5,
            max: 5,
            turns: 1,
            statistic: 'agility',
          }),
        ],
      }),
    ],
  }),
}

// ts lint
CurseEffect()
HealEffect()

await writeFile(
  './src/spells.json',
  JSON.stringify({
    iop,
    sram,
  }),
)
