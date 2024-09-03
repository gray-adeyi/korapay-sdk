# Getting started



<!-- tabs:start -->

#### **Npm**

```bash

npm i @gray-adeyi/korapay-sdk
```

#### **Bun**

```bash

bun add @gray-adeyi/korapay-sdk
```

#### **Deno**

```bash

deno add @gray-adeyi/korapay-sdk
```

<!-- tabs:end -->

```js
import {KorapayClient} from '@gray-adeyi/korapay-sdk'

const client = KorapayClient()
client.getBalances().then((response) => {
    console.log(response.data)
})
```