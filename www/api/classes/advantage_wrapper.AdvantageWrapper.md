[advantage](../index.md) / [advantage/wrapper](../modules/advantage_wrapper.md) / AdvantageWrapper

# Class: AdvantageWrapper

[advantage/wrapper](../modules/advantage_wrapper.md).AdvantageWrapper

Represents the AdvantageWrapper class, which extends the HTMLElement class and implements the IAdvantageWrapper interface.
This class is responsible for creating and managing the wrapper element for Advantage ads.

## Hierarchy

- `HTMLElement`

  ↳ **`AdvantageWrapper`**

## Implements

- [`IAdvantageWrapper`](../interfaces/types.IAdvantageWrapper.md)

## Constructors

### constructor

• **new AdvantageWrapper**(): [`AdvantageWrapper`](advantage_wrapper.AdvantageWrapper.md)

Creates an instance of AdvantageWrapper.

#### Returns

[`AdvantageWrapper`](advantage_wrapper.AdvantageWrapper.md)

#### Overrides

HTMLElement.constructor

#### Defined in

[src/advantage/wrapper.ts:30](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/advantage/wrapper.ts#L30)

## Properties

### #root

• `Private` **#root**: `ShadowRoot`

#### Defined in

[src/advantage/wrapper.ts:16](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/advantage/wrapper.ts#L16)

___

### #slotAdvantageContent

• `Private` **#slotAdvantageContent**: `HTMLSlotElement`

#### Defined in

[src/advantage/wrapper.ts:17](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/advantage/wrapper.ts#L17)

___

### #slotChangeRegistered

• `Private` **#slotChangeRegistered**: `boolean` = `false`

#### Defined in

[src/advantage/wrapper.ts:18](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/advantage/wrapper.ts#L18)

___

### #styleElem

• `Private` **#styleElem**: `HTMLStyleElement`

#### Defined in

[src/advantage/wrapper.ts:15](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/advantage/wrapper.ts#L15)

___

### container

• **container**: `HTMLDivElement`

#### Implementation of

[IAdvantageWrapper](../interfaces/types.IAdvantageWrapper.md).[container](../interfaces/types.IAdvantageWrapper.md#container)

#### Defined in

[src/advantage/wrapper.ts:20](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/advantage/wrapper.ts#L20)

___

### content

• **content**: `HTMLDivElement`

#### Implementation of

[IAdvantageWrapper](../interfaces/types.IAdvantageWrapper.md).[content](../interfaces/types.IAdvantageWrapper.md#content)

#### Defined in

[src/advantage/wrapper.ts:21](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/advantage/wrapper.ts#L21)

___

### currentFormat

• **currentFormat**: ``null`` \| `string` = `null`

#### Implementation of

[IAdvantageWrapper](../interfaces/types.IAdvantageWrapper.md).[currentFormat](../interfaces/types.IAdvantageWrapper.md#currentformat)

#### Defined in

[src/advantage/wrapper.ts:23](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/advantage/wrapper.ts#L23)

___

### messageHandler

• **messageHandler**: [`AdvantageAdSlotResponder`](advantage_messaging_publisher_side.AdvantageAdSlotResponder.md)

#### Defined in

[src/advantage/wrapper.ts:24](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/advantage/wrapper.ts#L24)

___

### simulating

• **simulating**: `boolean` = `false`

#### Defined in

[src/advantage/wrapper.ts:25](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/advantage/wrapper.ts#L25)

___

### uiLayer

• **uiLayer**: [`IAdvantageUILayer`](../interfaces/types.IAdvantageUILayer.md)

#### Implementation of

[IAdvantageWrapper](../interfaces/types.IAdvantageWrapper.md).[uiLayer](../interfaces/types.IAdvantageWrapper.md#uilayer)

#### Defined in

[src/advantage/wrapper.ts:22](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/advantage/wrapper.ts#L22)

## Accessors

### contentNodes

• `get` **contentNodes**(): `Node`[]

Gets the content nodes assigned to the advantage-ad-slot.

#### Returns

`Node`[]

An array of content nodes.

#### Implementation of

[IAdvantageWrapper](../interfaces/types.IAdvantageWrapper.md).[contentNodes](../interfaces/types.IAdvantageWrapper.md#contentnodes)

#### Defined in

[src/advantage/wrapper.ts:111](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/advantage/wrapper.ts#L111)

## Methods

### #detectDOMChanges

▸ **#detectDOMChanges**(): `void`

Detects DOM changes and resets the wrapper if a new ad is loaded.

#### Returns

`void`

#### Defined in

[src/advantage/wrapper.ts:91](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/advantage/wrapper.ts#L91)

___

### animateClose

▸ **animateClose**(): `void`

#### Returns

`void`

#### Implementation of

[IAdvantageWrapper](../interfaces/types.IAdvantageWrapper.md).[animateClose](../interfaces/types.IAdvantageWrapper.md#animateclose)

#### Defined in

[src/advantage/wrapper.ts:229](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/advantage/wrapper.ts#L229)

___

### applyStylesToAllChildElements

▸ **applyStylesToAllChildElements**(`styles`): `void`

Applies styles to all child elements of the wrapper.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `styles` | `string` | The CSS styles to apply. |

#### Returns

`void`

#### Implementation of

[IAdvantageWrapper](../interfaces/types.IAdvantageWrapper.md).[applyStylesToAllChildElements](../interfaces/types.IAdvantageWrapper.md#applystylestoallchildelements)

#### Defined in

[src/advantage/wrapper.ts:273](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/advantage/wrapper.ts#L273)

___

### changeContent

▸ **changeContent**(`content`): `void`

Changes the content of the wrapper.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `content` | `string` \| `HTMLElement` | The new content to be added to the wrapper. |

#### Returns

`void`

#### Implementation of

[IAdvantageWrapper](../interfaces/types.IAdvantageWrapper.md).[changeContent](../interfaces/types.IAdvantageWrapper.md#changecontent)

#### Defined in

[src/advantage/wrapper.ts:185](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/advantage/wrapper.ts#L185)

___

### close

▸ **close**(): `void`

Closes the current ad format.

#### Returns

`void`

#### Implementation of

[IAdvantageWrapper](../interfaces/types.IAdvantageWrapper.md).[close](../interfaces/types.IAdvantageWrapper.md#close)

#### Defined in

[src/advantage/wrapper.ts:240](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/advantage/wrapper.ts#L240)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Lifecycle method called when the element is connected to the DOM.

#### Returns

`void`

#### Defined in

[src/advantage/wrapper.ts:304](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/advantage/wrapper.ts#L304)

___

### insertCSS

▸ **insertCSS**(`CSS`): `void`

Inserts CSS into the shadow root of the wrapper.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `CSS` | `string` | The CSS to insert. |

#### Returns

`void`

#### Implementation of

[IAdvantageWrapper](../interfaces/types.IAdvantageWrapper.md).[insertCSS](../interfaces/types.IAdvantageWrapper.md#insertcss)

#### Defined in

[src/advantage/wrapper.ts:290](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/advantage/wrapper.ts#L290)

___

### morphIntoFormat

▸ **morphIntoFormat**(`format`): `Promise`\<`void`\>

Morphs the wrapper into a specific ad format.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `format` | `string` | The format to morph into. |

#### Returns

`Promise`\<`void`\>

A promise that resolves when the morphing is complete.

#### Implementation of

[IAdvantageWrapper](../interfaces/types.IAdvantageWrapper.md).[morphIntoFormat](../interfaces/types.IAdvantageWrapper.md#morphintoformat)

#### Defined in

[src/advantage/wrapper.ts:136](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/advantage/wrapper.ts#L136)

___

### reset

▸ **reset**(): `void`

Resets the current ad format.

#### Returns

`void`

#### Implementation of

[IAdvantageWrapper](../interfaces/types.IAdvantageWrapper.md).[reset](../interfaces/types.IAdvantageWrapper.md#reset)

#### Defined in

[src/advantage/wrapper.ts:209](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/advantage/wrapper.ts#L209)

___

### resetCSS

▸ **resetCSS**(): `void`

Resets the CSS in the shadow root of the wrapper.

#### Returns

`void`

#### Implementation of

[IAdvantageWrapper](../interfaces/types.IAdvantageWrapper.md).[resetCSS](../interfaces/types.IAdvantageWrapper.md#resetcss)

#### Defined in

[src/advantage/wrapper.ts:297](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/advantage/wrapper.ts#L297)

___

### simulateFormat

▸ **simulateFormat**(`format`): `Promise`\<`void`\>

Simulates a specific ad format.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `format` | `string` | The format to simulate. |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IAdvantageWrapper](../interfaces/types.IAdvantageWrapper.md).[simulateFormat](../interfaces/types.IAdvantageWrapper.md#simulateformat)

#### Defined in

[src/advantage/wrapper.ts:119](https://github.com/madington/advantage/blob/1529685a28e94a7188513095bd1e6443524e7e35/src/advantage/wrapper.ts#L119)
