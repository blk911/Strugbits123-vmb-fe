/** @typedef {"2h" | "24h" | "72h"} CredentialAccessExpiration */

export const CREDENTIAL_ACCESS_EXPIRATIONS = /** @type {const} */ ([
  "2h",
  "24h",
  "72h",
]);

/**
 * @param {string} accessExpiration
 * @returns {Date}
 */
export function getCredentialExpiry(accessExpiration) {
  const ms =
    accessExpiration === "2h" ? 2 * 60 * 60 * 1000
    : accessExpiration === "24h" ? 24 * 60 * 60 * 1000
    : accessExpiration === "72h" ? 72 * 60 * 60 * 1000
    : null;
  if (ms == null) {
    throw new Error(`Invalid accessExpiration: ${accessExpiration}`);
  }
  return new Date(Date.now() + ms);
}

export function createCredentialAssistRequestId() {
  return `cred_${Date.now()}`;
}

/**
 * Server-side validation for credential assist POST bodies.
 * @param {unknown} payload
 * @returns {{ ok: true } | { ok: false; error: string }}
 */
export function validateCredentialAssistPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return { ok: false, error: "Invalid JSON body" };
  }
  const p = /** @type {Record<string, unknown>} */ (payload);
  const {
    providerId,
    providerName,
    loginUrl,
    username,
    password,
    accessExpiration,
    consentExportOnly,
    consentNoAccountChanges,
  } = p;

  if (typeof providerId !== "string" || !providerId.trim()) {
    return { ok: false, error: "providerId is required" };
  }
  if (typeof providerName !== "string" || !providerName.trim()) {
    return { ok: false, error: "providerName is required" };
  }
  if (typeof loginUrl !== "string" || !loginUrl.trim()) {
    return { ok: false, error: "loginUrl is required" };
  }
  if (typeof username !== "string" || !username.trim()) {
    return { ok: false, error: "username is required" };
  }
  if (typeof password !== "string" || !password) {
    return { ok: false, error: "password is required" };
  }
  if (
    accessExpiration !== "2h" &&
    accessExpiration !== "24h" &&
    accessExpiration !== "72h"
  ) {
    return {
      ok: false,
      error: "accessExpiration must be 2h, 24h, or 72h",
    };
  }
  if (consentExportOnly !== true) {
    return { ok: false, error: "consentExportOnly must be true" };
  }
  if (consentNoAccountChanges !== true) {
    return { ok: false, error: "consentNoAccountChanges must be true" };
  }
  return { ok: true };
}

/**
 * UI: whether the temporary access form may be submitted.
 * @param {{
 *   loginUrl: string;
 *   username: string;
 *   password: string;
 *   consentExportOnly: boolean;
 *   consentNoAccountChanges: boolean;
 * }} row
 */
export function canSubmitCredentialAssistForm(row) {
  const loginOk = typeof row.loginUrl === "string" && row.loginUrl.trim() !== "";
  const userOk =
    typeof row.username === "string" && row.username.trim() !== "";
  const passOk =
    typeof row.password === "string" && row.password.length > 0;
  return (
    loginOk &&
    userOk &&
    passOk &&
    row.consentExportOnly === true &&
    row.consentNoAccountChanges === true
  );
}
