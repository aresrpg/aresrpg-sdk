import { TransferPolicyTransaction } from '@mysten/kiosk'
import { Transaction } from '@mysten/sui/transactions'

/** @param {import("../../../types.js").Context} context */
export function admin_withdraw_profit(context) {
  const { types, kiosk_client } = context
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
      }
    )

    const [vaporeon_policy_cap] =
      await kiosk_client.getOwnedTransferPoliciesByType({
        // @ts-ignore
        type: `${context.VAPOREON.split('::')[0]}::vaporeon::Vaporeon`,
        address,
      })

    console.dir(
      { character_policy_cap, item_policy_cap, vaporeon_policy_cap },
      { depth: Infinity }
    )

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
    const vaporeon_ttx = new TransferPolicyTransaction({
      transaction: tx,
      kioskClient: kiosk_client,
      cap: vaporeon_policy_cap,
    })

    character_ttx.withdraw(address)
    item_ttx.withdraw(address)
    vaporeon_ttx.withdraw(address)

    return tx
  }
}
