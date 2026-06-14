# Telnyx 10DLC resubmission notes

## Opt-in workflow (paste into campaign)

```
Guests join the waitlist on an in-restaurant OpenWaitlist kiosk tablet.

1. Guest enters name (required) and party size (required).
2. Phone number is optional and only used if the guest opts in to SMS.
3. Guest sees an unchecked optional checkbox with this exact language next to the phone field:

"I agree to receive automated waitlist text messages from OpenWaitlist at the phone number above. Message frequency varies. Message and data rates may apply. Consent is not required to dine. Reply STOP to cancel. Reply HELP for help."

Privacy Policy: https://app.openwaitlist.privoce.com/privacy/
Terms: https://app.openwaitlist.privoce.com/terms/

4. Guest must check the box AND enter a phone number to receive SMS.
5. Guest may join the waitlist without checking the box and without providing a phone number.

Live opt-in form: https://app.openwaitlist.privoce.com/kiosk/add/
```

Upload a screenshot of the kiosk form showing the optional phone field, unchecked SMS checkbox, and consent language.

## Perceived sender

All SMS messages are sent from **OpenWaitlist** as the sole sender identity. Message prefix:

`OpenWaitlist: You've been added to the waitlist...`

The kiosk UI, guest progress pages, and SMS copy all display **OpenWaitlist** — not a per-location restaurant name.

## Sample messages

**Message 1 (join confirmation):**
```
OpenWaitlist: You've been added to the waitlist. Your number is SE01. Check your place in line here: https://app.openwaitlist.privoce.com/p/waitlist/aBc12XyZ9k/ Reply HELP for help. Reply STOP to cancel.
```

**Message 2 (table ready):**
```
OpenWaitlist: Hi Jane, it's your turn now! Please show the number SE01 to the host when you have arrived. Reply HELP for help. Reply STOP to cancel.
```

## Keywords (no spaces after commas)

- Opt in: `START,YES`
- Opt out: `STOP,UNSUBSCRIBE,CANCEL,END,QUIT`
- Help: `HELP,INFO`

## Compliance links

- Privacy: https://app.openwaitlist.privoce.com/privacy/
- Terms: https://app.openwaitlist.privoce.com/terms/
