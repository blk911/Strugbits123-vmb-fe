import { writeImportAuditFromServerEvents } from "./importAudit.js";
import {
  LS_IMPORT_RUN_ID,
  LS_MAPPING,
  LS_NORMALIZED,
  LS_PARSED,
  LS_PROVIDER_OVERRIDES,
  LS_RAW_META,
  LS_SERVICE_CATEGORY_OVERRIDES,
  LS_CONTACT_SUPPRESSION,
  LS_SIGNALS,
  notifyDeepInsightsDatasetChanged,
  writeJson,
} from "./storageKeys.js";

/**
 * Maps GET /api/deep-insights/imports/current (or single-run) payload into localStorage mirror.
 * @param {any} snapshot
 */
export function mirrorDeepInsightsServerSnapshot(snapshot) {
  if (!snapshot?.importRun) return;

  writeJson(LS_IMPORT_RUN_ID, snapshot.importRun.id);

  if (snapshot.normalizedDataset != null) {
    writeJson(LS_NORMALIZED, snapshot.normalizedDataset);
  }

  if (snapshot.signalsPack != null) {
    writeJson(LS_SIGNALS, snapshot.signalsPack);
  }

  if (snapshot.fieldMappings && typeof snapshot.fieldMappings === "object") {
    writeJson(LS_MAPPING, snapshot.fieldMappings);
  }

  if (snapshot.repairs) {
    writeJson(
      LS_SERVICE_CATEGORY_OVERRIDES,
      snapshot.repairs.serviceCategoryOverrides ?? {},
    );
    writeJson(LS_CONTACT_SUPPRESSION, snapshot.repairs.contactSuppressions ?? {});
    writeJson(LS_PROVIDER_OVERRIDES, snapshot.repairs.providerOverrides ?? {});
  }

  const rawFiles = snapshot.rawFiles ?? [];
  const ir = snapshot.importRun;
  writeJson(LS_RAW_META, {
    files: rawFiles.map((f) => ({
      id: f.id,
      name: f.fileName,
      kind: f.fileType === "pdf" ? "pdf" : "csv",
      status: f.parseStatus ?? "parsed",
      size: f.size ?? 0,
    })),
    at: ir.updatedAt || ir.createdAt,
  });

  const parsedArr = snapshot.parsedSchemas ?? [];
  writeJson(
    LS_PARSED,
    parsedArr.map((p) => ({
      fileId: p.fileId,
      fileName: p.fileName,
      rowCount: p.rowCount,
      columnCount: p.columnCount,
      provider: p.detectedProvider,
      reportType: p.detectedReportType,
    })),
  );

  if (Array.isArray(snapshot.auditEvents)) {
    writeImportAuditFromServerEvents(snapshot.auditEvents);
  }

  notifyDeepInsightsDatasetChanged();
}
