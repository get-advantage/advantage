[@get-advantage/advantage](../index.md) / [advantage/advantage](../modules/advantage_advantage.md) / Advantage

# Class: Advantage

[advantage/advantage](../modules/advantage_advantage.md).Advantage

The main class for the Advantage library. This class is a singleton and is used to configure the library, register wrappers, and register custom elements.

## Constructors

### constructor

• **new Advantage**(): [`Advantage`](advantage_advantage.Advantage.md)

#### Returns

[`Advantage`](advantage_advantage.Advantage.md)

#### Defined in

[src/advantage/advantage.ts:25](https://github.com/get-advantage/advantage/blob/f2d41437895cf3f477be60f31147a43b479d51d7/src/advantage/advantage.ts#L25)

## Properties

### #customWrappers

• `Private` **#customWrappers**: `HTMLElement`[] = `[]`

#### Defined in

[src/advantage/advantage.ts:20](https://github.com/get-advantage/advantage/blob/f2d41437895cf3f477be60f31147a43b479d51d7/src/advantage/advantage.ts#L20)

___

### config

• **config**: ``null`` \| [`AdvantageConfig`](../interfaces/types.AdvantageConfig.md) = `null`

#### Defined in

[src/advantage/advantage.ts:17](https://github.com/get-advantage/advantage/blob/f2d41437895cf3f477be60f31147a43b479d51d7/src/advantage/advantage.ts#L17)

___

### defaultFormats

• **defaultFormats**: [`AdvantageFormat`](../interfaces/types.AdvantageFormat.md)[] = `defaultFormats`

#### Defined in

[src/advantage/advantage.ts:18](https://github.com/get-advantage/advantage/blob/f2d41437895cf3f477be60f31147a43b479d51d7/src/advantage/advantage.ts#L18)

___

### formatIntegrations

• **formatIntegrations**: `Map`\<`string`, [`AdvantageFormatIntegration`](../interfaces/types.AdvantageFormatIntegration.md)\>

#### Defined in

[src/advantage/advantage.ts:22](https://github.com/get-advantage/advantage/blob/f2d41437895cf3f477be60f31147a43b479d51d7/src/advantage/advantage.ts#L22)

___

### formats

• **formats**: `Map`\<`string`, [`AdvantageFormat`](../interfaces/types.AdvantageFormat.md)\>

#### Defined in

[src/advantage/advantage.ts:21](https://github.com/get-advantage/advantage/blob/f2d41437895cf3f477be60f31147a43b479d51d7/src/advantage/advantage.ts#L21)

___

### wrappers

• **wrappers**: [`IAdvantageWrapper`](../interfaces/types.IAdvantageWrapper.md)[] = `[]`

#### Defined in

[src/advantage/advantage.ts:19](https://github.com/get-advantage/advantage/blob/f2d41437895cf3f477be60f31147a43b479d51d7/src/advantage/advantage.ts#L19)

___

### id

▪ `Static` **id**: `number` = `0`

#### Defined in

[src/advantage/advantage.ts:23](https://github.com/get-advantage/advantage/blob/f2d41437895cf3f477be60f31147a43b479d51d7/src/advantage/advantage.ts#L23)

___

### instance

▪ `Static` `Private` **instance**: ``null`` \| [`Advantage`](advantage_advantage.Advantage.md) = `null`

#### Defined in

[src/advantage/advantage.ts:16](https://github.com/get-advantage/advantage/blob/f2d41437895cf3f477be60f31147a43b479d51d7/src/advantage/advantage.ts#L16)

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

[src/advantage/advantage.ts:76](https://github.com/get-advantage/advantage/blob/f2d41437895cf3f477be60f31147a43b479d51d7/src/advantage/advantage.ts#L76)

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

[src/advantage/advantage.ts:30](https://github.com/get-advantage/advantage/blob/f2d41437895cf3f477be60f31147a43b479d51d7/src/advantage/advantage.ts#L30)

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

[src/advantage/advantage.ts:64](https://github.com/get-advantage/advantage/blob/f2d41437895cf3f477be60f31147a43b479d51d7/src/advantage/advantage.ts#L64)

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

[src/advantage/advantage.ts:96](https://github.com/get-advantage/advantage/blob/f2d41437895cf3f477be60f31147a43b479d51d7/src/advantage/advantage.ts#L96)

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

[src/advantage/advantage.ts:49](https://github.com/get-advantage/advantage/blob/f2d41437895cf3f477be60f31147a43b479d51d7/src/advantage/advantage.ts#L49)

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

[src/advantage/advantage.ts:43](https://github.com/get-advantage/advantage/blob/f2d41437895cf3f477be60f31147a43b479d51d7/src/advantage/advantage.ts#L43)

___

### getInstance

▸ **getInstance**(): [`Advantage`](advantage_advantage.Advantage.md)

#### Returns

[`Advantage`](advantage_advantage.Advantage.md)

#### Defined in

[src/advantage/advantage.ts:55](https://github.com/get-advantage/advantage/blob/f2d41437895cf3f477be60f31147a43b479d51d7/src/advantage/advantage.ts#L55)
