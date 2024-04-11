[advantage](../index.md) / [advantage/advantage](../modules/advantage_advantage.md) / Advantage

# Class: Advantage

[advantage/advantage](../modules/advantage_advantage.md).Advantage

The main class for the Advantage library. This class is a singleton and is used to configure the library, register wrappers, and register custom elements.

## Constructors

### constructor

• **new Advantage**(): [`Advantage`](advantage_advantage.Advantage.md)

#### Returns

[`Advantage`](advantage_advantage.Advantage.md)

#### Defined in

[src/advantage/advantage.ts:26](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/advantage.ts#L26)

## Properties

### #customWrappers

• `Private` **#customWrappers**: `HTMLElement`[] = `[]`

#### Defined in

[src/advantage/advantage.ts:22](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/advantage.ts#L22)

___

### config

• **config**: ``null`` \| [`AdvantageConfig`](../interfaces/types.AdvantageConfig.md) = `null`

#### Defined in

[src/advantage/advantage.ts:19](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/advantage.ts#L19)

___

### defaultFormats

• **defaultFormats**: [`AdvantageFormat`](../interfaces/types.AdvantageFormat.md)[] = `defaultFormats`

#### Defined in

[src/advantage/advantage.ts:20](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/advantage.ts#L20)

___

### formatIntegrations

• **formatIntegrations**: `Map`\<`string`, [`AdvantageFormatIntegration`](../interfaces/types.AdvantageFormatIntegration.md)\>

#### Defined in

[src/advantage/advantage.ts:24](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/advantage.ts#L24)

___

### formats

• **formats**: `Map`\<`string`, [`AdvantageFormat`](../interfaces/types.AdvantageFormat.md)\>

#### Defined in

[src/advantage/advantage.ts:23](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/advantage.ts#L23)

___

### wrappers

• **wrappers**: [`IAdvantageWrapper`](../interfaces/types.IAdvantageWrapper.md)[] = `[]`

#### Defined in

[src/advantage/advantage.ts:21](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/advantage.ts#L21)

___

### instance

▪ `Static` `Private` **instance**: [`Advantage`](advantage_advantage.Advantage.md)

#### Defined in

[src/advantage/advantage.ts:18](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/advantage.ts#L18)

## Methods

### applyConfig

▸ **applyConfig**(`config`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`AdvantageConfig`](../interfaces/types.AdvantageConfig.md) |

#### Returns

`void`

#### Defined in

[src/advantage/advantage.ts:85](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/advantage.ts#L85)

___

### configure

▸ **configure**(`config`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`AdvantageConfig`](../interfaces/types.AdvantageConfig.md) |

#### Returns

`void`

#### Defined in

[src/advantage/advantage.ts:30](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/advantage.ts#L30)

___

### loadConfig

▸ **loadConfig**(`configUrl`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `configUrl` | `string` |

#### Returns

`void`

#### Defined in

[src/advantage/advantage.ts:73](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/advantage.ts#L73)

___

### mergeUniqueFormats

▸ **mergeUniqueFormats**(`localFormats`, `userFormats`): [`AdvantageFormat`](../interfaces/types.AdvantageFormat.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `localFormats` | [`AdvantageFormat`](../interfaces/types.AdvantageFormat.md)[] |
| `userFormats` | [`AdvantageFormat`](../interfaces/types.AdvantageFormat.md)[] |

#### Returns

[`AdvantageFormat`](../interfaces/types.AdvantageFormat.md)[]

#### Defined in

[src/advantage/advantage.ts:103](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/advantage.ts#L103)

___

### registerComponents

▸ **registerComponents**(): `void`

#### Returns

`void`

#### Defined in

[src/advantage/advantage.ts:64](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/advantage.ts#L64)

___

### registerCustomWrapper

▸ **registerCustomWrapper**(`wrapper`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `wrapper` | `HTMLElement` |

#### Returns

`void`

#### Defined in

[src/advantage/advantage.ts:49](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/advantage.ts#L49)

___

### registerWrapper

▸ **registerWrapper**(`wrapper`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `wrapper` | [`IAdvantageWrapper`](../interfaces/types.IAdvantageWrapper.md) |

#### Returns

`void`

#### Defined in

[src/advantage/advantage.ts:43](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/advantage.ts#L43)

___

### getInstance

▸ **getInstance**(): [`Advantage`](advantage_advantage.Advantage.md)

#### Returns

[`Advantage`](advantage_advantage.Advantage.md)

#### Defined in

[src/advantage/advantage.ts:55](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/advantage.ts#L55)
