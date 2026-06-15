import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions — OpenWaitlist Demo",
  description: "Terms and conditions for the OpenWaitlist product demo and sample SMS notifications.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions">
      <section>
        <h2 className="text-xl font-semibold text-brand-dark">Agreement</h2>
        <p className="mt-2">
          By using the OpenWaitlist product demo at app.openwaitlist.privoce.com and
          optionally providing a phone number, you agree to these Terms &amp; Conditions
          and our{" "}
          <a href="/privacy/" className="text-brand-primary hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">Demo service</h2>
        <p className="mt-2">
          This site is a <strong>product demonstration</strong> operated by Privoce for
          restaurant operators evaluating OpenWaitlist. It is not a live restaurant
          waitlist and does not guarantee seating, reservations, or dining service.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">SMS program</h2>
        <p className="mt-2">
          If you opt in, you may receive automated sample text messages from{" "}
          <strong>OpenWaitlist</strong> that demonstrate how guest notifications work in
          the demo. Message frequency varies. Message and data rates may apply. SMS is
          optional and not required to use the demo.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">Opt out and help</h2>
        <p className="mt-2">
          Reply <strong>STOP</strong> to cancel SMS messages. Reply <strong>HELP</strong>{" "}
          for assistance. After opting out, you may still receive a final confirmation
          message.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">Production use</h2>
        <p className="mt-2">
          Restaurants that deploy their own OpenWaitlist instance are responsible for
          operating their waitlist, registering their own 10DLC brand and campaign, and
          complying with applicable messaging laws for their guests.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">No warranty</h2>
        <p className="mt-2">
          OpenWaitlist is provided on an &quot;as is&quot; basis. We do not guarantee
          uninterrupted SMS delivery or exact wait times in the demo environment.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">Limitation of liability</h2>
        <p className="mt-2">
          To the fullest extent permitted by law, Privoce is not liable for indirect,
          incidental, or consequential damages arising from use of the demo or sample SMS
          notifications.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">Changes</h2>
        <p className="mt-2">
          We may update these terms from time to time. Continued use of the demo after
          changes are posted constitutes acceptance of the updated terms.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">Contact</h2>
        <p className="mt-2">
          For questions about these terms, contact Privoce at{" "}
          <a href="mailto:han@privoce.com" className="text-brand-primary hover:underline">
            han@privoce.com
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}
