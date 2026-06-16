"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "openwaitlist:add-to-homescreen-dismissed";

function isIosDevice() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isStandaloneDisplay() {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return (
    nav.standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

export function AddToHomeScreenHint({ compact = false }: { compact?: boolean }) {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!isIosDevice() || isStandaloneDisplay()) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;
    setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  if (compact) {
    return (
      <div className="border-t border-gray-200 bg-white px-4 py-3 text-center">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="text-sm font-medium text-brand-primary underline underline-offset-2"
        >
          Add to Home Screen
        </button>
        {expanded ? (
          <div className="mt-3 text-left text-xs leading-relaxed text-gray-600">
            <InstallSteps />
            <button
              type="button"
              onClick={dismiss}
              className="mt-3 text-gray-400 hover:text-gray-600"
            >
              Dismiss
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="pointer-events-auto absolute bottom-24 left-4 right-4 z-10 mx-auto max-w-md rounded-2xl border border-white/20 bg-black/35 px-4 py-4 text-white backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Use like an app on iPad or iPhone</p>
          <div className="mt-2 text-xs leading-relaxed text-white/85">
            <InstallSteps />
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-lg px-2 py-1 text-lg leading-none text-white/70 hover:bg-white/10 hover:text-white"
          aria-label="Dismiss install instructions"
        >
          ×
        </button>
      </div>
    </div>
  );
}

function InstallSteps() {
  return (
    <ol className="list-decimal space-y-1 pl-4">
      <li>
        Open this page in <strong>Safari</strong> (required on iOS)
      </li>
      <li>
        Tap <strong>Share</strong> <ShareIcon /> at the bottom of the screen
      </li>
      <li>
        Tap <strong>Add to Home Screen</strong>
      </li>
      <li>
        Tap <strong>Add</strong> — OpenWaitlist opens full screen from your home screen
      </li>
    </ol>
  );
}

function ShareIcon() {
  return (
    <svg
      className="mb-0.5 inline h-3.5 w-3.5 align-middle"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M12 3v10" strokeLinecap="round" />
      <path d="m7 8 5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" strokeLinecap="round" />
    </svg>
  );
}
