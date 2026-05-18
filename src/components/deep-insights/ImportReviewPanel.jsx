import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { classifyService } from "../../lib/deep-insights/classifyService.js";
import { getImportQualityReport } from "../../lib/deep-insights/importQuality.js";
import {
  PROVIDER_IGNORE_SENTINEL,
  SERVICE_REVIEW_CATEGORIES,
  effectiveServiceCategory,
  isAppointmentProviderIgnored,
  readContactSuppression,
  readProviderOverrides,
  readServiceCategoryOverrides,
  refreshDeepInsightsAfterRepairs,
  setContactSuppressed,
  setProviderOverride,
  setServiceCategoryOverride,
} from "../../lib/deep-insights/importRepairStorage.js";
import {
  DEEP_INSIGHTS_DATASET_EVENT,
  hasImportedDataset,
  readJson,
  shouldShowImportReviewPanel,
  LS_NORMALIZED,
  LS_PARSED,
} from "../../lib/deep-insights/storageKeys.js";

function trimStr(v) {
  return String(v ?? "").trim();
}

function tierLabel(confidence) {
  if (confidence === "high") return "High";
  if (confidence === "medium") return "Medium";
  return "Low";
}

const tableWrap = "mt-2 max-h-48 overflow-auto rounded-lg border border-vmb-border-light";
const thCls =
  "sticky top-0 bg-vmb-bg-soft/80 px-2 py-1.5 text-left text-[9px] font-bold uppercase tracking-wide text-vmb-text-muted backdrop-blur-sm";
const tdCls = "border-t border-vmb-border-light/60 px-2 py-1.5 text-[11px] text-vmb-text-dark";

