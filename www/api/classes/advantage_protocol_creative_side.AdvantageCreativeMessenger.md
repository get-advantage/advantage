[advantage](../index.md) / [advantage-protocol/creative-side](../modules/advantage_protocol_creative_side.md) / AdvantageCreativeMessenger

# Class: AdvantageCreativeMessenger

[advantage-protocol/creative-side](../modules/advantage_protocol_creative_side.md).AdvantageCreativeMessenger

AdvantageCreativeMessenger is the class that should be used in creative ads to communicate with Advantage on the publisher side. This class is used to request formats and other information from the parent website.

**`Example`**

Here's an example on how to request a format from the parent website and then start the ad when the format is confirmed:

::: code-group
```typescript
const advantageMessenger = new AdvantageCreativeMessenger();
const session = await advantageMessenger.startSession();

if (session) {
 // Request the midscroll format
 const response = await advantageMessenger.sendMessage({
     action: AdvantageMessageAction.REQUEST_FORMAT,
     format: AdvantageFormatName.Midscroll
 });
 // The format is confirmed, start the ad
 if (response?.action === AdvantageMessageAction.FORMAT_CONFIRMED) {
     document.body.classList.add("midscroll");
 }
}
```
```javascript
const advantageMessenger = new AdvantageCreativeMessenger();
advantageMessenger.startSession().then((confirmed) => {
 if (confirmed) {
     advantageMessenger.sendMessage({
         action: "REQUEST_FORMAT",
         format: "MIDSCROLL"
     }).then((response) => {
         if (response.action === "FORMAT_CONFIRMED") {
             // The format is confirmed, start the ad
             document.body.classList.add("midscroll");
         }
     });
 }
});
```

## Constructors

### constructor

• **new AdvantageCreativeMessenger**(): [`AdvantageCreativeMessenger`](advantage_protocol_creative_side.AdvantageCreativeMessenger.md)

#### Returns

[`AdvantageCreativeMessenger`](advantage_protocol_creative_side.AdvantageCreativeMessenger.md)

#### Defined in

src/advantage-protocol/creative-side.ts:53

## Properties

### #messageChannel

• `Private` **#messageChannel**: ``null`` \| `MessageChannel` = `null`

#### Defined in

src/advantage-protocol/creative-side.ts:49

___

### #sessionID

• `Private` **#sessionID**: `string`

#### Defined in

src/advantage-protocol/creative-side.ts:50

___

### #validSession

• `Private` **#validSession**: `boolean` = `false`

#### Defined in

src/advantage-protocol/creative-side.ts:51

## Methods

### onMessage

▸ **onMessage**(`callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`message`: [`AdvantageMessage`](../interfaces/types.AdvantageMessage.md)) => `void` |

#### Returns

`void`

#### Defined in

src/advantage-protocol/creative-side.ts:90

___

### sendMessage

▸ **sendMessage**(`message`): `Promise`\<`undefined` \| [`AdvantageMessage`](../interfaces/types.AdvantageMessage.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `Partial`\<[`AdvantageMessage`](../interfaces/types.AdvantageMessage.md)\> |

#### Returns

`Promise`\<`undefined` \| [`AdvantageMessage`](../interfaces/types.AdvantageMessage.md)\>

#### Defined in

src/advantage-protocol/creative-side.ts:69

___

### startSession

▸ **startSession**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Defined in

src/advantage-protocol/creative-side.ts:57