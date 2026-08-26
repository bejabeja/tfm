import { useEffect } from "react";

export const useCanonicalUrl = (pathname) => {
  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", `${window.location.origin}${pathname}`);
  }, [pathname]);
};
