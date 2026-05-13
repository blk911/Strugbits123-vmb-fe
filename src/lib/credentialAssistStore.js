/**
 * Credential assist persistence abstraction.
 * Swappable for encrypted DB columns, HashiCorp Vault, AWS Secrets Manager, etc.
 *
 * TODO: When CREDENTIAL_ASSIST_STORE_MODE !== "memory", load driver from env and
 *       delegate create/get/mark/expire to durable storage with envelope encryption.
 * TODO: Use CREDENTIAL_ASSIST_SECRET_KEY (or KMS key id) to encrypt passwords;
 *       store only ciphertext + IV metadata on the record; never plaintext.
 * TODO: Scheduled TTL sweep: read CREDENTIAL_ASSIST_TTL_SWEEP_MINUTES and expire stale rows.
 */
import {
  createCredentialAssistRequestId,
  getCredentialExpiry,
} from "./credentialAssist.js";

/** @typedef {"active" | "accessed" | "expired"} CredentialAssistStatus */

/**
 * @typedef {object} CredentialAssistRecord
 * @property {string} requestId
 * @property {string} providerId
 * @property {string} providerName
 * @property {string} loginUrl
 * @property {string} username
 * @property {string} encryptedPasswordPlaceholder
 * @property {string} mfaNotes
 * @property {string} permissionNotes
 * @property {"2h" | "24h" | "72h"} accessExpiration
 * @property {string} expiresAt ISO
 * @property {boolean} consentExportOnly
 * @property {boolean} consentNoAccountChanges
 * @property {string} requestedAt ISO
 * @property {CredentialAssistStatus} status
 * @property {string | null} accessedAt
 * @property {string | null} accessedBy
 */

/** Dev / local-only backend map. Replace with vault/DB implementation. */
const credentialAssistStore = new Map();

export const CREDENTIAL_ASSIST_STORE_MODE =
  (typeof process !== "undefined" && process.env.CREDENTIAL_ASSIST_STORE_MODE) ||
  "memory";

const DEV_PASSWORD_PLACEHOLDER = "DEV_PLACEHOLDER_PASSWORD_NOT_STORED";

/**
 * @param {object} payload validated credential assist body (includes password — do not persist plaintext)
 * @returns {CredentialAssistRecord}
 */
export function createCredentialAssistRecord(payload) {
  if (CREDENTIAL_ASSIST_STORE_MODE !== "memory") {
    // TODO: branch to SQL / DynamoDB / Secrets Manager writers.
    throw new Error(
      `CREDENTIAL_ASSIST_STORE_MODE "${CREDENTIAL_ASSIST_STORE_MODE}" is not implemented yet; use "memory".`,
    );
  }

  const requestId = createCredentialAssistRequestId();
  const expiresAt = getCredentialExpiry(
    /** @type {"2h" | "24h" | "72h"} */ (payload.accessExpiration),
  ).toISOString();

  // TODO: ciphertext = encrypt(payload.password, CREDENTIAL_ASSIST_SECRET_KEY); store ciphertext.
  void payload.password;

  /** @type {CredentialAssistRecord} */
  const record = {
    requestId,
    providerId: String(payload.providerId).trim(),
    providerName: String(payload.providerName).trim(),
    loginUrl: String(payload.loginUrl).trim(),
    username: String(payload.username).trim(),
    encryptedPasswordPlaceholder: DEV_PASSWORD_PLACEHOLDER,
    mfaNotes:
      typeof payload.mfaNotes === "string" ? payload.mfaNotes : "",
    permissionNotes:
      typeof payload.permissionNotes === "string" ?
        payload.permissionNotes
      : "",
    accessExpiration: payload.accessExpiration,
    expiresAt,
    consentExportOnly: payload.consentExportOnly === true,
    consentNoAccountChanges: payload.consentNoAccountChanges === true,
    requestedAt:
      typeof payload.requestedAt === "string" ?
        payload.requestedAt
      : new Date().toISOString(),
    status: "active",
    accessedAt: null,
    accessedBy: null,
  };

  credentialAssistStore.set(requestId, record);
  return record;
}

/**
 * @param {string} requestId
 * @returns {CredentialAssistRecord | undefined}
 */
export function getCredentialAssistRecord(requestId) {
  if (CREDENTIAL_ASSIST_STORE_MODE !== "memory") {
    // TODO: fetch from primary store by id
    return undefined;
  }
  return credentialAssistStore.get(requestId);
}

/**
 * Remove secret-adjacent fields before sending JSON to clients.
 * @param {CredentialAssistRecord | null | undefined} record
 * @returns {Omit<CredentialAssistRecord, "encryptedPasswordPlaceholder"> | null}
 */
export function sanitizeCredentialAssistRecord(record) {
  if (!record) return null;
  const { encryptedPasswordPlaceholder: _, ...rest } = record;
  return rest;
}

/**
 * @param {string} requestId
 * @returns {Omit<CredentialAssistRecord, "encryptedPasswordPlaceholder"> | null}
 */
export function getCredentialAssistRecordPublic(requestId) {
  return sanitizeCredentialAssistRecord(getCredentialAssistRecord(requestId));
}

/**
 * All records without password material, newest first (by requestedAt).
 * @returns {Array<Omit<CredentialAssistRecord, "encryptedPasswordPlaceholder">>}
 */
export function listCredentialAssistRecords() {
  if (CREDENTIAL_ASSIST_STORE_MODE !== "memory") {
    // TODO: query durable store with pagination + role filter
    return [];
  }
  const rows = [...credentialAssistStore.values()]
    .map((r) => sanitizeCredentialAssistRecord(r))
    .filter(Boolean);
  return rows.sort((a, b) => {
    const ta = Date.parse(a.requestedAt) || 0;
    const tb = Date.parse(b.requestedAt) || 0;
    return tb - ta;
  });
}

/**
 * @param {string} requestId
 * @param {string} adminUserId
 * @returns {Omit<CredentialAssistRecord, "encryptedPasswordPlaceholder"> | null}
 *          Null if not found or if record is expired (cannot be marked).
 */
export function markCredentialAssistRecordAccessed(requestId, adminUserId) {
  if (CREDENTIAL_ASSIST_STORE_MODE !== "memory") {
    // TODO: update durable row + write audit log
    return null;
  }
  const row = credentialAssistStore.get(requestId);
  if (!row) return null;
  if (row.status === "expired") return null;
  if (row.status === "active") {
    row.status = "accessed";
    row.accessedAt = new Date().toISOString();
    row.accessedBy = String(adminUserId);
    credentialAssistStore.set(requestId, row);
  }
  // TODO: append audit event { requestId, adminUserId, at: row.accessedAt }
  return sanitizeCredentialAssistRecord(row);
}

/**
 * @param {string} requestId
 * @returns {boolean}
 */
export function expireCredentialAssistRecord(requestId) {
  if (CREDENTIAL_ASSIST_STORE_MODE !== "memory") {
    // TODO: update status in DB / delete secret version
    return false;
  }
  const row = credentialAssistStore.get(requestId);
  if (!row) return false;
  row.status = "expired";
  credentialAssistStore.set(requestId, row);
  return true;
}
