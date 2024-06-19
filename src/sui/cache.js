import { LRUCache } from 'lru-cache'

import { BULLSHARK, CAPY, SUPPORTED_NFTS } from './supported_nfts.js'
import { get_suifren_stats } from './suifrens.js'
import { parse_character } from './parser.js'

const DFIELD_CACHE = new LRUCache({ max: 10000 })
const OBJECT_CACHE = new LRUCache({ max: 10000 })
const RECIPE_CACHE = new LRUCache({ max: 1000 })

function parse_object_fields(object) {
  if (object.error) return null
  const {
    content: { fields },
    display,
  } = object.data
  const type = object.data.type ?? object.data.content.type
  return {
    _type: type,
    ...fields,
    name: display?.data?.name || fields.name,
    id: fields.id.id,
  }
}

export function parse_sui_object({ types }, object) {
  if (object.error) return null
  const type = object.data.type ?? object.data.content.type
  return {
    ...parse_object_fields(object),
    image_url: object.data.display?.data?.image_url,
    is_aresrpg_item: type === `${types.PACKAGE_ID}::item::Item`,
    is_aresrpg_character: type === `${types.PACKAGE_ID}::character::Character`,
    list_price: 0n,
  }
}

/** @return {Promise<import("@mysten/sui/client").SuiObjectResponse>} */
export async function get_dynamic_field_object(sui_client, params) {
  const key = JSON.stringify(params)
  const cached = DFIELD_CACHE.get(key)
  if (cached) return cached

  const result = await sui_client.getDynamicFieldObject(params)
  DFIELD_CACHE.set(key, result)

  return result
}

export async function get_purchase_caps(context, caps) {
  const { sui_client } = context
  const parsed_caps = await sui_client.multiGetObjects({
    ids: caps.map(({ id }) => id),
    options: { showContent: true },
  })

  return parsed_caps
    .map(cap => parse_sui_object(context, cap))
    .map(({ item_id, kiosk_id }, index) => {
      const cap = caps[index]
      return {
        ...cap,
        item_id,
        kiosk_id,
      }
    })
}

/** @type {(context: import("../../types.js").Context, id: string) => Promise<import("../../types.js").Recipe>} */
export async function get_recipe(context, recipe_id) {
  const { sui_client } = context
  const cached = RECIPE_CACHE.get(recipe_id)
  // @ts-ignore
  if (cached) return cached

  const recipe = await sui_client.getObject({
    id: recipe_id,
    options: { showContent: true },
  })

  if (recipe.error) return null

  const parsed_recipe = parse_object_fields(recipe)

  parsed_recipe.ingredients = parsed_recipe.ingredients.map(
    ({ fields }) => fields,
  )
  parsed_recipe.template = parsed_recipe.template.fields
  parsed_recipe.template.stats_min = parsed_recipe.template.stats_min.fields
  parsed_recipe.template.stats_max = parsed_recipe.template.stats_max.fields
  parsed_recipe.template.damages = parsed_recipe.template.damages.map(
    ({ fields }) => fields,
  )

  RECIPE_CACHE.set(parsed_recipe.id, parsed_recipe)

  return parsed_recipe
}

async function tailed_multi_get_objects(sui_client, ids) {
  if (ids.length === 0) return []

  const current_chunk = ids.slice(0, 50)
  const rest = ids.slice(50)

  const [current_result, rest_result] = await Promise.all([
    sui_client.multiGetObjects({
      ids: current_chunk,
      options: { showContent: true, showDisplay: true, showType: true },
    }),
    tailed_multi_get_objects(sui_client, rest),
  ])

  return [...current_result, ...rest_result]
}

// Example usage:
// const result = await tailed_multi_get_objects(sui_client, ids);

/**
 * ORDER IS NOT GUARANTEED
 * @type {(context: import("../../types.js").Context, ids: string[], options?: { allow_characters?: boolean }) => Promise<Map<string, import("../../types.js").SuiItem>>} */
export async function get_items(
  context,
  ids,
  { allow_characters = false } = {},
) {
  const { sui_client, types } = context
  const unknown_ids = ids.filter(id => !OBJECT_CACHE.has(id))

  const unknown_objects = await tailed_multi_get_objects(
    sui_client,
    unknown_ids,
  )

  const parsed_objects = unknown_objects
    .map(object => parse_sui_object({ types }, object))
    .filter(Boolean)

  const { ares: ares_item, others: other_items } = parsed_objects.reduce(
    ({ ares, others }, object) => {
      if (object.is_aresrpg_item) ares.push(object)
      else if (allow_characters && object.is_aresrpg_character)
        ares.push(object)
      else others.push(object)
      return { ares, others }
    },
    { ares: [], others: [] },
  )

  const external_items = await Promise.all(
    other_items.map(async item => {
      const whitelisted_item = SUPPORTED_NFTS(context.network)[item._type]
      if (!whitelisted_item) {
        // those items are not wanted, just put them in the cache as null
        OBJECT_CACHE.set(item.id, null)
        return null
      }

      if (
        item._type === BULLSHARK[context.network] ||
        item._type === CAPY[context.network]
      ) {
        const stats = await get_suifren_stats(context, item)
        return {
          ...item,
          ...whitelisted_item,
          ...stats,
        }
      }

      // if not a bullshark (feedable) item, save in cache ===

      const final_item = {
        ...item,
        ...whitelisted_item,
      }

      OBJECT_CACHE.set(item.id, final_item)

      return final_item
    }),
  ).then(items => items.filter(Boolean))

  const internal_items = await Promise.all(
    ares_item.map(async item => {
      if (item.is_aresrpg_character) return parse_character(context)(item)

      // cached stats
      const stats = await get_dynamic_field_object(sui_client, {
        parentId: item.id,
        name: {
          type: `${types.PACKAGE_ID}::item_stats::StatsKey`,
          value: {
            dummy_field: false,
          },
        },
      })

      // cached damages
      const damages = await get_dynamic_field_object(sui_client, {
        parentId: item.id,
        name: {
          type: `${types.PACKAGE_ID}::item_damages::DamagesKey`,
          value: {
            dummy_field: false,
          },
        },
      })

      // @ts-ignore
      const extracted_damages = damages.data?.content.fields.value.map(
        ({ fields }) => fields,
      )

      return {
        ...item,
        // @ts-ignore
        ...stats.data?.content.fields.value.fields,
        // @ts-ignore
        ...(extracted_damages && { damages: extracted_damages }),
      }
    }),
  )

  internal_items
    // ignore characters
    .filter(item => item.is_aresrpg_item)
    .filter(item => !item.stackable)
    .forEach(item => OBJECT_CACHE.set(item.id, item))

  return new Map(
    [
      ...ids.map(id => OBJECT_CACHE.get(id)),
      ...external_items,
      ...internal_items,
    ]
      .filter(Boolean)
      .map(item => [item.id, item]),
  )
}
