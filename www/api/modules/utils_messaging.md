[advantage](../index.md) / utils/messaging

# Module: utils/messaging

## Variables

### ADVANTAGE

• `Const` **ADVANTAGE**: ``"ADVANTAGE"``

#### Defined in

[src/utils/messaging.ts:3](https://github.com/madington/advantage/blob/f77afb014e4b90bd97f523eef94e5426a293c8c5/src/utils/messaging.ts#L3)

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

[src/utils/messaging.ts:73](https://github.com/madington/advantage/blob/f77afb014e4b90bd97f523eef94e5426a293c8c5/src/utils/messaging.ts#L73)

___

### sendMessageAndOpenChannel

▸ **sendMessageAndOpenChannel**(`message`, `retryInterval?`, `maxAttempts?`): `Promise`\<\{ `messageChannel`: `MessageChannel` ; `reply`: [`AdvantageMessage`](../interfaces/types.AdvantageMessage.md)  }\>

Sends a message and opens a message channel to receive the reply.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `message` | `Partial`\<[`AdvantageMessage`](../interfaces/types.AdvantageMessage.md)\> | `undefined` | The message to send. |
| `retryInterval` | `number` | `100` | The interval (in milliseconds) between retry attempts. Default is 100ms. |
| `maxAttempts` | `number` | `25` | The maximum number of retry attempts. Default is 25. |

#### Returns

`Promise`\<\{ `messageChannel`: `MessageChannel` ; `reply`: [`AdvantageMessage`](../interfaces/types.AdvantageMessage.md)  }\>

A promise that resolves with the reply and the message channel.

#### Defined in

[src/utils/messaging.ts:12](https://github.com/madington/advantage/blob/f77afb014e4b90bd97f523eef94e5426a293c8c5/src/utils/messaging.ts#L12)
