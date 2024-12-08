<p align=center>
  <img src="https://user-images.githubusercontent.com/11330271/208825167-77d7bc78-17d0-4f33-ad35-d108b6fac730.gif" height="237px" width="344"/>
</p>
<h1 align=center>@aresrpg/aresrpg-sdk</h1>
<p align=center>
  <img src="https://img.shields.io/badge/Made%20with-Javascript-%23f7df1e?style=for-the-badge" alt="fully in javascript"/>
  <img src="https://img.shields.io/badge/Powered%20By-Dark%20Magic-blueviolet?style=for-the-badge" alt="powered by lsd"/>
  <a href="https://discord.gg/aresrpg">
    <img src="https://img.shields.io/discord/265104803531587584.svg?logo=discord&style=for-the-badge" alt="Chat"/>
  </a>
</p>
<h3 align=center>A collection of queries to read AresRPG on chain</h3>

## Installation

This README is uncomplete!
It is recommended to use `moduleResolution: "nodenext"` in your tsconfig

```bash
npm install @aresrpg/aresrpg-sdk
```

## Exports

You have access to a few packages

```js
import * from '@aresrpg/aresrpg-sdk/sui'
import * from '@aresrpg/aresrpg-sdk/chunk'
import * from '@aresrpg/aresrpg-sdk/experience'
import * from '@aresrpg/aresrpg-sdk/stats'
import * from '@aresrpg/aresrpg-sdk/spells' // json file
import * from '@aresrpg/aresrpg-sdk/types' // some additonnal types
```

## Usage (WIP)

To start using the SDK, you need to configure it with the appropriate network details:

```javascript
import { SDK } from '@aresrpg/aresrpg-sdk/sui'

const sdk = await SDK({
  rpc_url: 'https://fullnode.testnet.sui.io/',
  network: 'testnet', // required for modules addresses
})
```
