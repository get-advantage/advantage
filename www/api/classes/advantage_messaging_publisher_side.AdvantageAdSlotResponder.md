[@get-advantage/advantage](../index.md) / [advantage/messaging/publisher-side](../modules/advantage_messaging_publisher_side.md) / AdvantageAdSlotResponder

# Class: AdvantageAdSlotResponder

[advantage/messaging/publisher-side](../modules/advantage_messaging_publisher_side.md).AdvantageAdSlotResponder

AdvantageAdSlotResponder can be used by website owners/publishers if they already have their own custom implementations of high impact ad formats
or if they do not want to use the AdvantageWrapper component for some reason. It takes care of listening for messages from Advantage ads and handling them.
It will handle the creation of a new session, format requests, and format confirmations.

**`Remarks`**

This class is internally used by the AdvantageWrapper component to handle messages from Advantage ads. It can also be used by website owners/publishers to handle messages from ads if they have their own custom implementations of high-impact ad formats.

**`Example`**

To handle messages from Advantage ads in a custom implementation, you can create an instance of the AdvantageAdSlotResponder class and pass in the configuration object.
```typescript
new AdvantageAdSlotResponder({
     adSlotElement: document.querySelector("#the-ad-slot-element")!,
     formatRequestHandler: (format, parentElement) => {
          return new Promise((resolve, reject) => {
             // handle the format request here, e.g. by transforming the parent element into the requested format
             // resolve the promise if the format transformation was succesful or reject it if it failed
         });
});
```

## Constructors

### constructor

• **new AdvantageAdSlotResponder**(`config`): [`AdvantageAdSlotResponder`](advantage_messaging_publisher_side.AdvantageAdSlotResponder.md)

Constructs a new instance of the AdvantageAdSlotResponder, initializing it with the provided configuration.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `Object` | The configuration object for the class instance. |
| `config.adSlotElement` | `HTMLElement` | The HTML element that is/contains the ad slot where Advantage ads will loaded/displayed. |
| `config.formatRequestHandler?` | (`format`: `string`, `parentElement`: `HTMLElement`) => `Promise`\<`void`\> | An optional function that handles format requests. It takes a format string and a parent element as arguments. This function can be used to customize the handling of different ad formats. |
| `config.messageValidator?` | (`parentElement`: `HTMLElement` \| [`IAdvantageWrapper`](../interfaces/types.IAdvantageWrapper.md), `message`: `MessageEvent`\<`any`\>) => `boolean` | An optional function that validates incoming messages. It takes a parent element (which can be an `HTMLElement` or an `IAdvantageWrapper`) and the message event as arguments. It should return a boolean indicating whether the message is valid. |

#### Returns

[`AdvantageAdSlotResponder`](advantage_messaging_publisher_side.AdvantageAdSlotResponder.md)

#### Defined in

