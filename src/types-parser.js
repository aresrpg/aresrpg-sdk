/**
 * @param {string} transaction_digest
 * @param {import("@mysten/sui/client").SuiClient} client
 * */
async function parse_created_objects(transaction_digest, client) {
  const {
    digest,
    effects: { created },
  } = await client.getTransactionBlock({
    digest: transaction_digest,
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
            // @ts-ignore
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
        .filter(([key]) => key !== null)
    ),
  }
}

/** @typedef {ReturnType<typeof parse_result>} SuiIds */

const parse_result = (parsed) => {
  const result = {
    DISPLAY_CHARACTER: parsed['Display<character::Character>'],
    NAME_REGISTRY: parsed['character_registry::NameRegistry'],
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
    LATEST_PACKAGE_ID: '',
  }

  Object.entries(result).forEach(([key, value]) => {
    if (!value) delete result[key]
  })

  return result
}

/** @return {Promise<SuiIds>} */
export async function find_types({ digest, package_id = null }, client) {
  const objects = parse_result(await parse_created_objects(digest, client))

  return {
    ...objects,
    PACKAGE_ID: package_id || objects.PACKAGE_ID,
    LATEST_PACKAGE_ID: objects.PACKAGE_ID,
  }
}
