import { TransactionBlock } from '@mysten/sui.js/transactions'

import { sanitized } from '../sanitize.js'
/** @param {import("../../../types.js").Context} context */
export function admin_mint_item({ types }) {
  return ({
    tx = new TransactionBlock(),
    recipient_kiosk,
    admin_cap = types.ADMIN_CAP,
    name,
    item_category,
    item_set = 'none',
    item_type,
    level,
    amount = 1,
    stackable = false,

    stats = null,
    damages = [],
  }) => {
    const txb = sanitized(tx)

    if (amount > 1) stackable = true

    const [item, promise] = tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::item_manager::admin_mint`,
      arguments: [
        txb._.object(admin_cap),
        tx.pure.string(name),
        tx.pure.string(item_category),
        tx.pure.string(item_set),
        tx.pure.string(item_type),
        tx.pure.u8(level),
        tx.pure.u32(amount),
        tx.pure.bool(stackable),
      ],
    })

    if (stats) {
      const {
        vitality = 0,
        wisdom = 0,
        strength = 0,
        intelligence = 0,
        chance = 0,
        agility = 0,
        range = 0,
        movement = 0,
        action = 0,
        critical = 0,
        raw_damage = 0,
        critical_chance = 0,
        critical_outcomes = 0,
        earth_resistance = 0,
        fire_resistance = 0,
        water_resistance = 0,
        air_resistance = 0,
      } = stats

      tx.moveCall({
        target: `${types.LATEST_PACKAGE_ID}::item_stats::admin_augment_with_stats`,
        arguments: [
          txb._.object(admin_cap),
          item,
          tx.pure.u16(vitality),
          tx.pure.u16(wisdom),
          tx.pure.u16(strength),
          tx.pure.u16(intelligence),
          tx.pure.u16(chance),
          tx.pure.u16(agility),
          tx.pure.u8(range),
          tx.pure.u8(movement),
          tx.pure.u8(action),
          tx.pure.u8(critical),
          tx.pure.u16(raw_damage),
          tx.pure.u8(critical_chance),
          tx.pure.u8(critical_outcomes),

          tx.pure.u8(earth_resistance),
          tx.pure.u8(fire_resistance),
          tx.pure.u8(water_resistance),
          tx.pure.u8(air_resistance),
        ],
      })
    }

    const damage_inputs = damages.map(({ from, to, damage_type, element }) => {
      const [result] = tx.moveCall({
        target: `${types.LATEST_PACKAGE_ID}::item_damages::admin_new`,
        arguments: [
          txb._.object(admin_cap),
          tx.pure.u16(from),
          tx.pure.u16(to),
          tx.pure.string(damage_type),
          tx.pure.string(element),
        ],
      })

      return result
    })

    if (damage_inputs.length)
      tx.moveCall({
        target: `${types.LATEST_PACKAGE_ID}::item_damages::admin_augment_with_damages`,
        arguments: [
          txb._.object(admin_cap),
          item,
          tx.makeMoveVec({
            objects: damage_inputs,
            type: `${types.PACKAGE_ID}::item_damages::ItemDamages`,
          }),
        ],
      })

    tx.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::item_manager::admin_lock_newly_minted`,
      arguments: [
        txb._.object(admin_cap),
        txb._.object(recipient_kiosk),
        item,
        promise,
      ],
    })

    return tx
  }
}
