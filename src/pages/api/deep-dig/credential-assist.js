/**
 * Data Mine credential assist API (Vite dev / preview middleware).
 *
 * TODO: Mount equivalent routes on production app server with vault-backed store.
 * TODO: Rate limit POST; authenticate admin for GET/PATCH endpoints.
 */
import { validateCredentialAssistPayload } from "../../../lib/credentialAssist.js";
import {
  createCredentialAssistRecord,
  getCredentialAssistRecord,
  getCredentialAssistRecordPublic,
  listCredentialAssistRecords,
  markCredentialAssistRecordAccessed,
} from "../../../lib/credentialAssistStore.js";

/**
 * @param {import("node:http").IncomingMessage} req
 * @param {import("node:http").ServerResponse} res
 * @param {() => void} next
 */
export function credentialAssistApiMiddleware(req, res, next) {
  const pathname = req.url?.split("?")[0] ?? "";
  if (pathname !== "/api/deep-dig/credential-assist") {
    next();
    return;
  }
  void handleCredentialAssistApi(req, res);
}

/**
 * @param {import("node:http").IncomingMessage} req
 * @param {import("node:http").ServerResponse} res
 */
async function handleCredentialAssistApi(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, OPTIONS",
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.end();
    return;
  }

  if (req.method === "GET") {
    await handleCredentialAssistGet(req, res);
    return;
  }
  if (req.method === "POST") {
    await handleCredentialAssistPost(req, res);
    return;
  }
  if (req.method === "PATCH") {
    await handleCredentialAssistPatch(req, res);
    return;
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ error: "Method not allowed" }));
}

async function handleCredentialAssistGet(req, res) {
  if (process.env.CREDENTIAL_ASSIST_ALLOW_DEV_GET === "0") {
    res.statusCode = 403;
    res.end(JSON.stringify({ error: "GET disabled" }));
    return;
  }

  let requestId = "";
  try {
    const url = new URL(req.url || "/", "http://credential-assist.local");
    requestId = url.searchParams.get("requestId")?.trim() ?? "";
  } catch {
    requestId = "";
  }

  if (!requestId) {
    const records = listCredentialAssistRecords();
    res.statusCode = 200;
    res.end(JSON.stringify({ ok: true, records }));
    return;
  }

  const record = getCredentialAssistRecordPublic(requestId);
  if (!record) {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  res.statusCode = 200;
  res.end(JSON.stringify({ ok: true, record }));
}

/**
 * @param {import("node:http").IncomingMessage} req
 * @param {import("node:http").ServerResponse} res
 */
async function handleCredentialAssistPatch(req, res) {
  let raw = "";
  try {
    raw = await readRequestBody(req);
  } catch {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Could not read body" }));
    return;
  }

  let body;
  try {
    body = JSON.parse(raw || "{}");
  } catch {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Invalid JSON" }));
    return;
  }

  const requestId =
    typeof body.requestId === "string" ? body.requestId.trim() : "";
  const action = typeof body.action === "string" ? body.action.trim() : "";
  const adminUserId =
    typeof body.adminUserId === "string" ? body.adminUserId.trim() : "";

  if (!requestId || action !== "mark_accessed" || !adminUserId) {
    res.statusCode = 400;
    res.end(
      JSON.stringify({
        error:
          "requestId, action: \"mark_accessed\", and adminUserId are required",
      }),
    );
    return;
  }

  const internal = getCredentialAssistRecord(requestId);
  if (!internal) {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }
  if (internal.status === "expired") {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Cannot mark expired request" }));
    return;
  }

  const record = markCredentialAssistRecordAccessed(requestId, adminUserId);
  if (!record) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Could not update record" }));
    return;
  }

  res.statusCode = 200;
  res.end(JSON.stringify({ ok: true, record }));
}

/**
 * @param {import("node:http").IncomingMessage} req
 * @param {import("node:http").ServerResponse} res
 */
export async function handleCredentialAssistPost(req, res) {
  let raw = "";
  try {
    raw = await readRequestBody(req);
  } catch {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Could not read body" }));
    return;
  }

  let payload;
  try {
    payload = JSON.parse(raw || "{}");
  } catch {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Invalid JSON" }));
    return;
  }

  const validated = validateCredentialAssistPayload(payload);
  if (!validated.ok) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: validated.error }));
    return;
  }

  let record;
  try {
    record = createCredentialAssistRecord(payload);
  } catch (err) {
    res.statusCode = 500;
    res.end(
      JSON.stringify({
        error:
          err instanceof Error ? err.message : "Could not create credential record",
      }),
    );
    return;
  }

  res.statusCode = 200;
  res.end(
    JSON.stringify({
      ok: true,
      requestId: record.requestId,
      expiresAt: record.expiresAt,
      status: record.status,
    }),
  );
}

/**
 * @param {import("node:http").IncomingMessage} req
 * @returns {Promise<string>}
 */
function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    /** @type {Buffer[]} */
    const chunks = [];
    req.on("data", (chunk) => {
      chunks.push(chunk);
    });
    req.on("end", () => {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });
    req.on("error", reject);
  });
}
