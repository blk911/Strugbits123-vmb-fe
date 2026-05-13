import React, { useCallback, useEffect, useMemo, useState } from "react";
import { LuKeyRound, LuRefreshCw } from "react-icons/lu";
import { useUser } from "../../../hooks/useUser";

const API = "/api/deep-dig/credential-assist";

function statusChipClass(status) {
  if (status === "active") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }
  if (status === "accessed") {
    return "border-sky-200 bg-sky-50 text-sky-900";
  }
  return "border-zinc-200 bg-zinc-100 text-zinc-600";
}

function formatWhen(iso) {
  if (!iso) return "—";
  const d = Date.parse(iso);
  if (Number.isNaN(d)) return iso;
  return new Date(d).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function CredentialAssistQueue() {
  const { user } = useUser();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingId, setMarkingId] = useState(null);

  const adminUserId = useMemo(
    () =>
      String(user?._id ?? user?.id ?? user?.email ?? "admin").trim() ||
      "admin",
    [user],
  );

  const fetchRecords = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(API);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          typeof data.error === "string" ?
            data.error
          : `Could not load queue (${res.status})`,
        );
        setRecords([]);
        return;
      }
      if (!data?.ok || !Array.isArray(data.records)) {
        setError("Unexpected response from server.");
        setRecords([]);
        return;
      }
      setRecords(data.records);
    } catch {
      setError("Network error. Is the dev API running?");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRecords();
  }, [fetchRecords]);

  const markAccessed = useCallback(
    async (requestId) => {
      setError(null);
      setMarkingId(requestId);
      try {
        const res = await fetch(API, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestId,
            action: "mark_accessed",
            adminUserId,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(
            typeof data.error === "string" ?
              data.error
            : `Could not update (${res.status})`,
          );
          return;
        }
        if (!data?.ok || !data.record) {
          setError("Unexpected response from server.");
          return;
        }
        setRecords((prev) =>
          prev.map((r) =>
            r.requestId === data.record.requestId ? data.record : r,
          ),
        );
      } catch {
        setError("Network error while updating.");
      } finally {
        setMarkingId(null);
      }
    },
    [adminUserId],
  );

  return (
    <div className="flex flex-col gap-8 p-4 pb-12 font-poppins sm:p-6 lg:p-7">
      <section className="overflow-hidden rounded-[12px] border border-vmb-primary/10 bg-gradient-to-br from-white via-vmb-bg-soft to-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-vmb-primary/8 bg-white/60 px-5 py-8 sm:flex-row sm:items-start sm:justify-between sm:px-8 sm:py-10">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-vmb-secondary">
              Data Mine · Concierge
            </p>
            <h1 className="mt-3 flex items-center gap-2 font-semibold text-vmb-primary text-[26px] leading-tight sm:text-[32px]">
              <LuKeyRound className="h-8 w-8 shrink-0 text-vmb-secondary" aria-hidden />
              Credential Assist Queue
            </h1>
            <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-vmb-text-muted">
              Review temporary concierge access requests for Data Mine exports.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void fetchRecords()}
            disabled={loading}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-end rounded-[10px] border border-vmb-primary/15 bg-white px-4 py-2.5 text-[14px] font-bold text-vmb-primary shadow-sm transition hover:bg-vmb-bg-soft disabled:cursor-not-allowed disabled:opacity-50 sm:self-start"
          >
            <LuRefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              aria-hidden
            />
            Refresh
          </button>
        </div>

        <div className="px-4 py-6 sm:px-8 sm:py-8">
          {loading ?
            <p className="rounded-[10px] border border-vmb-primary/10 bg-white/80 px-4 py-8 text-center text-vmb-text-muted">
              Loading credential requests…
            </p>
          : error ?
            <p
              role="alert"
              className="rounded-[10px] border border-red-200 bg-red-50/80 px-4 py-4 text-[15px] text-red-800"
            >
              {error}
            </p>
          : records.length === 0 ?
            <p className="rounded-[10px] border border-dashed border-vmb-primary/20 bg-white/60 px-4 py-10 text-center text-[15px] text-vmb-text-muted">
              No credential assist requests yet.
            </p>
          : <div className="overflow-x-auto rounded-[10px] border border-vmb-primary/10 bg-white shadow-sm">
              <table className="w-full min-w-[960px] border-collapse text-left text-[14px]">
                <thead>
                  <tr className="border-b border-vmb-primary/10 bg-vmb-bg-soft/60 text-[11px] font-bold uppercase tracking-wider text-vmb-secondary">
                    <th className="px-4 py-3">Provider</th>
                    <th className="px-4 py-3">Login URL</th>
                    <th className="px-4 py-3">Username</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Requested</th>
                    <th className="px-4 py-3">Expires</th>
                    <th className="px-4 py-3">Consents</th>
                    <th className="px-4 py-3">MFA notes</th>
                    <th className="px-4 py-3">Permission notes</th>
                    <th className="px-4 py-3">Export-only</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-vmb-primary/8 text-vmb-primary">
                  {records.map((r) => {
                    const disableMark =
                      r.status === "accessed" ||
                      r.status === "expired" ||
                      markingId === r.requestId;
                    return (
                      <tr key={r.requestId} className="bg-white/90">
                        <td className="px-4 py-3 font-semibold">
                          {r.providerName}
                        </td>
                        <td className="max-w-[200px] px-4 py-3">
                          <a
                            href={r.loginUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="break-all font-medium text-vmb-secondary underline decoration-vmb-secondary/30 underline-offset-2 hover:text-vmb-primary"
                          >
                            {r.loginUrl}
                          </a>
                        </td>
                        <td className="px-4 py-3">{r.username}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${statusChipClass(r.status)}`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-vmb-text-muted">
                          {formatWhen(r.requestedAt)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-vmb-text-muted">
                          {formatWhen(r.expiresAt)}
                        </td>
                        <td className="max-w-[140px] px-4 py-3 text-[13px] leading-snug text-vmb-text-muted">
                          <span className="block">
                            Export only:{" "}
                            <span className="font-semibold text-vmb-primary">
                              {r.consentExportOnly ? "Yes" : "No"}
                            </span>
                          </span>
                          <span className="mt-1 block">
                            No account changes:{" "}
                            <span className="font-semibold text-vmb-primary">
                              {r.consentNoAccountChanges ? "Yes" : "No"}
                            </span>
                          </span>
                        </td>
                        <td className="max-w-[180px] px-4 py-3 text-[13px] leading-relaxed text-vmb-text-muted">
                          {r.mfaNotes?.trim() || "—"}
                        </td>
                        <td className="max-w-[180px] px-4 py-3 text-[13px] leading-relaxed text-vmb-text-muted">
                          {r.permissionNotes?.trim() || "—"}
                        </td>
                        <td className="px-4 py-3 text-[13px] text-vmb-text-muted">
                          Requested export-only access ({r.accessExpiration})
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            disabled={disableMark}
                            onClick={() => void markAccessed(r.requestId)}
                            className={`rounded-[8px] px-3 py-1.5 text-[13px] font-bold transition ${
                              disableMark ?
                                "cursor-not-allowed bg-zinc-100 text-zinc-400"
                              : "bg-vmb-primary text-white hover:opacity-95"
                            }`}
                          >
                            {markingId === r.requestId ?
                              "Saving…"
                            : "Mark accessed"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          }
        </div>
      </section>
    </div>
  );
}
