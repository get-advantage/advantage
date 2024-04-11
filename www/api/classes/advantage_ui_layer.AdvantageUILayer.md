[advantage](../index.md) / [advantage/ui-layer](../modules/advantage_ui_layer.md) / AdvantageUILayer

# Class: AdvantageUILayer

[advantage/ui-layer](../modules/advantage_ui_layer.md).AdvantageUILayer

Represents the UI layer for an Advantage high-impact format.
This class extends the HTMLElement class and provides methods for manipulating the UI content and styles.

## Hierarchy

- `HTMLElement`

  ↳ **`AdvantageUILayer`**

## Constructors

### constructor

• **new AdvantageUILayer**(): [`AdvantageUILayer`](advantage_ui_layer.AdvantageUILayer.md)

Creates an instance of AdvantageUILayer.
Attaches a shadow root to the element and initializes the necessary elements.

#### Returns

[`AdvantageUILayer`](advantage_ui_layer.AdvantageUILayer.md)

#### Overrides

HTMLElement.constructor

#### Defined in

[src/advantage/ui-layer.ts:16](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/ui-layer.ts#L16)

## Properties

### #container

• `Private` **#container**: `HTMLDivElement`

#### Defined in

[src/advantage/ui-layer.ts:9](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/ui-layer.ts#L9)

___

### #root

• `Private` **#root**: `ShadowRoot`

#### Defined in

[src/advantage/ui-layer.ts:7](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/ui-layer.ts#L7)

___

### #slotUIContent

• `Private` **#slotUIContent**: `HTMLSlotElement`

#### Defined in

[src/advantage/ui-layer.ts:10](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/ui-layer.ts#L10)

___

### #styleElem

• `Private` **#styleElem**: `HTMLStyleElement`

#### Defined in

[src/advantage/ui-layer.ts:8](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/ui-layer.ts#L8)

## Methods

### changeContent

▸ **changeContent**(`content`): `void`

Changes the content of the UI layer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `content` | `string` \| `HTMLElement` | The new content to be displayed. It can be either a string or an HTMLElement. |

#### Returns

`void`

#### Defined in

[src/advantage/ui-layer.ts:33](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/ui-layer.ts#L33)

___

### insertCSS

▸ **insertCSS**(`CSS`): `void`

Inserts CSS styles into the UI layer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `CSS` | `string` | The CSS styles to be inserted. |

#### Returns

`void`

#### Defined in

[src/advantage/ui-layer.ts:46](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/ui-layer.ts#L46)

___

### querySlottedElements

▸ **querySlottedElements**(`selector`): `Node`[]

Queries the slotted elements that match the specified selector.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `selector` | `string` | The CSS selector to match against the slotted elements. |

#### Returns

`Node`[]

An array of matching elements.

#### Defined in

[src/advantage/ui-layer.ts:55](https://github.com/madington/advantage/blob/42928a4133e2ee49dd1534bf7e871f2f7429dc80/src/advantage/ui-layer.ts#L55)
