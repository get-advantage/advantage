[@get-advantage/advantage](../index.md) / utils/misc

# Module: utils/misc

## Functions

### collectIframes

▸ **collectIframes**(`node`): `HTMLIFrameElement`[]

Collects all the iframes within a given node and its children.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `Node` | The node to start collecting iframes from. |

#### Returns

`HTMLIFrameElement`[]

An array of HTMLIFrameElement objects representing the iframes found.

#### Defined in

[src/utils/misc.ts:6](https://github.com/get-advantage/advantage/blob/f2d41437895cf3f477be60f31147a43b479d51d7/src/utils/misc.ts#L6)

___

### traverseNodes

▸ **traverseNodes**(`node`, `func`): `void`

Traverses the DOM tree starting from a given node and applies a function to each element node.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `Node` | The starting node for traversal. |
| `func` | (`node`: `HTMLElement`) => `void` | The function to be applied to each element node. |

#### Returns

`void`

#### Defined in

[src/utils/misc.ts:32](https://github.com/get-advantage/advantage/blob/f2d41437895cf3f477be60f31147a43b479d51d7/src/utils/misc.ts#L32)
