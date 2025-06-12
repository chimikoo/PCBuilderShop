// Utility hook to read ?type=... from the query string on first render (client-side)
import { useEffect } from "react";

export function useInitialCategoryFromQuery(setSelectedTypes: (types: string[]) => void) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const type = params.get("type");
      if (type) {
        setSelectedTypes([type]);
      }
    }
    // Only run on mount
    // eslint-disable-next-line
  }, []);
}
