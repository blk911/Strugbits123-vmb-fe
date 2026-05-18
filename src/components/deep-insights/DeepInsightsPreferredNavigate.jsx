import { Navigate } from "react-router-dom";
import { deepInsightsPreferredPath } from "../../lib/deep-insights/storageKeys.js";

/** Redirect for generic Deep Insights / tAIkOS entry routes (not explicit sub-routes). */
export default function DeepInsightsPreferredNavigate() {
  return <Navigate to={deepInsightsPreferredPath()} replace />;
}
