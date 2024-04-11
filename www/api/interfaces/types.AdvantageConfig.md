[advantage](../index.md) / [types](../modules/types.md) / AdvantageConfig

# Interface: AdvantageConfig

[types](../modules/types.md).AdvantageConfig

## Properties

### configUrlResolver

• `Optional` **configUrlResolver**: () => `string`

#### Type declaration

▸ (): `string`

##### Returns

`string`

#### Defined in

[src/types/index.ts:24](https://github.com/madington/advantage/blob/0de23c3d4016943c5202b426e1e3defca0c31fc7/src/types/index.ts#L24)

___

### formatIntegrations

• `Optional` **formatIntegrations**: [`AdvantageFormatIntegration`](types.AdvantageFormatIntegration.md)[]

#### Defined in

[src/types/index.ts:26](https://github.com/madington/advantage/blob/0de23c3d4016943c5202b426e1e3defca0c31fc7/src/types/index.ts#L26)

___

### formats

• `Optional` **formats**: [`AdvantageFormat`](types.AdvantageFormat.md)[]

#### Defined in

[src/types/index.ts:25](https://github.com/madington/advantage/blob/0de23c3d4016943c5202b426e1e3defca0c31fc7/src/types/index.ts#L25)

___

### messageValidator

• `Optional` **messageValidator**: (`parentElement`: `HTMLElement` \| [`IAdvantageWrapper`](types.IAdvantageWrapper.md), `message`: `MessageEvent`\<`any`\>) => `boolean`

#### Type declaration

▸ (`parentElement`, `message`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `parentElement` | `HTMLElement` \| [`IAdvantageWrapper`](types.IAdvantageWrapper.md) |
| `message` | `MessageEvent`\<`any`\> |

##### Returns

`boolean`

#### Defined in

[src/types/index.ts:27](https://github.com/madington/advantage/blob/0de23c3d4016943c5202b426e1e3defca0c31fc7/src/types/index.ts#L27)
