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

[src/advantage/wrapper.ts:31](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/wrapper.ts#L31)

## Properties

### #advantage

• `Private` **#advantage**: [`Advantage`](advantage_advantage.Advantage.md)

#### Defined in

[src/advantage/wrapper.ts:17](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/wrapper.ts#L17)

___

### #root

• `Private` **#root**: `ShadowRoot`

#### Defined in

[src/advantage/wrapper.ts:16](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/wrapper.ts#L16)

___

### #slotAdvantageContent

• `Private` **#slotAdvantageContent**: `HTMLSlotElement`

#### Defined in

[src/advantage/wrapper.ts:18](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/wrapper.ts#L18)

___

### #slotChangeRegistered

• `Private` **#slotChangeRegistered**: `boolean` = `false`

#### Defined in

[src/advantage/wrapper.ts:19](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/wrapper.ts#L19)

___

### #styleElem

• `Private` **#styleElem**: `HTMLStyleElement`

#### Defined in

[src/advantage/wrapper.ts:15](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/wrapper.ts#L15)

___

### container

• **container**: `HTMLDivElement`

#### Implementation of

[IAdvantageWrapper](../interfaces/types.IAdvantageWrapper.md).[container](../interfaces/types.IAdvantageWrapper.md#container)

#### Defined in

[src/advantage/wrapper.ts:21](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/wrapper.ts#L21)

___

### content

• **content**: `HTMLDivElement`

#### Implementation of

[IAdvantageWrapper](../interfaces/types.IAdvantageWrapper.md).[content](../interfaces/types.IAdvantageWrapper.md#content)

#### Defined in

[src/advantage/wrapper.ts:22](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/wrapper.ts#L22)

___

### currentFormat

• **currentFormat**: ``null`` \| `string` = `null`

#### Implementation of

[IAdvantageWrapper](../interfaces/types.IAdvantageWrapper.md).[currentFormat](../interfaces/types.IAdvantageWrapper.md#currentformat)

#### Defined in

[src/advantage/wrapper.ts:24](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/wrapper.ts#L24)

___

### messageHandler

• **messageHandler**: [`AdvantageAdSlotResponder`](messaging_publisher_side.AdvantageAdSlotResponder.md)

#### Defined in

[src/advantage/wrapper.ts:25](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/wrapper.ts#L25)

___

### simulating

• **simulating**: `boolean` = `false`

#### Defined in

[src/advantage/wrapper.ts:26](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/wrapper.ts#L26)

___

### uiLayer

• **uiLayer**: [`IAdvantageUILayer`](../interfaces/types.IAdvantageUILayer.md)

#### Implementation of

[IAdvantageWrapper](../interfaces/types.IAdvantageWrapper.md).[uiLayer](../interfaces/types.IAdvantageWrapper.md#uilayer)

#### Defined in

[src/advantage/wrapper.ts:23](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/wrapper.ts#L23)

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

[src/advantage/wrapper.ts:113](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/wrapper.ts#L113)

## Methods

### #detectDOMChanges

▸ **#detectDOMChanges**(): `void`

Detects DOM changes and resets the wrapper if a new ad is loaded.

#### Returns

`void`

#### Defined in

[src/advantage/wrapper.ts:93](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/wrapper.ts#L93)

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

[src/advantage/wrapper.ts:255](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/wrapper.ts#L255)

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

[src/advantage/wrapper.ts:187](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/wrapper.ts#L187)

___

### close

▸ **close**(): `void`

Closes the current ad format.

#### Returns

`void`

#### Implementation of

[IAdvantageWrapper](../interfaces/types.IAdvantageWrapper.md).[close](../interfaces/types.IAdvantageWrapper.md#close)

#### Defined in

[src/advantage/wrapper.ts:232](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/wrapper.ts#L232)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Lifecycle method called when the element is connected to the DOM.

#### Returns

`void`

#### Defined in

[src/advantage/wrapper.ts:286](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/wrapper.ts#L286)

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

[src/advantage/wrapper.ts:272](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/wrapper.ts#L272)

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

[src/advantage/wrapper.ts:138](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/wrapper.ts#L138)

___

### reset

▸ **reset**(): `void`

Resets the current ad format.

#### Returns

`void`

#### Implementation of

[IAdvantageWrapper](../interfaces/types.IAdvantageWrapper.md).[reset](../interfaces/types.IAdvantageWrapper.md#reset)

#### Defined in

[src/advantage/wrapper.ts:211](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/wrapper.ts#L211)

___

### resetCSS

▸ **resetCSS**(): `void`

Resets the CSS in the shadow root of the wrapper.

#### Returns

`void`

#### Implementation of

[IAdvantageWrapper](../interfaces/types.IAdvantageWrapper.md).[resetCSS](../interfaces/types.IAdvantageWrapper.md#resetcss)

#### Defined in

[src/advantage/wrapper.ts:279](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/wrapper.ts#L279)

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

[src/advantage/wrapper.ts:121](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/wrapper.ts#L121)
