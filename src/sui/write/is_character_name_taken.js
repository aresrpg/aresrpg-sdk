import { Transaction } from '@mysten/sui/transactions'

/** @param {import("../../../types.js").Context} context */
export function is_character_name_taken({ types, sui_client }) {
  return async ({ address, name }) => {
    const txb = new Transaction()
    txb.setSender(address)
    txb.moveCall({
      target: `${types.LATEST_PACKAGE_ID}::character_registry::assert_name_available`,
      arguments: [
        txb.object(types.NAME_REGISTRY),
        txb.pure.string(name.toLowerCase()),
      ],
    })

    txb.setGasBudget(100000000)

    try {
      const { error } = await sui_client.devInspectTransactionBlock({
        transactionBlock: txb,
        sender: address,
      })

      return !!error
    } catch (error) {
      if (
        error.message.includes('rejection') ||
        error.message.includes('Rejected')
      )
        return

      if (error.message.includes('No valid gas coins'))
        throw new Error('NO_GAS')

      throw error
    }
  }
}
