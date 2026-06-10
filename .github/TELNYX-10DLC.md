# Telnyx 10DLC resubmission notes

## Opt-in workflow (paste into campaign)

```
Guests join the waitlist on an in-restaurant OpenWaitlist kiosk tablet.

1. Guest enters name (required) and party size (required).
2. Phone number is optional and only used if the guest opts in to SMS.
3. Guest sees an unchecked optional checkbox with this exact language next to the phone field:

"I agree to receive automated waitlist text messages from [Restaurant Name] at the phone number above. Message frequency varies. Message and data rates may apply. Consent is not required to dine. Reply STOP to cancel. Reply HELP for help."

Privacy Policy: https://app.openwaitlist.privoce.com/privacy/
Terms: https://app.openwaitlist.privoce.com/terms/

4. Guest must check the box AND enter a phone number to receive SMS.
5. Guest may join the waitlist without checking the box and without providing a phone number.

Live opt-in form: https://app.openwaitlist.privoce.com/kiosk/add/
```

Upload a screenshot of the kiosk form showing the optional phone field, unchecked SMS checkbox, and consent language.

## Perceived sender

OpenWaitlist is a platform. Each restaurant configures its own `restaurant_name` in settings (default: "My Restaurant"). SMS messages are sent **on behalf of that restaurant**, e.g.:

`My Restaurant: You've been added to the My Restaurant waitlist...`

For a production restaurant deployment, that location's legal business name should be set in admin settings and registered as its own 10DLC brand/campaign if required by the carrier.

## Sample messages

**Message 1 (join confirmation):**
```
My Restaurant: You've been added to the My Restaurant waitlist. Your number is SE01. Check your place in line here: https://app.openwaitlist.privoce.com/p/waitlist/aBc12XyZ9k/ Reply HELP for help. Reply STOP to cancel.
```

**Message 2 (table ready):**
```
My Restaurant: Hi Jane, it's your turn now! Please show the number SE01 to the host when you have arrived. Reply HELP for help. Reply STOP to cancel.
```

## Keywords (no spaces after commas)

- Opt in: `START,YES`
- Opt out: `STOP,UNSUBSCRIBE,CANCEL,END,QUIT`
- Help: `HELP,INFO`

## Compliance links

- Privacy: https://app.openwaitlist.privoce.com/privacy/
- Terms: https://app.openwaitlist.privoce.com/terms/
