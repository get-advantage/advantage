[advantage](../index.md) / [types](../modules/types.md) / AdvantageFormatIntegration

# Interface: AdvantageFormatIntegration

[types](../modules/types.md).AdvantageFormatIntegration

## Properties

### format

• **format**: `string`

#### Defined in

[src/types/index.ts:67](https://github.com/madington/advantage/blob/0de23c3d4016943c5202b426e1e3defca0c31fc7/src/types/index.ts#L67)

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

[src/types/index.ts:73](https://github.com/madington/advantage/blob/0de23c3d4016943c5202b426e1e3defca0c31fc7/src/types/index.ts#L73)

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

[src/types/index.ts:74](https://github.com/madington/advantage/blob/0de23c3d4016943c5202b426e1e3defca0c31fc7/src/types/index.ts#L74)

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

[src/types/index.ts:68](https://github.com/madington/advantage/blob/0de23c3d4016943c5202b426e1e3defca0c31fc7/src/types/index.ts#L68)

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

[src/types/index.ts:72](https://github.com/madington/advantage/blob/0de23c3d4016943c5202b426e1e3defca0c31fc7/src/types/index.ts#L72)
