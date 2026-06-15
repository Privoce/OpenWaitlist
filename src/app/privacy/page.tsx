import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — OpenWaitlist Demo",
  description: "Privacy policy for the OpenWaitlist product demo and sample SMS notifications.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <section>
        <h2 className="text-xl font-semibold text-brand-dark">Overview</h2>
        <p className="mt-2">
          OpenWaitlist is open-source waitlist software provided by Privoce. The site at{" "}
          <strong>app.openwaitlist.privoce.com</strong> is a <strong>live product demo</strong>{" "}
          for restaurant operators evaluating the software. It is not a live restaurant
          waitlist serving paying guests.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">Information we collect</h2>
        <p className="mt-2">
          Demo participants may enter a sample name, optional phone number, and party size
          on the demo kiosk to try the product. This information is collected only at the
          participant&apos;s direction for evaluation purposes.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">How we use information</h2>
        <p className="mt-2">
          If a demo participant opts in, their phone number is used solely to send sample
          transactional SMS messages that demonstrate how OpenWaitlist works — such as
          queue confirmation and table-ready notifications in the demo flow. We do not use
          this information for marketing, advertising, or unrelated purposes.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">Data storage</h2>
        <p className="mt-2">
          Demo waitlist entries are temporary and exist only to support the product
          evaluation experience. Privoce does not sell, rent, or share demo participant
          personal information with third parties for their own purposes.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">SMS consent</h2>
        <p className="mt-2">
          SMS is optional in the demo. Participants must check an unchecked opt-in box and
          enter a phone number to receive sample messages. Message frequency varies. Message
          and data rates may apply.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">Production deployments</h2>
        <p className="mt-2">
          When a restaurant deploys its own OpenWaitlist instance, that location is responsible
          for its own guest privacy practices and 10DLC registration. This policy applies
          to the public demo operated by Privoce at app.openwaitlist.privoce.com.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-dark">Opt out</h2>
        <p className="mt-2">
          Demo participants may opt out of SMS at any time by replying{" "}
          <strong>STOP</strong> to a message. For help, reply <strong>HELP</strong> or
          contact Privoce.
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
