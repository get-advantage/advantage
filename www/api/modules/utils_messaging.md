[@get-advantage/advantage](../index.md) / utils/messaging

# Module: utils/messaging

## Variables

### ADVANTAGE

• `Const` **ADVANTAGE**: ``"ADVANTAGE"``

#### Defined in

[src/utils/messaging.ts:3](https://github.com/get-advantage/advantage/blob/f2d41437895cf3f477be60f31147a43b479d51d7/src/utils/messaging.ts#L3)

## Functions

### sendMessageAndAwaitResponse

▸ **sendMessageAndAwaitResponse**(`message`, `messageChannel`, `timeout`): `Promise`\<[`AdvantageMessage`](../interfaces/types.AdvantageMessage.md)\>

Sends a message and awaits a response.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `Partial`\<[`AdvantageMessage`](../interfaces/types.AdvantageMessage.md)\> | The message to send. |
| `messageChannel` | `MessageChannel` | The message channel to use for communication. |
| `timeout` | `number` | The timeout in milliseconds. |

#### Returns

`Promise`\<[`AdvantageMessage`](../interfaces/types.AdvantageMessage.md)\>

A promise that resolves with the response message.

#### Defined in

[src/utils/messaging.ts:80](https://github.com/get-advantage/advantage/blob/f2d41437895cf3f477be60f31147a43b479d51d7/src/utils/messaging.ts#L80)

___

### sendMessageAndOpenChannel

▸ **sendMessageAndOpenChannel**(`message`, `retryInterval?`, `maxAttempts?`): `Promise`\<\{ `messageChannel`: `MessageChannel` ; `reply`: [`AdvantageMessage`](../interfaces/types.AdvantageMessage.md)  }\>

Sends a message and opens a message channel to receive the reply.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `message` | `Partial`\<[`AdvantageMessage`](../interfaces/types.AdvantageMessage.md)\> | `undefined` | The message to send. |
| `retryInterval` | `number` | `200` | The interval (in milliseconds) between retry attempts. Default is 100ms. |
| `maxAttempts` | `number` | `25` | The maximum number of retry attempts. Default is 25. |

#### Returns

`Promise`\<\{ `messageChannel`: `MessageChannel` ; `reply`: [`AdvantageMessage`](../interfaces/types.AdvantageMessage.md)  }\>

A promise that resolves with the reply and the message channel.

#### Defined in

[src/utils/messaging.ts:12](https://github.com/get-advantage/advantage/blob/f2d41437895cf3f477be60f31147a43b479d51d7/src/utils/messaging.ts#L12)
