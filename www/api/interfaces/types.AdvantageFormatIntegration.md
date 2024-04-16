[advantage](../index.md) / [types](../modules/types.md) / AdvantageFormatIntegration

# Interface: AdvantageFormatIntegration

[types](../modules/types.md).AdvantageFormatIntegration

## Properties

### format

• **format**: `string`

#### Defined in

[src/types/index.ts:71](https://github.com/madington/advantage/blob/4b52c8a30c07d3c6d4fb1e069c3b2690cb1ebb9c/src/types/index.ts#L71)

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

[src/types/index.ts:77](https://github.com/madington/advantage/blob/4b52c8a30c07d3c6d4fb1e069c3b2690cb1ebb9c/src/types/index.ts#L77)

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

[src/types/index.ts:78](https://github.com/madington/advantage/blob/4b52c8a30c07d3c6d4fb1e069c3b2690cb1ebb9c/src/types/index.ts#L78)

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

[src/types/index.ts:72](https://github.com/madington/advantage/blob/4b52c8a30c07d3c6d4fb1e069c3b2690cb1ebb9c/src/types/index.ts#L72)

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

[src/types/index.ts:76](https://github.com/madington/advantage/blob/4b52c8a30c07d3c6d4fb1e069c3b2690cb1ebb9c/src/types/index.ts#L76)
