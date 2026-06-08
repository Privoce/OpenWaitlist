import Link from "next/link";
import { OpenWaitlistLogo } from "@/components/OpenWaitlistLogo";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-brand-gold-light/30 flex flex-col items-center justify-center p-8">
      <OpenWaitlistLogo className="text-3xl mb-2" />
      <p className="text-gray-500 mb-12">Restaurant waitlist management</p>

      <div className="grid sm:grid-cols-2 gap-6 w-full max-w-lg">
        <Link
          href="/kiosk"
          className="group rounded-2xl bg-brand-primary p-8 text-white shadow-lg hover:shadow-xl transition-shadow text-center"
        >
          <div className="text-4xl mb-4">📱</div>
          <h2 className="text-xl font-semibold mb-2">Customer Kiosk</h2>
          <p className="text-white/80 text-sm">
            Guest-facing screen for joining the waitlist
          </p>
        </Link>

        <Link
          href="/admin/waitlist"
          className="group rounded-2xl bg-white border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow text-center"
        >
          <div className="text-4xl mb-4">🍽️</div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">Staff Admin</h2>
          <p className="text-gray-500 text-sm">
            Manage waitlist, notify guests, and seat parties
          </p>
        </Link>
      </div>
    </main>
  );
}
