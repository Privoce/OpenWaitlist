"use client";

import { useEffect, useRef } from "react";

export function useInactivityTimeout(
  onTimeout: () => void,
  timeoutMs: number,
  enabled = true,
) {
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  useEffect(() => {
    if (!enabled) return;

    let timer = setTimeout(() => onTimeoutRef.current(), timeoutMs);

    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => onTimeoutRef.current(), timeoutMs);
    };

    const events = ["mousedown", "touchstart", "keydown", "click"] as const;
    events.forEach((event) => window.addEventListener(event, reset));

    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, reset));
    };
  }, [timeoutMs, enabled]);
}
