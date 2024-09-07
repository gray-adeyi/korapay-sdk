# @gray-adeyi/korapay-sdk

A korapay client SDK for the javascript runtime.

## Features

- Built in typescript
- Implements methods matching all of korapay's public API.
- Automatic case transformation of payload and response data keys for a more optimal JS/TS experience

## Installation
#### **Npm**

```bash

npm i @gray-adeyi/korapay-sdk
```

#### **Yarn**

```bash

yarn add @gray-adeyi/korapay-sdk
```

#### **Pnpm**

```bash

pnpm i @gray-adeyi/korapay-sdk
```

#### **Bun**

```bash

bun add @gray-adeyi/korapay-sdk
```

#### **Deno**

```bash

deno add @gray-adeyi/korapay-sdk
```

## Usage
```ts
import {
    KorapayClient,
    Currency,
    type ChargeViaBankTransferPayload, 
    type KorapayResponse} from '@gray-adeyi/korapay-sdk'


// Assumes your KORAPAY_PUBLIC_KEY, KORAPAY_SECRET_KEY 
// & KORAPAY_ENCRYPTION_KEY is set in your environmental
// variables. They can be passed in explicitly on the
// instantiation which overrides the values set in the environmental
// variables.
const client = new KorapayClient()

client.getBalances().then((response: KorapayResponse) => {
    console.log(response)
})

const payload: ChargeViaBankTransferPayload = {
    reference: 'qwerty',
    customer: {email: 'johndoe@example.com'},
    amount: 1_000_000,
    currency: Currency.NGN,
    narration: 'test charge'
}
client.chargeViaBankTransfer(payload).then(console.log)
```

See the Project's [Documentation](https://gray-adeyi.github.io/korapay-sdk) for more

## Limitations

- Currently, @gray-adeyi/korapay-sdk does not perform any form of validation on the data passed in as method parameters but sends them as is to paystack servers.
- Limited documentation 

## Sponsorship
Every little donation goes a long way. You can also give this project a star in its Github repository it helps ♥️
- [Star on Github](https://www.github.com/gray-adeyi/korapay-sdk)
- [Buy me a coffee](https://www.buymeacoffee.com/jigani)

## Contributing
You might encounter bugs while using this project or have feature enhancements you'd like to share with the project. Create an issue on the project's [github](https://www.github.com/gray-adeyi/korapay-sdk)
 page. 