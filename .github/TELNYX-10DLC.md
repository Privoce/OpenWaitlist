# Telnyx 10DLC — demo site campaign (resubmission)

Use these answers when resubmitting the **openwaitlist** campaign. The strategy is a **product demo** at `app.openwaitlist.privoce.com` for restaurant operators evaluating OpenWaitlist — **not** a live multi-restaurant guest waitlist.

---

## Campaign description (paste into Description field)

```
OpenWaitlist product demo. Privoce operates a public demo at https://app.openwaitlist.privoce.com for restaurant owners and managers evaluating our open-source waitlist software. Demo participants may optionally enter their own phone number and opt in to receive sample transactional SMS (queue confirmation and table-ready notifications) to see how guest messaging works before they deploy their own instance. This is not a live restaurant serving paying guests. OpenWaitlist is the sole perceived sender. Production restaurant deployments require separate per-business 10DLC brand and campaign registration.
```

---

## Use case

**Account Notification**

(Transactional sample notifications for demo participants evaluating the product.)

---

## Message flow / opt-in workflow (paste into Message flow field)

```
This is the OpenWaitlist product demo at https://app.openwaitlist.privoce.com — a hands-on evaluation site for restaurant operators, not a live restaurant waitlist.

1. A prospective customer (restaurant owner, manager, or staff member) visits the demo kiosk at https://app.openwaitlist.privoce.com/kiosk/add/
2. They enter a sample name (required) and party size (required) to try the product.
3. Phone number is optional and only used if they choose to test SMS.
4. They see an unchecked optional checkbox with this exact language:

"I agree to receive automated demo waitlist text messages from OpenWaitlist at the phone number above, to see how guest SMS notifications work in this product demo. Message frequency varies. Message and data rates may apply. This is not a live restaurant waitlist. Reply STOP to cancel. Reply HELP for help."

Privacy Policy: https://app.openwaitlist.privoce.com/privacy/
Terms: https://app.openwaitlist.privoce.com/terms/

5. SMS is sent only if the participant checks the box AND enters a valid phone number.
6. Participants may use the demo without opting in to SMS.
7. Messages are sent by OpenWaitlist (Privoce) as the product demo operator — not on behalf of any third-party restaurant.

Live opt-in form: https://app.openwaitlist.privoce.com/kiosk/add/
```

Upload a screenshot of the kiosk form showing:
- Amber “Product demo” banner
- Optional phone field
- Unchecked SMS checkbox with the consent language above
- Privacy and Terms links

---

## Perceived sender (if asked separately)

**OpenWaitlist** (operated by Privoce) is the sole sender. Recipients are **demo participants** evaluating the software — typically restaurant operators testing the product with their own phone number. This campaign does **not** send messages to end consumers on behalf of independent restaurant businesses. Each restaurant that deploys OpenWaitlist in production must register its own 10DLC brand and campaign for its guests.

---

## Sample message 1 — queue confirmation (join)

```
OpenWaitlist demo: You've been added to the sample waitlist. Your number is SE01. Check your place in line here: https://app.openwaitlist.privoce.com/p/waitlist/aBc12XyZ9k/ Reply HELP for help. Reply STOP to cancel.
```

---

## Sample message 2 — table ready (notify)

```
OpenWaitlist demo: Hi Jane, it's your turn in this sample flow. Show ticket SE01 to continue the demo. Reply HELP for help. Reply STOP to cancel.
```

---

## Keywords (no spaces after commas)

| Type | Keywords |
|------|----------|
| Opt in | `START,YES` |
| Opt out | `STOP,UNSUBSCRIBE,CANCEL,END,QUIT` |
| Help | `HELP,INFO` |

---

## Compliance links

- Privacy: https://app.openwaitlist.privoce.com/privacy/
- Terms: https://app.openwaitlist.privoce.com/terms/
- Demo home: https://app.openwaitlist.privoce.com/
- Opt-in form: https://app.openwaitlist.privoce.com/kiosk/add/

---

## Quick reference — all form fields

| Field | Answer |
|-------|--------|
| **Campaign description** | See “Campaign description” section above |
| **Use case** | Account Notification |
| **Message flow** | See “Message flow” section above |
| **Opt-in type** | Web form (digital) |
| **Opt-in URL** | https://app.openwaitlist.privoce.com/kiosk/add/ |
| **Privacy policy URL** | https://app.openwaitlist.privoce.com/privacy/ |
| **Terms URL** | https://app.openwaitlist.privoce.com/terms/ |
| **Sample message 1** | Queue confirmation (see above) |
| **Sample message 2** | Table ready (see above) |
| **Opt-in keywords** | START,YES |
| **Opt-out keywords** | STOP,UNSUBSCRIBE,CANCEL,END,QUIT |
| **Help keywords** | HELP,INFO |
| **Embedded link** | Yes — progress URL in sample message 1 |
| **Embedded phone number** | No |
| **Age-gated content** | No |
| **Direct lending / loan** | No |
| **Affiliate marketing** | No |
| **Number pooling** | No |
| **Subscriber opt-in** | Required — unchecked checkbox + phone |
| **Subscriber opt-out** | STOP keyword |
| **Subscriber help** | HELP keyword |

---

## Why this should pass review

Telnyx rejected prior submissions because the campaign looked like OpenWaitlist was sending SMS **on behalf of third-party restaurants**. The demo-site positioning clarifies:

1. **Sender** = OpenWaitlist (Privoce product demo)
2. **Recipients** = people evaluating the product (often restaurant operators)
3. **Purpose** = sample transactional messages in a demo environment
4. **Production** = each restaurant gets its own 10DLC when they go live

Match the live site, opt-in text, and sample messages exactly before resubmitting.

---

## Inbound SMS webhook (guest replies)

To receive guest replies in the admin **Message** panel, point your Telnyx **Messaging Profile** webhook at:

```
https://app.openwaitlist.privoce.com/api/webhooks/telnyx
```

### Telnyx Mission Control setup

1. Open **Messaging** → your **Messaging Profile** (the one linked to `+16672911966`).
2. Under **Webhooks**, set **Webhook URL** to the URL above.
3. Enable **`message.received`** (inbound SMS).
4. Save. Telnyx will POST inbound texts to the app.

### What the app does

| Guest texts | App behavior |
|-------------|----------------|
| Any reply | Logged as **Guest** in admin chat (matched by phone, or auto-creates a waitlist entry) |
| Unknown number | New **SMS guest ···1234** card appears on the waitlist (inbound only until kiosk opt-in) |
| `STOP` | Opts guest out (`sms_opt_in = 0`); sends unsubscribe confirmation |
| `HELP` | Sends help auto-reply with demo URL |

Guest replies do **not** count toward the demo outbound SMS limits. Staff cannot send new SMS to guests who have opted out.

### Local testing

Use [ngrok](https://ngrok.com) or similar to expose `http://127.0.0.1:3000/api/webhooks/telnyx` and paste that URL into Telnyx temporarily.
