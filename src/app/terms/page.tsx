import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions — OpenWaitlist",
  description: "Terms and conditions for OpenWaitlist SMS waitlist notifications.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions">
      <section>
        <h2 className="text-xl font-semibold text-brand-dark">Agreement</h2>
        <p className="mt-2">
          By joining a waitlist that uses OpenWaitlist and providing a phone
          number, you agree to these Terms &amp; Conditions and our{" "}
          <a href="/privacy/" className="text-brand-primary hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">Service description</h2>
        <p className="mt-2">
          OpenWaitlist helps restaurants manage guest waitlists. The service may
          send transactional SMS messages about queue status and table
          availability. OpenWaitlist is provided by Privoce and may be operated
          by an individual restaurant location.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">SMS program</h2>
        <p className="mt-2">
          When you provide your mobile number, you consent to receive automated
          transactional text messages related to your waitlist entry. Message
          frequency varies. Message and data rates may apply. Consent is not a
          condition of purchase or dining.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">Opt out and help</h2>
        <p className="mt-2">
          Reply <strong>STOP</strong> to cancel SMS messages. Reply <strong>HELP</strong>{" "}
          for assistance. After opting out, you may still receive a final
          confirmation message.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">No warranty</h2>
        <p className="mt-2">
          OpenWaitlist is provided on an &quot;as is&quot; basis. We do not guarantee
          uninterrupted SMS delivery or exact wait times. Restaurants are
          responsible for seating guests and managing their queue.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">Limitation of liability</h2>
        <p className="mt-2">
          To the fullest extent permitted by law, Privoce and participating
          restaurants are not liable for indirect, incidental, or consequential
          damages arising from use of the waitlist or SMS notifications.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">Changes</h2>
        <p className="mt-2">
          We may update these terms from time to time. Continued use of the
          waitlist service after changes are posted constitutes acceptance of the
          updated terms.
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
