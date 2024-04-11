[advantage](../index.md) / [types](../modules/types.md) / AdvantageFormatIntegration

# Interface: AdvantageFormatIntegration

[types](../modules/types.md).AdvantageFormatIntegration

## Properties

### format

• **format**: `string`

#### Defined in

[src/types/index.ts:70](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/types/index.ts#L70)

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

[src/types/index.ts:76](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/types/index.ts#L76)

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

[src/types/index.ts:77](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/types/index.ts#L77)

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

[src/types/index.ts:71](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/types/index.ts#L71)

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

[src/types/index.ts:75](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/types/index.ts#L75)
