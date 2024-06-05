import { TransferPolicyTransaction } from '@mysten/kiosk'
import { Transaction } from '@mysten/sui/transactions'

/** @param {import("../../../types.js").Context} context */
export function admin_withdraw_profit({ types, kiosk_client }) {
  return async ({ tx = new Transaction(), address }) => {
    const [character_policy_cap] =
      await kiosk_client.getOwnedTransferPoliciesByType({
        type: `${types.PACKAGE_ID}::character::Character`,
        address,
      })

    const [item_policy_cap] = await kiosk_client.getOwnedTransferPoliciesByType(
      {
        type: `${types.PACKAGE_ID}::item::Item`,
        address,
      },
    )

    console.dir({ character_policy_cap, item_policy_cap }, { depth: Infinity })

    const character_ttx = new TransferPolicyTransaction({
      transaction: tx,
      kioskClient: kiosk_client,
      cap: character_policy_cap,
    })
    const item_ttx = new TransferPolicyTransaction({
      transaction: tx,
      kioskClient: kiosk_client,
      cap: item_policy_cap,
    })

    character_ttx.withdraw(address)
    item_ttx.withdraw(address)

    return tx
  }
}
