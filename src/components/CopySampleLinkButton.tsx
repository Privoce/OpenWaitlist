"use client";

import { useState } from "react";

export function CopySampleLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="rounded-full border border-brand-dark/15 bg-white px-6 py-2.5 text-sm font-semibold text-brand-dark hover:bg-brand-gold-light/30 transition-colors"
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}
