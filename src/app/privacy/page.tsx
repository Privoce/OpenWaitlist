import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — OpenWaitlist",
  description: "Privacy policy for OpenWaitlist SMS waitlist notifications.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <section>
        <h2 className="text-xl font-semibold text-brand-dark">Overview</h2>
        <p className="mt-2">
          OpenWaitlist is open-source waitlist software provided by Privoce. This
          policy describes how information is handled when guests join a restaurant
          waitlist and receive SMS notifications.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">Information we collect</h2>
        <p className="mt-2">
          When a guest joins a waitlist at a participating location, they may
          provide their name, phone number, and party size. This information is
          collected only at the guest&apos;s direction on the in-restaurant kiosk
          or by staff on their behalf.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">How we use information</h2>
        <p className="mt-2">
          Phone numbers are used solely to send transactional SMS messages related
          to the waitlist, such as queue confirmation and table-ready
          notifications. We do not use this information for marketing, advertising,
          or unrelated purposes.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">Data storage</h2>
        <p className="mt-2">
          We do not store guest personal information for marketing or long-term
          retention. Waitlist details exist only as long as needed to manage the
          active queue at the restaurant. Privoce does not sell, rent, or share
          guest personal information with third parties for their own purposes.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">SMS consent</h2>
        <p className="mt-2">
          By entering a phone number on the waitlist kiosk, the guest consents to
          receive transactional SMS messages about their waitlist status. Message
          frequency varies. Message and data rates may apply.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">Opt out</h2>
        <p className="mt-2">
          Guests may opt out of SMS messages at any time by replying{" "}
          <strong>STOP</strong> to a message. For help, reply <strong>HELP</strong>{" "}
          or contact the restaurant host.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">Contact</h2>
        <p className="mt-2">
          Questions about this policy may be directed to Privoce at{" "}
          <a href="mailto:han@privoce.com" className="text-brand-primary hover:underline">
            han@privoce.com
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}
