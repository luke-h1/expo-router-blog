import { useEffect } from "react";

/**
 * Web-specific hook to preload critical images for better LCP
 * This creates link rel="preload" elements for priority images
 */
export function usePreloadImages(imageUrls: string[]) {
  useEffect(() => {
    if (typeof document === "undefined" || !imageUrls.length) return;

    const preloadLinks: HTMLLinkElement[] = [];

    imageUrls.forEach((url) => {
      if (!url) return;

      // Check if preload link already exists
      const existingLink = document.querySelector(
        `link[rel="preload"][href="${url}"]`
      );
      if (existingLink) return;

      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = url;
      // Add fetchpriority for modern browsers
      link.setAttribute("fetchpriority", "high");

      document.head.appendChild(link);
      preloadLinks.push(link);
    });

    // Cleanup preload links when component unmounts
    return () => {
      preloadLinks.forEach((link) => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, [imageUrls]);
}
