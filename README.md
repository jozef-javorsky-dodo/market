> 🚨 **Announcement**  
> **Ocean Market** is part of the old version of the Ocean stack and is not actively maintained.  
> [See the docs](https://docs.oceanprotocol.com/developers/ocean-node) to learn about Ocean Node and the new stack.

[![banner](https://raw.githubusercontent.com/oceanprotocol/art/master/github/repo-banner%402x.png)](https://oceanprotocol.com)

<h1 align="center">Ocean Marketplace</h1>

[![Build Status](https://github.com/oceanprotocol/market/workflows/CI/badge.svg)](https://github.com/oceanprotocol/market/actions)
[![Netlify Status](https://api.netlify.com/api/v1/badges/c85f4d8b-95e1-4010-95a4-2bacd8b90981/deploy-status)](https://app.netlify.com/sites/market-oceanprotocol/deploys)
[![Maintainability](https://api.codeclimate.com/v1/badges/d114f94f75e6efd2ee71/maintainability)](https://codeclimate.com/repos/5e3933869a31771fd800011c/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/da71759866eb8313d7c2/test_coverage)](https://codeclimate.com/github/oceanprotocol/market/test_coverage)
[![js oceanprotocol](https://img.shields.io/badge/js-oceanprotocol-7b1173.svg)](https://github.com/oceanprotocol/eslint-config-oceanprotocol)

**Table of Contents**

- [🏄 Get Started](#-get-started)
  - [Local components with Barge](#local-components-with-barge)
- [🦑 Environment variables](#-environment-variables)
- [🦀 Data Sources](#-data-sources)
  - [Aquarius](#aquarius)
  - [Ocean Protocol Subgraph](#ocean-protocol-subgraph)
  - [ENS](#ens)
  - [Purgatory](#purgatory)
  - [Network Metadata](#network-metadata)
- [👩‍🎤 Storybook](#-storybook)
- [🤖 Testing](#-testing)
- [✨ Code Style](#-code-style)
- [🛳 Production](#-production)
- [⬆️ Deployment](#️-deployment)
- [💖 Contributing](#-contributing)
- [🍴 Forking](#-forking)
- [💰 Pricing Options](#-pricing-options)
  - [Fixed Pricing](#fixed-pricing)
  - [Free Pricing](#free-pricing)
- [✅ GDPR Compliance](#-gdpr-compliance)
  - [Multi-Language Privacy Policies](#multi-language-privacy-policies)
  - [Privacy Preference Center](#privacy-preference-center)
    - [Privacy Preference Center Styling](#privacy-preference-center-styling)
- [🏛 License](#-license)

## 🏄 Get Started

The app is a React app built with [Next.js](https://nextjs.org) + TypeScript + CSS modules and will connect to Ocean remote components by default.

Prerequisites:

- [Node.js](https://nodejs.org/en/) (required). Check the [.nvmrc](.nvmrc) file to make sure you are using the correct version of Node.js.
- [nvm](https://github.com/nvm-sh/nvm) (recommended). This is the recommended way to manage Node.js versions.
- [Git](https://git-scm.com/) is required to follow the instructions below.

To start local development:

```bash
git clone git@github.com:oceanprotocol/market.git
cd market

# when using nvm to manage Node.js versions
nvm use

npm install
# in case of dependency errors, rather use:
# npm install --legacy-peer-deps
npm start
```

This will start the development server under
`http://localhost:8000`.

### Local components with Barge

Using the `ocean-market` with `barge` components is recommended for advanced users, if you are new we advice you to use the `ocean-market` first with remote networks. If you prefer to connect to locally running components instead of remote connections, you can spin up [`barge`](https://github.com/oceanprotocol/barge) and use a local Ganache network in another terminal before running `npm start`. To fully test all [The Graph](https://thegraph.com) integrations, you have to start barge with the local Graph node:

```bash
git clone git@github.com:oceanprotocol/barge.git
cd barge

# startup with local Ganache and Graph nodes
./start_ocean.sh --with-thegraph
```

Barge will deploy contracts to the local Ganache node which will take some time. At the end the compiled artifacts need to imported over to this project as environment variables. The `set-barge-env` script will do that for you and set the env variables to use this local connection in `.env` in the app. You also need to append the `chainIdsSupported` array with the barge's ganache chainId (`8996`) in the `app.config.js` file.

If you are using `macOS` operating system you should also make same changes to the provider url since the default barge ip can not be accessed due to some network constraints on `macOs`. So we should be using the `127.0.0.1:8030` (if you have changed the provider port please use that here as well) for each direct call from the market to provider, but we should keep the internal barge url `http://172.15.0.4:8030/` (this is the default ip:port for provider in barge, if changed please use the according url). So on inside `src/@utils/provider.ts` if on `macOS` you can hardcode this env variable `NEXT_PUBLIC_PROVIDER_URL` or set
`127.0.0.1:8030` as `providerUrl` on all the methods that call `ProviderInstance` methods. (eg: `getEncryptedFiles`, `getFileDidInfo`, `downloadFile` etc). You should use the same provider url for `src/@utils/nft.ts` inside `setNFTMetadataAndTokenURI` and `setNftMetadata` and `src/components/Publish/index.tsx` inisde `encrypt` method (if you set the env variable there's no need to do this). You also need to use local ip's for the subgraph (`127.0.0.1` instead of `172.15.0.15`) and the metadatacache (`127.0.0.1` instead of `172.15.0.5`).

Once you want to switch back to using the market against remote networks you need to comment or remove the env vars that are set by `set-barge-env` script.

```bash
cd market
npm run set-barge-env
npm start
```

To use the app together with MetaMask, importing one of the accounts auto-generated by the Ganache container is the easiest way to have test ETH available. All of them have 100 ETH by default. Upon start, the `ocean_ganache_1` container will print out the private keys of multiple accounts in its logs. Pick one of them and import into MetaMask. Barge private key example : `0xc594c6e5def4bab63ac29eed19a134c130388f74f019bc74b8f4389df2837a58`

> Cleaning all Docker images so they are fetched freshly is often a good idea to make sure no issues are caused by old or stale images: `docker system prune --all --volumes`

## 🦑 Environment variables

The `app.config.js` file is setup to prioritize environment variables for setting each Ocean component endpoint. By setting environment variables, you can easily switch between Ocean networks the app connects to, without directly modifying `app.config.js`.

For local development, you can use a `.env` file:

```bash
# modify env variables, Goerli is enabled by default when using those files
cp .env.example .env
```

## 🦀 Data Sources

All displayed data in the app is presented around the concept of one asset, which is a combination of:

- metadata about an asset
- the actual asset file
- the NFT which represents the asset
- the datatokens representing access rights to the asset file
- financial data connected to these datatokens, either a fixed rate exchange contract or a dispenser for free assets
- calculations and conversions based on financial data
- metadata about publisher accounts

All this data then comes from multiple sources:

### Aquarius

All initial assets and their metadata (DDO) is retrieved client-side on run-time from the [Aquarius](https://github.com/oceanprotocol/aquarius) instance, defined in `app.config.js`. All app calls to Aquarius are done with 2 internal methods which mimic the same methods in ocean.js, but allow us:

- to cancel requests when components get unmounted in combination with [axios](https://github.com/axios/axios)
- hit Aquarius as early as possible without relying on any ocean.js initialization

Aquarius runs Elasticsearch under the hood so its stored metadata can be queried with [Elasticsearch queries](https://www.elastic.co/guide/en/elasticsearch/reference/current/full-text-queries.html) like so:

```tsx
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import { queryMetadata } from '@utils/aquarius'

const queryLatest = {
  query: {
    // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html
    query_string: { query: `-isInPurgatory:true` }
  },
  sort: { created: 'desc' }
}

function Component() {
  const { appConfig } = useMarketMetadata()
  const [result, setResult] = useState<QueryResult>()

  useEffect(() => {
    if (!appConfig.metadataCacheUri) return
    const source = axios.CancelToken.source()

    async function init() {
      const result = await queryMetadata(query, source.token)
      setResult(result)
    }
    init()

    return () => {
      source.cancel()
    }
  }, [appConfig.metadataCacheUri, query])

  return <div>{result}</div>
}
```

For components within a single asset view the `useAsset()` hook can be used, which in the background gets the respective metadata from Aquarius.

```tsx
import { useAsset } from '@context/Asset'

function Component() {
  const { ddo } = useAsset()
  return <div>{ddo}</div>
}
```

### Ocean Protocol Subgraph

Most financial data in the market is retrieved with GraphQL from [our own subgraph](https://github.com/oceanprotocol/ocean-subgraph), rendered on top of the initial data coming from Aquarius.

The app has [Urql Client](https://formidable.com/open-source/urql/docs/basics/react-preact/) setup to query the respective subgraph based on network. In any component this client can be used like so:

```tsx
import { gql, useQuery } from 'urql'

const query = gql`
  query TopSalesQuery {
    users(first: 20, orderBy: totalSales, orderDirection: desc) {
      id
      totalSales
    }
  }
`

function Component() {
  const { data } = useQuery(query, {}, pollInterval: 5000 })
  return <div>{data}</div>
}
```

### ENS

Publishers can fill their account's [ENS domain](https://ens.domains) profile and when found, it will be displayed in the app.

For this our own [ens-proxy](https://github.com/oceanprotocol/ens-proxy) is used, within the app the utility method `getEnsProfile()` is called as part of the `useProfile()` hook:

```tsx
import { useProfile } from '@context/Profile'

function Component() {
  const { profile } = useProfile()

  return (
    <div>
      {profile.avatar} {profile.name}
    </div>
  )
}
```

### Purgatory

Based on [list-purgatory](https://github.com/oceanprotocol/list-purgatory) some assets get additional data. Within most components this can be done with the internal `useAsset()` hook which fetches data from the [market-purgatory](https://github.com/oceanprotocol/market-purgatory) endpoint in the background.

For asset purgatory:

```tsx
import { useAsset } from '@context/Asset'

function Component() {
  const { isInPurgatory, purgatoryData } = useAsset()
  return isInPurgatory ? <div>{purgatoryData.reason}</div> : null
}
```

For account purgatory:

```tsx
import { useAccount } from 'wagmi'
import { useAccountPurgatory } from '@hooks/useAccountPurgatory'

function Component() {
  const { address } = useAccount()
  const { isInPurgatory, purgatoryData } = useAccountPurgatory(address)
  return isInPurgatory ? <div>{purgatoryData.reason}</div> : null
}
```

### Network Metadata

All displayed chain & network metadata is retrieved from `https://chainid.network` on build time and integrated into NEXT's GraphQL layer. This data source is a community-maintained GitHub repository under [ethereum-lists/chains](https://github.com/ethereum-lists/chains).

Within components this metadata can be queried for under `allNetworksMetadataJson`. The `useNetworkMetadata()` hook does this in the background to expose the final `networkDisplayName` for use in components:

```tsx
export default function NetworkName(): ReactElement {
  const { isTestnet } = useNetworkMetadata()
  const { networkData, networkName } = useNetworkMetadata()

  return (
    <>
      {networkName} {isTestnet && `(Test)`}
    </>
  )
}
```

## 👩‍🎤 Storybook

Storybook helps us build UI components in isolation from our app's business logic, data, and context. That makes it easy to develop hard-to-reach states and save these UI states as stories to revisit during development, testing, or QA.

To start adding stories, create a `index.stories.tsx` inside the component's folder:

<pre>
src
└─── components
│   └─── @shared
│       └─── <your component>
│            │   index.tsx
│            │   index.module.css
│            │   <b>index.stories.tsx</b>
│            │   index.test.tsx
</pre>

Starting up the Storybook server with this command will make it accessible under `http://localhost:6006`:

```bash
npm run storybook
```

If you want to build a portable static version under `storybook-static/`:

```bash
npm run storybook:build
```

## 🤖 Testing

Test runs utilize [Jest](https://jestjs.io/) as test runner and [Testing Library](https://testing-library.com/docs/react-testing-library/intro) for writing tests.

All created Storybook stories will automatically run as individual tests by using the [StoryShots Addon](https://storybook.js.org/addons/@storybook/addon-storyshots).

Creating Storybook stories for a component will provide good coverage of a component in many cases. Additional tests for dedicated component functionality which can't be done with Storybook are created as usual [Testing Library](https://testing-library.com/docs/react-testing-library/intro) tests, but you can also [import existing Storybook stories](https://storybook.js.org/docs/react/writing-tests/importing-stories-in-tests#example-with-testing-library) into those tests.

Executing linting, type checking, and full test run:

```bash
npm test
```

Which is a combination of multiple scripts which can also be run individually:

```bash
npm run lint
npm run type-check
npm run jest
```

A coverage report is automatically shown in console whenever `npm run jest` is called. Generated reports are sent to CodeClimate during CI runs.

During local development you can continuously get coverage report feedback in your console by running Jest in watch mode:

```bash
npm run jest:watch
```

## ✨ Code Style

Code style is automatically enforced through [ESLint](https://eslint.org) & [Prettier](https://prettier.io) rules:

- Git pre-commit hook runs `prettier` on staged files, setup with [Husky](https://typicode.github.io/husky)
- VS Code suggested extensions and settings for auto-formatting on file save
- CI runs a linting & TypeScript typings check as part of `npm test`, and fails if errors are found

For running linting and auto-formatting manually, you can use from the root of the project:

```bash
# linting check
npm run lint

# auto format all files in the project with prettier, taking all configs into account
npm run format
```

## 🛳 Production

To create a production build, run from the root of the project:

```bash
npm run build

# serve production build
npm run serve
```

## ⬆️ Deployment

Every branch or Pull Request is automatically deployed to multiple hosts for redundancy and emergency reasons:

- [Netlify](https://netlify.com)
- [Vercel](https://vercel.com)
- [S3](https://aws.amazon.com/s3/)

A link to a preview deployment will appear under each Pull Request.

The latest deployment of the `main` branch is automatically aliased to `market.oceanprotocol.com`, where the deployment on Netlify is the current live deployment.

## 💖 Contributing

We welcome contributions in form of bug reports, feature requests, code changes, or documentation improvements. Have a look at our contribution documentation for instructions and workflows:

- [**Ways to Contribute →**](https://docs.oceanprotocol.com/concepts/contributing/)
- [Code of Conduct →](https://docs.oceanprotocol.com/concepts/code-of-conduct/)
- [Reporting Vulnerabilities →](https://docs.oceanprotocol.com/concepts/vulnerabilities/)

## 🍴 Forking

We encourage you to fork this repository and create your own data marketplace. When you publish your forked version of this market there are a few elements that you are required to change for copyright reasons:

- The typeface is copyright protected and needs to be changed unless you purchase a license for it.
- The Ocean Protocol logo is a trademark of the Ocean Protocol Foundation and must be removed from forked versions of the market.
- The name "Ocean Market" is also copyright protected and should be changed to the name of your market.

Additionally, we would also advise that you retain the text saying "Powered by Ocean Protocol" on your forked version of the marketplace in order to give credit for the development work done by the Ocean Protocol team.

Everything else is made open according to the apache2 license. We look forward to seeing your data marketplace!

If you are looking to fork Ocean Market and create your own marketplace, you will find the following guides useful in our docs:

- [Forking Ocean Market](https://docs.oceanprotocol.com/building-with-ocean/build-a-marketplace/forking-ocean-market)
- [Customising your Market](https://docs.oceanprotocol.com/building-with-ocean/build-a-marketplace/customising-your-market)
- [Deploying your Market](https://docs.oceanprotocol.com/building-with-ocean/build-a-marketplace/deploying-market)

## 💰 Pricing Options

### Fixed Pricing

To allow publishers to set pricing as "Fixed" you need to add the following environmental variable to your .env file: `NEXT_PUBLIC_ALLOW_FIXED_PRICING="true"` (default).

### Free Pricing

To allow publishers to set pricing as "Free" you need to add the following environmental variable to your .env file: `NEXT_PUBLIC_ALLOW_FREE_PRICING="true"` (default).

This allocates the datatokens to the [dispenser contract](https://github.com/oceanprotocol/contracts/blob/main/contracts/dispenser/Dispenser.sol) which dispenses data tokens to users for free. Publishers in your market will now be able to offer their assets to users for free (excluding gas costs).

## ✅ GDPR Compliance

Ocean Market comes with prebuilt components for you to customize to cover GDPR requirements. Find additional information on how to use them below.

### Multi-Language Privacy Policies

Feel free to adopt our provided privacy policies to your needs. Per default we cover four different languages: English, German, Spanish and French. Please be advised, that you will need to adjust some paragraphs in the policies depending on your market setup (e.g. the use of cookies). You can easily add or remove policies by providing your own markdown files in the `content/pages/privacy` directory. For guidelines on how to format your markdown files refer to our provided policies. The pre-linked content tables for these files are automatically generated.

### Privacy Preference Center

Additionally, Ocean Market provides a privacy preference center for you to use. This feature is disabled per default since we do not use cookies requiring consent on our deployment of the market. However, if you need to add some functionality depending on cookies, you can simply enable this feature by changing the value of the `NEXT_PUBLIC_PRIVACY_PREFERENCE_CENTER` environmental variable to `"true"` in your `.env` file. This will enable a customizable cookie banner stating the use of your individual cookies. The content of this banner can be adjusted within the `content/gdpr.json` file. If no `optionalCookies` are provided, the privacy preference center will be set to a simpler version displaying only the `title`, `text` and `close`-button. This can be used to inform the user about the use of essential cookies, where no consent is needed. The privacy preference center supports two different styling options: `'small'` and `'default'`. Setting the style property to `'small'` will display a smaller cookie banner to the user at first, only showing the default styled privacy preference center upon the user's customization request.

Now your market users will be provided with additional options to toggle the use of your configured cookie consent categories. You can always retrieve the current consent status per category with the provided `useConsent()` hook. See below, how you can set your own custom cookies depending on the market user's consent. Feel free to adjust the provided utility functions for cookie usage provided in the `src/utils/cookies.ts` file to your needs.

```tsx
import { CookieConsentStatus, useConsent } from '@context/CookieConsent'
import { deleteCookie, setCookie } from '@utils/cookies'

// ...

const { cookies, cookieConsentStatus } = useConsent()

cookies.map((cookie) => {
  const consent = cookieConsentStatus[cookie.cookieName]

  switch (consent) {
    case CookieConsentStatus.APPROVED:
      // example logic
      setCookie(`YOUR_COOKIE_NAME`, 'VALUE')
      break

    case CookieConsentStatus.REJECTED:
    case CookieConsentStatus.NOT_AVAILABLE:
    default:
      // example logic
      deleteCookie(`YOUR_COOKIE_NAME`)
      break
  }
})
```

#### Privacy Preference Center Styling

The privacy preference centre has two styling options `default` and `small`. The default view shows all of the customization options on a full-height side banner. When the `small` setting is used, a much smaller banner is shown which only reveals all of the customization options when the user clicks "Customize".

The style can be changed by altering the `style` prop in the `PrivacyPreferenceCenter` component in `src/components/App.tsx`. For example:

```Typescript
<PrivacyPreferenceCenter style="small" />
```

## 🏛 License

```text
Copyright 2023 Ocean Protocol Foundation Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