[src/advantage/messaging/publisher-side.ts:53](https://github.com/get-advantage/advantage/blob/3b64a3c9f09adaef20f44c0e2a8b866e77d18b71/src/advantage/messaging/publisher-side.ts#L53)

## Properties

### #element

• `Private` **#element**: `HTMLElement` \| [`IAdvantageWrapper`](../interfaces/types.IAdvantageWrapper.md)

#### Defined in

[src/advantage/messaging/publisher-side.ts:32](https://github.com/get-advantage/advantage/blob/3b64a3c9f09adaef20f44c0e2a8b866e77d18b71/src/advantage/messaging/publisher-side.ts#L32)

___

### #formatRequestHandler

• `Private` **#formatRequestHandler**: `undefined` \| (`format`: `string`, `parentElement`: `HTMLElement`) => `Promise`\<`void`\> = `undefined`

#### Defined in

[src/advantage/messaging/publisher-side.ts:41](https://github.com/get-advantage/advantage/blob/3b64a3c9f09adaef20f44c0e2a8b866e77d18b71/src/advantage/messaging/publisher-side.ts#L41)

___

### #isWrapper

• `Private` **#isWrapper**: `boolean`

#### Defined in

[src/advantage/messaging/publisher-side.ts:39](https://github.com/get-advantage/advantage/blob/3b64a3c9f09adaef20f44c0e2a8b866e77d18b71/src/advantage/messaging/publisher-side.ts#L39)

___

### #messagePort

• `Private` **#messagePort**: ``null`` \| `MessagePort` = `null`

#### Defined in

[src/advantage/messaging/publisher-side.ts:40](https://github.com/get-advantage/advantage/blob/3b64a3c9f09adaef20f44c0e2a8b866e77d18b71/src/advantage/messaging/publisher-side.ts#L40)

___

### #messageValidator

• `Private` **#messageValidator**: `undefined` \| (`adSlotElement`: `HTMLElement` \| [`IAdvantageWrapper`](../interfaces/types.IAdvantageWrapper.md), `message`: `MessageEvent`\<`any`\>) => `boolean` = `undefined`

#### Defined in

[src/advantage/messaging/publisher-side.ts:33](https://github.com/get-advantage/advantage/blob/3b64a3c9f09adaef20f44c0e2a8b866e77d18b71/src/advantage/messaging/publisher-side.ts#L33)

___

### ad

• **ad**: ``null`` \| [`AdvantageAd`](../interfaces/types.AdvantageAd.md) = `null`

#### Defined in

[src/advantage/messaging/publisher-side.ts:44](https://github.com/get-advantage/advantage/blob/3b64a3c9f09adaef20f44c0e2a8b866e77d18b71/src/advantage/messaging/publisher-side.ts#L44)

## Methods

### #childAdIsAlreadyRegistered

▸ **#childAdIsAlreadyRegistered**(`source`): ``null`` \| `boolean`

Checks if the message is from an ad that is already registered

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | ``null`` \| `MessageEventSource` |

#### Returns

``null`` \| `boolean`

#### Defined in

[src/advantage/messaging/publisher-side.ts:140](https://github.com/get-advantage/advantage/blob/3b64a3c9f09adaef20f44c0e2a8b866e77d18b71/src/advantage/messaging/publisher-side.ts#L140)

___

### #handleMessage

▸ **#handleMessage**(`event`): `Promise`\<`void`\>

This method handles incoming messages from Advantage ads and processes them accordingly.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `MessageEvent`\<[`AdvantageMessage`](../interfaces/types.AdvantageMessage.md)\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/advantage/messaging/publisher-side.ts:85](https://github.com/get-advantage/advantage/blob/3b64a3c9f09adaef20f44c0e2a8b866e77d18b71/src/advantage/messaging/publisher-side.ts#L85)

___

### #isAdvantageWrapper

▸ **#isAdvantageWrapper**(`element`): element is IAdvantageWrapper

Checks if the provided element is an instance of IAdvantageWrapper.

#### Parameters

| Name | Type |
| :------ | :------ |
| `element` | `HTMLElement` \| [`IAdvantageWrapper`](../interfaces/types.IAdvantageWrapper.md) |

#### Returns

element is IAdvantageWrapper

#### Defined in

[src/advantage/messaging/publisher-side.ts:202](https://github.com/get-advantage/advantage/blob/3b64a3c9f09adaef20f44c0e2a8b866e77d18b71/src/advantage/messaging/publisher-side.ts#L202)

___

### #listenForMessages

▸ **#listenForMessages**(`event`): `void`

This method listens for incoming messages from Advantage ads and processes them accordingly.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `MessageEvent`\<`any`\> |

#### Returns

`void`

#### Defined in

[src/advantage/messaging/publisher-side.ts:151](https://github.com/get-advantage/advantage/blob/3b64a3c9f09adaef20f44c0e2a8b866e77d18b71/src/advantage/messaging/publisher-side.ts#L151)
