import test from 'node:test'
import assert from 'node:assert'

import { TransactionBlock } from '@mysten/sui.js/transactions'
import { decodeSuiPrivateKey } from '@mysten/sui.js/cryptography'
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519'
import { BigNumber as BN } from 'bignumber.js'
import { MIST_PER_SUI } from '@mysten/sui.js/utils'

import { SDK } from '../src/sui.js'

const { PRIVATE_KEY } = process.env

const keypair = Ed25519Keypair.fromSecretKey(
  decodeSuiPrivateKey(PRIVATE_KEY).secretKey,
)
const sdk = await SDK({})
const address = keypair.getPublicKey().toSuiAddress()

const balance_before = await sdk.get_sui_balance(address).then(balance => {
  return new BN(balance.toString()).div(MIST_PER_SUI.toString())
})

await test('create character', async t => {
  const tx = new TransactionBlock()

  const name = `test${Math.round(Math.random() * 10000000)}`

  const { kiosk_cap, kiosk_id, kiosk_tx } = await sdk.enforce_personal_kiosk({
    tx,
    recipient: address,
  })

  sdk.create_character({
    tx,
    name,
    sex: 'male',
    classe: 'iop',
    kiosk_cap,
    kiosk_id,
  })

  kiosk_tx.finalize()

  const { digest } = await sdk.sui_client.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    signer: keypair,
  })

  console.log('executed:', digest)

  const characters = await sdk.get_unlocked_characters(address)

  const character = characters.find(c => c.name === name)

  assert.strictEqual(character.available_points, 0)
  assert.strictEqual(character.agility, 0)
  assert.strictEqual(character.chance, 0)
  assert.strictEqual(character.intelligence, 0)
  assert.strictEqual(character.wisdom, 0)
  assert.strictEqual(character.health, 30)
  assert.strictEqual(character.selected, false)
  assert.strictEqual(character.classe, 'iop')
})

test('delete characters', async () => {
  const characters = await sdk.get_unlocked_characters(address)

  const tx = new TransactionBlock()

  for (const character of characters) {
    sdk.borrow_kiosk_owner_cap({
      tx,
      personal_kiosk_cap_id: character.personal_kiosk_cap_id,
      handler: kiosk_cap => {
        sdk.delete_character({
          tx,
          kiosk_cap,
          kiosk_id: character.kiosk_id,
          character_id: tx.pure.id(character.id),
        })
      },
    })
  }

  const { digest } = await sdk.sui_client.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    signer: keypair,
  })

  console.log('executed:', digest)

  const characters_after = await sdk.get_unlocked_characters(address)

  assert.strictEqual(characters_after.length, 0)
})

const balance_after = await sdk.get_sui_balance(address).then(balance => {
  return new BN(balance.toString()).div(MIST_PER_SUI.toString())
})

console.log('balance:', balance_after.toFixed(5))
console.log('used:', balance_before.minus(balance_after).toFixed(5))
