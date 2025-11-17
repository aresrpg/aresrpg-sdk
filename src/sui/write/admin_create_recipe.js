import { Transaction } from '@mysten/sui/transactions'

/** @param {import("../../../types.js").Context} context */
export function admin_create_recipe({ types }) {
  const SHIFT_U16 = 32768

  return ({
    tx = new Transaction(),
    admin_cap,
    level,
    ingredients,
    template,
  }) => {
    const admin = tx.object(admin_cap)

    const ingredients_refs = ingredients.map((ingredient) => {
      const [ingredient_ref] = tx.moveCall({
        target: `${types.LATEST_PACKAGE_ID}::item_recipe::admin_create_ingredient`,
        arguments: [
          admin,
          tx.pure.string(ingredient.item_type),
          tx.pure.u64(ingredient.amount),
          tx.pure.string(ingredient.name),
        ],
      })
      return ingredient_ref
    })

    const [ingredients_vec] = tx.makeMoveVec({
      type: `${types.PACKAGE_ID}::item_recipe::Ingredient`,
      elements: ingredients_refs,
    })

    // Convert signed values to unsigned by adding SHIFT_U16
    const [stats_min] = tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::item_stats::admin_new`,
      arguments: [
        admin,
        tx.pure.u16((template.stats_min.vitality ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_min.wisdom ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_min.strength ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_min.intelligence ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_min.chance ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_min.agility ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_min.range ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_min.movement ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_min.action ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_min.critical ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_min.raw_damage ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_min.critical_chance ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_min.critical_outcomes ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_min.earth_resistance ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_min.fire_resistance ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_min.water_resistance ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_min.air_resistance ?? 0) + SHIFT_U16),
      ],
    })

    const [stats_max] = tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::item_stats::admin_new`,
      arguments: [
        admin,
        tx.pure.u16((template.stats_max.vitality ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_max.wisdom ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_max.strength ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_max.intelligence ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_max.chance ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_max.agility ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_max.range ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_max.movement ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_max.action ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_max.critical ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_max.raw_damage ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_max.critical_chance ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_max.critical_outcomes ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_max.earth_resistance ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_max.fire_resistance ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_max.water_resistance ?? 0) + SHIFT_U16),
        tx.pure.u16((template.stats_max.air_resistance ?? 0) + SHIFT_U16),
      ],
    })

    const damage_inputs = template.damages.map(
      ({ from, to, damage_type, element }) => {
        const [result] = tx.moveCall({
          target: `${types.LATEST_PACKAGE_ID}::item_damages::admin_new`,
          arguments: [
            admin,
            tx.pure.u16(from),
            tx.pure.u16(to),
            tx.pure.string(damage_type),
            tx.pure.string(element),
          ],
        })
        return result
      }
    )

    const [template_ref] = tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::item_recipe::admin_create_template`,
      arguments: [
        admin,
        tx.pure.string(template.name),
        tx.pure.string(template.item_category),
        tx.pure.string(template.item_set),
        tx.pure.string(template.item_type),
        tx.pure.u8(template.level),
        stats_min,
        stats_max,
        tx.makeMoveVec({
          elements: damage_inputs,
          type: `${types.PACKAGE_ID}::item_damages::ItemDamages`,
        }),
      ],
    })

    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::item_recipe::admin_create_recipe`,
      arguments: [admin, tx.pure.u8(level), ingredients_vec, template_ref],
    })

    return tx
  }
}
