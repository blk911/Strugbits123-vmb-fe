import { useEffect, useReducer } from "react";
import { DEEP_INSIGHTS_DATASET_EVENT } from "../lib/deep-insights/storageKeys.js";
import { hydrateDeepInsightsFromApi } from "../lib/deep-insights/deepInsightsApi.js";

/** Hydrate from API on mount; re-render when mirrored import data updates. */
export function useDeepInsightsHydration() {
  const [, bump] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await hydrateDeepInsightsFromApi();
      if (!cancelled) bump();
    })();
    const on = () => bump();
    window.addEventListener(DEEP_INSIGHTS_DATASET_EVENT, on);
    return () => {
      cancelled = true;
      window.removeEventListener(DEEP_INSIGHTS_DATASET_EVENT, on);
    };
  }, []);
}
