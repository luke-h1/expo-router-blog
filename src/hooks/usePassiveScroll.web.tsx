import { useEffect } from "react";

/**
 * Hook to add passive event listeners for better scroll performance on web
 */
export function usePassiveScroll() {
  useEffect(() => {
    // Add passive event listeners to improve scroll performance
    let supportsPassive = false;

    try {
      const options = Object.defineProperty({}, "passive", {
        get: function () {
          supportsPassive = true;
          return false;
        },
      });

      const noop = () => {};
      window.addEventListener("testPassive" as any, noop, options);
      window.removeEventListener("testPassive" as any, noop, options);
    } catch {
      supportsPassive = false;
    }

    if (supportsPassive && typeof window !== "undefined") {
      // Override addEventListener for touch and wheel events
      const originalAddEventListener = EventTarget.prototype.addEventListener;

      EventTarget.prototype.addEventListener = function (
        type: string,
        listener: any,
        options?: any
      ) {
        const passiveEvents = [
          "touchstart",
          "touchmove",
          "wheel",
          "mousewheel",
        ];

        if (passiveEvents.includes(type)) {
          if (typeof options === "object" && options.passive === undefined) {
            options = { ...options, passive: true };
          } else if (
            typeof options === "undefined" ||
            typeof options === "boolean"
          ) {
            options = { passive: true, capture: options || false };
          }
        }

        return originalAddEventListener.call(this, type, listener, options);
      };
    }
  }, []);
}
