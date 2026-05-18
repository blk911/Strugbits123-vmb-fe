/**
 * In-memory import store for Vite dev middleware.
 *
 * TODO: Replace with database persistence (Postgres / Planetscale / etc.).
 * TODO: Encryption at rest, signed URLs for raw files, retention/deletion policy.
 * Serverless note: do not rely on this Map in production — it resets per cold start.
 */

import { randomUUID } from "node:crypto";

/** @type {Map<string, string>} salonId -> current importRunId */
export const currentImportBySalon = new Map();

/** @type {Map<string, any>} importRunId -> full run state */
export const importRuns = new Map();

export const DEFAULT_SALON_ID = "salon-local-preview";

export function getOrCreateRunState(importRunId) {
  const s = importRuns.get(importRunId);
  if (!s) return null;
  return s;
}

export function appendServerAudit(state, { type, message = "", payload = null }) {
  if (!state.auditEvents) state.auditEvents = [];
  state.auditEvents.push({
    id: `ae-${randomUUID()}`,
    salonId: state.importRun.salonId,
    importRunId: state.importRun.id,
    type,
    message,
    payload,
    createdAt: new Date().toISOString(),
  });
  if (state.auditEvents.length > 200) {
    state.auditEvents = state.auditEvents.slice(-200);
  }
}

export function createRunState(salonId) {
  const id = `ir-${randomUUID()}`;
  const now = new Date().toISOString();
  const state = {
    importRun: {
      id,
      salonId,
      provider: "upload",
      status: "draft",
      createdAt: now,
      updatedAt: now,
      sourceFiles: [],
      normalizedCounts: {},
      qualityScore: null,
      confidenceTier: null,
    },
    rawFiles: [],
    parsedSchemas: [],
    fieldMappings: {},
    normalizedDataset: null,
    repairs: {
      serviceCategoryOverrides: {},
      contactSuppressions: {},
      providerOverrides: {},
    },
    signalsPack: null,
    auditEvents: [],
  };
  importRuns.set(id, state);
  currentImportBySalon.set(salonId, id);
  appendServerAudit(state, { type: "import_created", message: "Import run created", payload: { id } });
  return state;
}

export function touchRun(state) {
  state.importRun.updatedAt = new Date().toISOString();
}

export function deleteCurrentForSalon(salonId) {
  const rid = currentImportBySalon.get(salonId);
  if (rid) {
    const st = importRuns.get(rid);
    if (st) {
      appendServerAudit(st, { type: "cleared", message: "Import cleared for salon", payload: {} });
    }
    importRuns.delete(rid);
  }
  currentImportBySalon.delete(salonId);
}

export function snapshotForClient(state) {
  if (!state) return null;
  const ir = state.importRun;
  return {
    importRun: { ...ir },
    rawFiles: [...state.rawFiles],
    parsedSchemas: [...state.parsedSchemas],
    fieldMappings: { ...state.fieldMappings },
    normalizedDataset: state.normalizedDataset ?
        JSON.parse(JSON.stringify(state.normalizedDataset))
      : null,
    repairs: {
      serviceCategoryOverrides: { ...state.repairs.serviceCategoryOverrides },
      contactSuppressions: { ...state.repairs.contactSuppressions },
      providerOverrides: { ...state.repairs.providerOverrides },
    },
    signalsPack: state.signalsPack ? JSON.parse(JSON.stringify(state.signalsPack)) : null,
    auditEvents: [...(state.auditEvents ?? [])],
  };
}
