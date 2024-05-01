async function parse_created_objects(transaction, client) {
  try {
    const {
      digest,
      effects: { created },
    } = await client.getTransactionBlock({
      digest: transaction,
      options: {
        showEffects: true,
      },
    })

    const objects = await client.multiGetObjects({
      ids: created.map(({ reference: { objectId } }) => objectId),
      options: {
        showType: true,
        showContent: true,
      },
    })

    return {
      digest,
      ...Object.fromEntries(
        objects
          .map(({ data }) => {
            // @ts-ignore
            const { type, objectId, content } = data

            if (type.includes('dynamic_field')) return [null, null]

            if (type.startsWith('0x2::transfer_policy::TransferPolicy<')) {
              const [, , , submodule, subtype] = type.split('::')
              const extracted_type = `${submodule}::${subtype}`.slice(0, -1)
              return [`TransferPolicy<${extracted_type}>`, objectId]
            }

            if (type.includes('AresRPG_TransferPolicy')) {
              const [, , , submodule, subtype] = type.split('::')
              const extracted_type = `${submodule}::${subtype}`.slice(0, -1)
              return [`AresRPG TransferPolicy<${extracted_type}>`, objectId]
            }

            if (type === '0x2::package::Publisher') {
              const subtype = content.fields.module_name
              return [`publisher (${subtype})`, objectId]
            }

            if (type.startsWith('0x2::display::Display<')) {
              const [, , , submodule, subtype] = type.split('::')
              const extracted_type = `${submodule}::${subtype}`.slice(0, -1)
              return [`Display<${extracted_type}>`, objectId]
            }

            if (type === 'package') return ['package', objectId]

            const [, module_name, raw_type] = type.split('::')

            return [`${module_name}::${raw_type}`, objectId]
          })
          .filter(([key]) => key !== null),
      ),
    }
  } catch (error) {
    return {}
  }
}

/** @typedef {ReturnType<typeof parse_result>} SuiIds */

const parse_result = parsed => {
  const result = {
    DISPLAY_CHARACTER: parsed['Display<character::Character>'],
    NAME_REGISTRY: parsed['registry::NameRegistry'],
    ADMIN_CAP: parsed['admin::AdminCap'],
    VERSION: parsed['version::Version'],
    PUBLISHER_CHARACTER: parsed['publisher (character)'],
    PUBLISHER_ITEM: parsed['publisher (item)'],
    PACKAGE_ID: parsed.package,
    UPGRADE_CAP: parsed['package::UpgradeCap'],
    DISPLAY_ITEM: parsed['Display<item::Item>'],
    CHARACTER_PROTECTED_POLICY:
      parsed['AresRPG TransferPolicy<character::Character>'],
    ITEM_PROTECTED_POLICY: parsed['AresRPG TransferPolicy<item::Item>'],
    CHARACTER_POLICY: parsed['TransferPolicy<character::Character>'],
    ITEM_POLICY: parsed['TransferPolicy<item::Item>'],
  }

  Object.entries(result).forEach(([key, value]) => {
    if (!value) delete result[key]
  })

  return result
}

/** @return {Promise<SuiIds & { LATEST_PACKAGE_ID: string }>} */
export async function find_types(
  { publish_digest, policies_digest, upgrade_digest },
  client,
) {
  const published_objects = await parse_created_objects(publish_digest, client)
  const policies_objects = await parse_created_objects(policies_digest, client)
  const upgrade_objects = await parse_created_objects(
    upgrade_digest || publish_digest,
    client,
  )

  const published_result = parse_result(published_objects)
  const policies_result = parse_result(policies_objects)
  const { PACKAGE_ID } = parse_result(upgrade_objects)

  return {
    ...published_result,
    ...policies_result,
    LATEST_PACKAGE_ID: PACKAGE_ID,
  }
}
