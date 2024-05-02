import { iter } from 'iterator-helper'
import { KioskClient, Network } from '@mysten/kiosk'
import { SuiClient, SuiHTTPTransport } from '@mysten/sui.js/client'

import { find_types } from './types-parser.js'

const {
  TESTNET_PUBLISH_DIGEST = 'JB7tmyWLkPG4dzfuZfvHNTwbUwpc8nvVCfQecK5gxRmW',
  TESTNET_POLICIES_DIGEST = 'Eemb1oxDqutoHnhvmcdWzTDZJn2TNnSrsGNuu7MwB3Qx',
  TESTNET_UPGRADE_DIGEST = '',
  MAINNET_PUBLISH_DIGEST = '',
  MAINNET_POLICIES_DIGEST = '',
  MAINNET_UPGRADE_DIGEST = '',
} = process.env

function parse_sui_object(object) {
  const { fields } = object.data.content
  return {
    _type: object.data.type,
    ...fields,
    id: fields.id.id,
  }
}

function parse_character_fields(character) {
  return {
    ...character,
    position: JSON.parse(character.position),
  }
}

export async function SDK({ rpc_url, wss_url, network = Network.TESTNET }) {
  const sui_client = new SuiClient({
    transport: new SuiHTTPTransport({
      url: rpc_url,
      websocket: {
        reconnectTimeout: 1000,
        url: wss_url,
      },
    }),
  })
  const kiosk_client = new KioskClient({
    client: sui_client,
    network,
  })

  async function read_object_bag({ bag_id, content = [], cursor = undefined }) {
    const { data, hasNextPage, nextCursor } = await sui_client.getDynamicFields(
      {
        parentId: bag_id,
        ...(cursor && { cursor }),
      },
    )

    const objects = await Promise.all(
      data.map(({ name }) =>
        sui_client.getDynamicFieldObject({
          parentId: bag_id,
          name,
        }),
      ),
    )

    const result = [...content, ...objects]

    if (hasNextPage)
      return read_object_bag({ bag_id, content: result, cursor: nextCursor })

    return result
  }

  const types = await find_types(
    {
      publish_digest:
        network === Network.TESTNET
          ? TESTNET_PUBLISH_DIGEST
          : MAINNET_PUBLISH_DIGEST,
      policies_digest:
        network === Network.TESTNET
          ? TESTNET_POLICIES_DIGEST
          : MAINNET_POLICIES_DIGEST,
      upgrade_digest:
        network === Network.TESTNET
          ? TESTNET_UPGRADE_DIGEST
          : MAINNET_UPGRADE_DIGEST,
    },
    sui_client,
  )

  return {
    sui_client,
    kiosk_client,
    ...types,
    async get_sui_balance(owner) {
      const { totalBalance } = await sui_client.getBalance({
        owner,
      })

      return BigInt(totalBalance)
    },
    /** @type {(address: string) => Promise<import("./types.js").SuiCharacter[]>} */
    async get_locked_characters(address) {
      const { kioskOwnerCaps } = await kiosk_client.getOwnedKiosks({
        address,
      })

      const personal_kiosks = kioskOwnerCaps.filter(
        ({ isPersonal }) => !!isPersonal,
      )

      const characters = await iter(personal_kiosks)
        .toAsyncIterator()
        .map(async ({ kioskId, objectId }) => {
          // find the AresRPG extension for the kiosk
          try {
            const { storageId } = await kiosk_client.getKioskExtension({
              kioskId,
              type: `${types.PACKAGE_ID}::extension::AresRPG`,
            })

            return {
              storage_id: storageId,
              kiosk_id: kioskId,
              personal_kiosk_cap_id: objectId,
            }
          } catch (error) {
            console.error('getKioskExtension error', error.message)
            return null
          }
        })
        // in case extension is not found, filter out
        .filter(Boolean)
        // retrieve the ObjectBag<String, Character>
        .map(async ({ storage_id, kiosk_id, personal_kiosk_cap_id }) => {
          try {
            // retrieve the ObjectBag<String, Character>
            const { data } = await sui_client.getDynamicFieldObject({
              parentId: storage_id,
              name: {
                type: 'vector<u8>',
                value: [...new TextEncoder().encode('characters')],
              },
            })

            return {
              storage_id,
              kiosk_id,
              personal_kiosk_cap_id,
              // @ts-ignore
              object_bag_id: data.content.fields.value.fields.id.id,
            }
          } catch (error) {
            console.error('getDynamicFieldObject error', error)
            return null
          }
        })
        .filter(Boolean)
        .flatMap(
          async ({
            storage_id,
            kiosk_id,
            object_bag_id,
            personal_kiosk_cap_id,
          }) => {
            const characters = await read_object_bag({
              bag_id: object_bag_id,
            })

            return characters
              .flat()
              .map(parse_sui_object)
              .map(character => ({
                ...parse_character_fields(character),
                storage_id,
                kiosk_id,
                personal_kiosk_cap_id,
              }))
          },
        )
        .toArray()

      return characters.flat()
    },
    /** @type {(address: string) => Promise<import("./types.js").SuiCharacter[]>} */
    async get_unlocked_characters(address) {
      const { kioskOwnerCaps } = await kiosk_client.getOwnedKiosks({
        address,
      })

      const personal_kiosks = kioskOwnerCaps.filter(
        ({ isPersonal }) => !!isPersonal,
      )

      const result = await iter(personal_kiosks)
        .toAsyncIterator()
        .map(async ({ kioskId, objectId }) => {
          return {
            kiosk_id: kioskId,
            personal_kiosk_cap_id: objectId,
            kiosk: await kiosk_client.getKiosk({
              id: kioskId,
              options: {
                withObjects: true,
                objectOptions: { showContent: true },
              },
            }),
          }
        })
        // in the mean time, we fetch the objects separately
        .map(({ kiosk_id, personal_kiosk_cap_id, kiosk: { items } }) => ({
          kiosk_id,
          personal_kiosk_cap_id,
          characters: items,
        }))
        .flatMap(({ kiosk_id, personal_kiosk_cap_id, characters }) => {
          return characters
            .map(parse_sui_object)
            .filter(
              // @ts-ignore
              ({ _type }) =>
                _type === `${types.PACKAGE_ID}::character::Character`,
            )
            .map(character => ({
              ...parse_character_fields(character),
              kiosk_id,
              personal_kiosk_cap_id,
            }))
        })
        .toArray()

      return result.flat()
    },
    /** @type {(id: string) => Promise<import("./types.js").SuiCharacter>} */
    async get_character(id) {
      const character = parse_sui_object(
        await sui_client.getObject({
          id,
          options: { showContent: true, showType: true },
        }),
      )
      if (character._type !== `${types.PACKAGE_ID}::character::Character`)
        throw new Error(`INVALID_CONTRACT`)
      return parse_character_fields(character)
    },
    async get_kiosk_id(character_id) {
      const { data } = await sui_client.getDynamicFieldObject({
        parentId: character_id,
        name: {
          type: 'vector<u8>',
          value: [...new TextEncoder().encode('kiosk_id')],
        },
      })

      // @ts-ignore
      return data.content.fields.value
    },
    async subscribe(on_message) {
      return sui_client.subscribeEvent({
        onMessage: on_message,
        filter: { Package: types.PACKAGE_ID },
      })
    },
  }
}
