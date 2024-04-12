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

[src/types/index.ts:24](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/types/index.ts#L24)

___

### formatIntegrations

• `Optional` **formatIntegrations**: [`AdvantageFormatIntegration`](types.AdvantageFormatIntegration.md)[]

#### Defined in

[src/types/index.ts:26](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/types/index.ts#L26)

___

### formats

• `Optional` **formats**: [`AdvantageFormat`](types.AdvantageFormat.md)[]

#### Defined in

[src/types/index.ts:25](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/types/index.ts#L25)

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

[src/types/index.ts:27](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/types/index.ts#L27)
