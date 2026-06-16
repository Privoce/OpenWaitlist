"use client";

import { CALENDLY_URL } from "@/lib/site";
import { dismissDemoNotice } from "@/lib/demo-limits";

export function DemoSessionNotice({
  visible,
  onDismiss,
}: {
  visible: boolean;
  onDismiss: () => void;
}) {
  if (!visible) return null;

  function handleDismiss() {
    dismissDemoNotice();
    onDismiss();
  }

  return (
    <div className="fixed right-4 top-4 z-[60] w-full max-w-sm rounded-2xl border border-brand-gold/40 bg-white p-4 shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-brand-dark">This is a demo</p>
          <p className="mt-2 text-sm leading-relaxed text-brand-dark/75">
            SMS in this environment is for evaluation only. To deploy OpenWaitlist
            at your restaurant,{" "}
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-primary underline underline-offset-2 hover:text-brand-primary-dark"
            >
              book a meeting
            </a>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 rounded-lg px-2 py-1 text-xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Dismiss notice"
        >
          ×
        </button>
      </div>
    </div>
  );
}