function scrollToId(id) {
  try {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch {
    /* */
  }
}

export default function ImportReviewPanel() {
  const [, bump] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const onUpd = () => bump();
    window.addEventListener(DEEP_INSIGHTS_DATASET_EVENT, onUpd);
    return () => window.removeEventListener(DEEP_INSIGHTS_DATASET_EVENT, onUpd);
  }, []);

  useEffect(() => {
    if (window.location.hash === "#import-review") {
      const t = window.setTimeout(() => scrollToId("import-review"), 120);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [bump]);

  const visible = shouldShowImportReviewPanel();
  const normalized = useMemo(
    () => (hasImportedDataset() ? readJson(LS_NORMALIZED, null) : null),
    [bump],
  );

  const report = useMemo(() => {
    if (!hasImportedDataset()) return null;
    return getImportQualityReport();
  }, [bump]);

  const parsedRowCount = useMemo(() => {
    const p = readJson(LS_PARSED, null);
    return Array.isArray(p) ? p.length : 0;
  }, [bump]);

  const serviceNamesUnclassified = useMemo(() => {
    if (!normalized) return [];
    const catOv = readServiceCategoryOverrides();
    const names = new Set();
    for (const t of normalized.transactions ?? []) {
      if (trimStr(t.service_name)) names.add(trimStr(t.service_name));
      if (trimStr(t.product_name)) names.add(trimStr(t.product_name));
      if (trimStr(t.custom_item_name)) names.add(trimStr(t.custom_item_name));
    }
    for (const a of normalized.appointments ?? []) {
      if (trimStr(a.service_name)) names.add(trimStr(a.service_name));
    }
    for (const s of normalized.services ?? []) {
      if (trimStr(s.service_name)) names.add(trimStr(s.service_name));
    }
    for (const pr of normalized.products ?? []) {
      if (trimStr(pr.product_name)) names.add(trimStr(pr.product_name));
    }
    return [...names].filter((n) => effectiveServiceCategory(n, catOv) === "other").sort();
  }, [normalized, bump]);

  const missingContactRows = useMemo(() => {
    if (!normalized) return [];
    return (normalized.clients ?? []).filter((c) => !trimStr(c.email) || !trimStr(c.phone));
  }, [normalized]);

  const missingProviderRows = useMemo(() => {
    if (!normalized) return [];
    const provOv = readProviderOverrides();
    return (normalized.appointments ?? []).filter((a) => {
      const aid = trimStr(a.appointment_id);
      if (isAppointmentProviderIgnored(aid, provOv)) return false;
      if (provOv[aid] && provOv[aid] !== PROVIDER_IGNORE_SENTINEL) return false;
      return !trimStr(a.provider_name);
    });
  }, [normalized, bump]);

  const providerOptions = useMemo(() => {
    if (!normalized) return [];
    const set = new Set();
    for (const p of normalized.providers ?? []) {
      if (trimStr(p.provider_name)) set.add(trimStr(p.provider_name));
    }
    for (const a of normalized.appointments ?? []) {
      if (trimStr(a.provider_name)) set.add(trimStr(a.provider_name));
    }
    for (const t of normalized.transactions ?? []) {
      if (trimStr(t.provider_name)) set.add(trimStr(t.provider_name));
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [normalized]);

  const suppression = useMemo(() => readContactSuppression(), [bump]);

  const onRecalc = useCallback(() => {
    refreshDeepInsightsAfterRepairs();
    bump();
  }, []);

  const warnScroll = (action) => {
    const map = {
      "Review Services": "import-review-services",
      "Review Contacts": "import-review-contacts",
      "Review Providers": "import-review-providers",
      "Review Transactions": "import-review-transactions",
    };
    scrollToId(map[action] ?? "import-review");
  };

  if (!visible) return null;

  const chipCls =
    "rounded-md border border-vmb-border-light bg-vmb-bg-soft/35 px-2 py-1 text-[10px] text-vmb-text-dark";

  return (
    <section
      id="import-review"
      className="mt-6 rounded-xl border border-vmb-border-light bg-white p-4 shadow-sm ring-1 ring-vmb-border-light/30 sm:p-4"
      aria-labelledby="import-review-heading"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2
            id="import-review-heading"
            className="text-sm font-semibold text-vmb-text-dark"
          >
            Review Mapping
          </h2>
          <p className="mt-0.5 text-[11px] text-vmb-text-muted">
            Fix low-confidence fields before campaign recommendations run.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onRecalc}
            className="rounded-lg border border-vmb-border-light bg-vmb-bg-soft/50 px-2.5 py-1.5 text-[10px] font-semibold text-vmb-text-dark hover:bg-vmb-bg-soft"
          >
            Recalculate Import Quality
          </button>
          <Link
            to="/salon-owner/deep-insights/analytics"
            className="inline-flex items-center justify-center rounded-lg border border-vmb-secondary/35 bg-vmb-secondary/10 px-2.5 py-1.5 text-[10px] font-semibold text-vmb-secondary hover:bg-vmb-secondary/15"
          >
            Open Analytics
          </Link>
        </div>
      </div>

      {!normalized ?
        <div className="mt-4 rounded-lg border border-dashed border-vmb-border-light bg-vmb-bg-soft/20 px-3 py-2 text-[11px] text-vmb-text-muted">
          <p className="font-medium text-vmb-text-dark">Import in progress</p>
          <p className="mt-0.5">
            {parsedRowCount > 0 ?
              `${parsedRowCount} file${parsedRowCount === 1 ? "" : "s"} parsed — finish mapping and normalize to unlock the full review.`
            : "Parsed or mapping data detected — complete Data Capture normalization to see quality and fixes."}
          </p>
        </div>
      : null}

      {report ?
        <>
          <div className="mt-4">
            <p className="text-[9px] font-bold uppercase tracking-wide text-vmb-text-muted">
              Import quality summary
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className={chipCls}>
                <span className="font-bold text-vmb-text-muted">Tier </span>
                {tierLabel(report.opportunityConfidence)}
              </span>
              <span className={chipCls}>
                <span className="font-bold text-vmb-text-muted">Score </span>
                <span className="tabular-nums">{report.score}</span>
              </span>
              <span className={chipCls}>
                <span className="font-bold text-vmb-text-muted">Files parsed </span>
                <span className="tabular-nums">
                  {report.filesParsed}/{report.filesTotal}
                </span>
              </span>
              <span className={chipCls}>
                <span className="font-bold text-vmb-text-muted">Clients </span>
                <span className="tabular-nums">{report.clientsMapped}</span>
              </span>
              <span className={chipCls}>
                <span className="font-bold text-vmb-text-muted">Appts </span>
                <span className="tabular-nums">{report.appointmentsMapped}</span>
              </span>
              <span className={chipCls}>
                <span className="font-bold text-vmb-text-muted">Txns </span>
                <span className="tabular-nums">{report.transactionsMapped}</span>
              </span>
              <span className={chipCls}>
                <span className="font-bold text-vmb-text-muted">Service class </span>
                <span className="tabular-nums">{report.classificationPct}%</span>
              </span>
            </div>
          </div>

          {report.actionableWarnings?.length > 0 ?
            <div className="mt-4" id="import-review-warnings">
              <p className="text-[9px] font-bold uppercase tracking-wide text-vmb-text-muted">
                Warnings
              </p>
              <ul className="mt-1.5 space-y-1">
                {report.actionableWarnings.map((w) => (
                  <li
                    key={`${w.action}-${w.message}`}
                    className="flex flex-wrap items-baseline justify-between gap-2 rounded-md border border-vmb-pending/20 bg-vmb-pending/5 px-2 py-1.5 text-[11px]"
                  >
                    <span className="text-vmb-text-dark">
                      {w.message}
                      {typeof w.count === "number" ?
                        <span className="ml-1 tabular-nums text-vmb-text-muted">({w.count})</span>
                      : null}
                    </span>
                    <button
                      type="button"
                      onClick={() => warnScroll(w.action)}
                      className="shrink-0 text-[10px] font-semibold text-vmb-secondary underline-offset-2 hover:underline"
                    >
                      {w.action}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          : null}
        </>
      : null}

      {normalized && serviceNamesUnclassified.length > 0 ?
        <div className="mt-4" id="import-review-services">
          <p className="text-[9px] font-bold uppercase tracking-wide text-vmb-text-muted">
            Service classification
          </p>
          <div className={tableWrap}>
            <table className="w-full min-w-[400px] border-collapse">
              <thead>
                <tr>
                  <th className={thCls}>Service</th>
                  <th className={thCls}>Current</th>
                  <th className={thCls}>Category</th>
                  <th className={thCls}>Conf</th>
                  <th className={thCls}></th>
                </tr>
              </thead>
              <tbody>
                {serviceNamesUnclassified.map((name) => {
                  const base = classifyService(name);
                  const suggested =
                    base.service_category !== "other" ? base.service_category : "haircut";
                  return (
                    <ServiceCatRow
                      key={name}
                      name={name}
                      suggested={suggested}
                      confidence={base.confidence}
                      onSaved={bump}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      : null}

      {normalized && missingContactRows.length > 0 ?
        <div className="mt-4" id="import-review-contacts">
          <p className="text-[9px] font-bold uppercase tracking-wide text-vmb-text-muted">
            Missing contact
          </p>
          <div className={tableWrap}>
            <table className="w-full min-w-[320px] border-collapse">
              <thead>
                <tr>
                  <th className={thCls}>Name</th>
                  <th className={thCls}>Missing</th>
                  <th className={thCls}>Action</th>
                </tr>
              </thead>
              <tbody>
                {missingContactRows.map((c) => {
                  const held = Boolean(suppression[c.client_id]);
                  const miss = [];
                  if (!trimStr(c.email)) miss.push("email");
                  if (!trimStr(c.phone)) miss.push("phone");
                  const missLabel = miss.length ? miss.join(", ") : "—";
                  return (
                    <tr key={c.client_id}>
                      <td className={tdCls}>{trimStr(c.client_name) || "—"}</td>
                      <td className={tdCls}>{missLabel}</td>
                      <td className={tdCls}>
                        <label className="flex cursor-pointer items-center gap-1.5 text-[10px]">
                          <input
                            type="checkbox"
                            checked={held}
                            onChange={(e) => {
                              setContactSuppressed(c.client_id, e.target.checked);
                              refreshDeepInsightsAfterRepairs();
                              bump();
                            }}
                          />
                          Hold from outreach
                        </label>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      : null}

      {normalized && missingProviderRows.length > 0 ?
        <div className="mt-4" id="import-review-providers">
          <p className="text-[9px] font-bold uppercase tracking-wide text-vmb-text-muted">
            Provider review
          </p>
          <div className={tableWrap}>
            <table className="w-full min-w-[420px] border-collapse">
              <thead>
                <tr>
                  <th className={thCls}>Date</th>
                  <th className={thCls}>Client</th>
                  <th className={thCls}>Service</th>
                  <th className={thCls}>Provider</th>
                </tr>
              </thead>
              <tbody>
                {missingProviderRows.map((a) => (
                  <ProviderRow
                    key={a.appointment_id}
                    appointment={a}
                    options={providerOptions}
                    onSaved={bump}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      : null}

      {normalized ?
        <p id="import-review-transactions" className="mt-3 text-[10px] text-vmb-text-muted">
          Re-link transactions by including appointment IDs in exports, then re-normalize.
        </p>
      : null}
    </section>
  );
}

function ServiceCatRow({ name, suggested, confidence, onSaved }) {
  const [pick, setPick] = useState(suggested);

  const save = () => {
    setServiceCategoryOverride(name, pick);
    refreshDeepInsightsAfterRepairs();
    onSaved();
  };

  return (
    <tr>
      <td className={tdCls}>{name}</td>
      <td className={tdCls}>Other</td>
      <td className={tdCls}>
        <select
          value={pick}
          onChange={(e) => setPick(e.target.value)}
          className="max-w-[140px] rounded border border-vmb-border-light bg-white py-0.5 text-[11px]"
        >
          {SERVICE_REVIEW_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </td>
      <td className={`${tdCls} tabular-nums`}>{Math.round(confidence * 100)}%</td>
      <td className={tdCls}>
        <button
          type="button"
          onClick={save}
          className="rounded border border-vmb-border-light bg-vmb-bg-soft px-2 py-0.5 text-[10px] font-semibold hover:bg-vmb-bg-soft/80"
        >
          Save
        </button>
      </td>
    </tr>
  );
}

function ProviderRow({ appointment, options, onSaved }) {
  const aid = trimStr(appointment.appointment_id);
  const provOv = readProviderOverrides();
  const initial = (provOv[aid] && provOv[aid] !== PROVIDER_IGNORE_SENTINEL) ? provOv[aid] : "";
  const [val, setVal] = useState(initial);

  const date = appointment.appointment_date ?
    (() => {
      const d = new Date(appointment.appointment_date);
      return Number.isNaN(d.getTime()) ?
          String(appointment.appointment_date).slice(0, 10)
        : d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    })()
  : "—";

  const saveAssign = () => {
    if (!trimStr(val)) return;
    setProviderOverride(aid, val);
    refreshDeepInsightsAfterRepairs();
    onSaved();
  };

  const saveIgnore = () => {
    setProviderOverride(aid, PROVIDER_IGNORE_SENTINEL);
    refreshDeepInsightsAfterRepairs();
    onSaved();
  };

  return (
    <tr>
      <td className={tdCls}>{date}</td>
      <td className={tdCls}>{trimStr(appointment.client_name) || "—"}</td>
      <td className={tdCls}>{trimStr(appointment.service_name) || "—"}</td>
      <td className={tdCls}>
        <div className="flex flex-wrap items-center gap-1">
          <select
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="max-w-[120px] flex-1 rounded border border-vmb-border-light bg-white py-0.5 text-[11px]"
          >
            <option value="">Select…</option>
            {options.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={saveAssign}
            className="rounded border border-vmb-border-light bg-vmb-bg-soft px-1.5 py-0.5 text-[10px] font-semibold"
          >
            Save
          </button>
          <button
            type="button"
            onClick={saveIgnore}
            className="rounded border border-vmb-border-light px-1.5 py-0.5 text-[10px] font-semibold text-vmb-text-muted hover:bg-vmb-bg-soft/50"
          >
            Ignore
          </button>
        </div>
      </td>
    </tr>
  );
}
