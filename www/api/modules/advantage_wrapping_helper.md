[advantage](../index.md) / advantage/wrapping-helper

# Module: advantage/wrapping-helper

## Functions

### advantageWrapAdSlotElement

▸ **advantageWrapAdSlotElement**(`target`, `excludedFormats?`): `void`

Moves an element into a wrapper structure and creates a new slot in the wrapper structure.
The wrapper structure is inserted into the DOM before the element.
If the function is passed an array of formats that should not be allowed for this wrapper, it adds an attribute to the wrapper structure.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | `string` \| `HTMLElement` | The target element or selector string. |
| `excludedFormats?` | `string`[] | An optional array of excluded formats. |

#### Returns

`void`

#### Defined in

[src/advantage/wrapping-helper.ts:8](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/advantage/wrapping-helper.ts#L8)
