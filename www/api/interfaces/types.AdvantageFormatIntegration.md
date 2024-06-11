[@get-advantage/advantage](../index.md) / [types](../modules/types.md) / AdvantageFormatIntegration

# Interface: AdvantageFormatIntegration

[types](../modules/types.md).AdvantageFormatIntegration

## Properties

### format

• **format**: `string`

#### Defined in

[src/types/index.ts:71](https://github.com/get-advantage/advantage/blob/3b64a3c9f09adaef20f44c0e2a8b866e77d18b71/src/types/index.ts#L71)

___

### onClose

• `Optional` **onClose**: (`wrapper`: [`IAdvantageWrapper`](types.IAdvantageWrapper.md), `adIframe?`: `HTMLElement`) => `void`

#### Type declaration

▸ (`wrapper`, `adIframe?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `wrapper` | [`IAdvantageWrapper`](types.IAdvantageWrapper.md) |
| `adIframe?` | `HTMLElement` |

##### Returns

`void`

#### Defined in

[src/types/index.ts:77](https://github.com/get-advantage/advantage/blob/3b64a3c9f09adaef20f44c0e2a8b866e77d18b71/src/types/index.ts#L77)

___

### onReset

• `Optional` **onReset**: (`wrapper`: [`IAdvantageWrapper`](types.IAdvantageWrapper.md), `adIframe?`: `HTMLElement`) => `void`

#### Type declaration

▸ (`wrapper`, `adIframe?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `wrapper` | [`IAdvantageWrapper`](types.IAdvantageWrapper.md) |
| `adIframe?` | `HTMLElement` |

##### Returns

`void`

#### Defined in

[src/types/index.ts:78](https://github.com/get-advantage/advantage/blob/3b64a3c9f09adaef20f44c0e2a8b866e77d18b71/src/types/index.ts#L78)

___

### setup

• **setup**: (`wrapper`: [`IAdvantageWrapper`](types.IAdvantageWrapper.md), `adIframe?`: `HTMLElement`) => `Promise`\<`void`\>

#### Type declaration

▸ (`wrapper`, `adIframe?`): `Promise`\<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `wrapper` | [`IAdvantageWrapper`](types.IAdvantageWrapper.md) |
| `adIframe?` | `HTMLElement` |

##### Returns

`Promise`\<`void`\>

#### Defined in

[src/types/index.ts:72](https://github.com/get-advantage/advantage/blob/3b64a3c9f09adaef20f44c0e2a8b866e77d18b71/src/types/index.ts#L72)

___

### teardown

• `Optional` **teardown**: (`wrapper`: [`IAdvantageWrapper`](types.IAdvantageWrapper.md), `adIframe?`: `HTMLElement`) => `void`

#### Type declaration

▸ (`wrapper`, `adIframe?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `wrapper` | [`IAdvantageWrapper`](types.IAdvantageWrapper.md) |
| `adIframe?` | `HTMLElement` |

##### Returns

`void`

#### Defined in

[src/types/index.ts:76](https://github.com/get-advantage/advantage/blob/3b64a3c9f09adaef20f44c0e2a8b866e77d18b71/src/types/index.ts#L76)
