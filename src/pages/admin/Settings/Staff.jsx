import { useEffect, useMemo, useState } from "react";
import { LuMailPlus, LuTrash2 } from "react-icons/lu";
import PageHeader from "../../../components/common/dashboard/PageHeader";

const STORAGE_KEY = "vmb_admin_email_accounts";

const DEFAULT_EMAILS = [
  {
    id: "info-venmebaby",
    address: "info@venmebaby.com",
    type: "Mailbox",
    purpose: "General inquiries",
    owner: "Admin",
    status: "Active",
    provider: "Mailbox provider",
  },
  {
    id: "support-venmebaby",
    address: "support@venmebaby.com",
    type: "Mailbox",
    purpose: "Customer and salon support",
    owner: "Support",
    status: "Active",
    provider: "Mailbox provider",
  },
  {
    id: "tech-venmebaby",
    address: "tech@venmebaby.com",
    type: "Mailbox",
    purpose: "Technical operations",
    owner: "Tech",
    status: "Active",
    provider: "Mailbox provider",
  },
  {
    id: "test-venmebaby",
    address: "test@venmebaby.com",
    type: "SendGrid Sender",
    purpose: "Testing outbound email",
    owner: "Admin",
    status: "Test",
    provider: "SendGrid",
  },
  {
    id: "invites-venmebaby",
    address: "invites@venmebaby.com",
    type: "SendGrid Sender",
    purpose: "Salon invite delivery",
    owner: "System",
    status: "Active",
    provider: "SendGrid",
  },
];

const DOMAIN_OPTIONS = ["venmebaby.com", "vmbsalon.com", "vmbsalons.com"];
const TYPE_OPTIONS = ["Mailbox", "Alias", "SendGrid Sender"];
const STATUS_OPTIONS = ["Requested", "Active", "Test", "Disabled"];

const emptyForm = {
  localPart: "",
  domain: DOMAIN_OPTIONS[0],
  type: TYPE_OPTIONS[0],
  purpose: "",
  owner: "",
  status: "Requested",
  provider: "Mailbox provider",
};

function loadEmails() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_EMAILS;
  } catch {
    return DEFAULT_EMAILS;
  }
}

function normalizeLocalPart(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/@.*/, "")
    .replace(/[^a-z0-9._-]/g, "");
}

function statusClasses(status) {
  const styles = {
    Active: "bg-vmb-success/15 text-vmb-success",
    Test: "bg-vmb-secondary/15 text-vmb-secondary",
    Requested: "bg-vmb-pending/15 text-vmb-pending",
    Disabled: "bg-vmb-error/15 text-vmb-error",
  };

  return styles[status] || "bg-vmb-bg-soft text-vmb-text-muted";
}

export default function Staff() {
  const [emails, setEmails] = useState(loadEmails);
  const [form, setForm] = useState(emptyForm);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
  }, [emails]);

  const filteredEmails = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return emails;

    return emails.filter((item) =>
      [
        item.address,
        item.type,
        item.purpose,
        item.owner,
        item.status,
        item.provider,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [emails, searchQuery]);

  const summary = useMemo(
    () => ({
      total: emails.length,
      active: emails.filter((item) => item.status === "Active").length,
      senders: emails.filter((item) => item.type === "SendGrid Sender").length,
      mailboxes: emails.filter((item) => item.type === "Mailbox").length,
    }),
    [emails],
  );

  const updateForm = (field, value) => {
    setError("");
    setForm((current) => ({
      ...current,
      [field]: field === "localPart" ? normalizeLocalPart(value) : value,
      provider:
        field === "type" && value === "SendGrid Sender" ?
          "SendGrid"
        : field === "type" ? "Mailbox provider"
        : current.provider,
    }));
  };

  const handleAddEmail = (event) => {
    event.preventDefault();

    const localPart = normalizeLocalPart(form.localPart);
    if (!localPart) {
      setError("Enter an email name before adding.");
      return;
    }

    const address = `${localPart}@${form.domain}`;
    const exists = emails.some(
      (item) => item.address.toLowerCase() === address.toLowerCase(),
    );

    if (exists) {
      setError(`${address} is already in the list.`);
      return;
    }

    setEmails((current) => [
      {
        id: `${localPart}-${form.domain}-${Date.now()}`,
        address,
        type: form.type,
        purpose: form.purpose.trim() || "Internal operations",
        owner: form.owner.trim() || "Unassigned",
        status: form.status,
        provider: form.provider.trim() || "Not set",
      },
      ...current,
    ]);
    setForm(emptyForm);
  };

  const updateEmailStatus = (id, status) => {
    setEmails((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  };

  const removeEmail = (id) => {
    setEmails((current) => current.filter((item) => item.id !== id));
  };

  return (
    <div className="p-7 font-poppins gap-8 flex flex-col">
      <PageHeader
        title="Staff"
        description="Manage staff onboarding, company emails and SendGrid sender identities."
        onSearch={setSearchQuery}
        showSort={false}
        searchPlaceholder="Search by staff email, owner, purpose or provider"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          ["Total Emails", summary.total],
          ["Active", summary.active],
          ["Mailboxes", summary.mailboxes],
          ["SendGrid Senders", summary.senders],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-[12px] border border-vmb-primary/10 bg-white/70 p-5 shadow-sm"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-vmb-text-muted">
              {label}
            </p>
            <p className="mt-2 text-[28px] font-bold text-vmb-primary">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
        <form
          onSubmit={handleAddEmail}
          className="rounded-[12px] border border-vmb-primary/10 bg-white p-5 shadow-sm flex flex-col gap-4"
        >
          <div>
            <h2 className="text-[20px] font-bold text-vmb-primary">
              Add Staff Email
            </h2>
            <p className="text-sm text-vmb-text-muted mt-1">
              Track staff mailboxes, aliases and SendGrid sender identities.
            </p>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-2">
            <input
              value={form.localPart}
              onChange={(event) => updateForm("localPart", event.target.value)}
              placeholder="support"
              className="border border-vmb-primary/10 rounded-[8px] p-3 text-sm outline-none focus:border-vmb-secondary"
            />
            <select
              value={form.domain}
              onChange={(event) => updateForm("domain", event.target.value)}
              className="border border-vmb-primary/10 rounded-[8px] p-3 text-sm outline-none focus:border-vmb-secondary bg-white"
            >
              {DOMAIN_OPTIONS.map((domain) => (
                <option key={domain} value={domain}>
                  @{domain}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={form.type}
              onChange={(event) => updateForm("type", event.target.value)}
              className="border border-vmb-primary/10 rounded-[8px] p-3 text-sm outline-none focus:border-vmb-secondary bg-white"
            >
              {TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              value={form.status}
              onChange={(event) => updateForm("status", event.target.value)}
              className="border border-vmb-primary/10 rounded-[8px] p-3 text-sm outline-none focus:border-vmb-secondary bg-white"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <input
            value={form.owner}
            onChange={(event) => updateForm("owner", event.target.value)}
            placeholder="Owner or associate"
            className="border border-vmb-primary/10 rounded-[8px] p-3 text-sm outline-none focus:border-vmb-secondary"
          />

          <input
            value={form.purpose}
            onChange={(event) => updateForm("purpose", event.target.value)}
            placeholder="Purpose, e.g. support desk"
            className="border border-vmb-primary/10 rounded-[8px] p-3 text-sm outline-none focus:border-vmb-secondary"
          />

          <input
            value={form.provider}
            onChange={(event) => updateForm("provider", event.target.value)}
            placeholder="Provider, e.g. SendGrid or Google Workspace"
            className="border border-vmb-primary/10 rounded-[8px] p-3 text-sm outline-none focus:border-vmb-secondary"
          />

          {error && <p className="text-sm text-vmb-error">{error}</p>}

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-vmb-secondary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <LuMailPlus className="h-4 w-4" />
            Add Email
          </button>
        </form>

        <div className="rounded-[12px] border border-vmb-primary/10 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-1">
            <h2 className="text-[20px] font-bold text-vmb-primary">
              Staff Email List
            </h2>
            <p className="text-sm text-vmb-text-muted">
              Internal tracking only until provider automation is connected.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {filteredEmails.length === 0 ?
              <div className="rounded-[10px] border border-dashed border-vmb-primary/15 p-10 text-center text-sm text-vmb-text-muted">
                No emails found.
              </div>
            : filteredEmails.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 gap-3 rounded-[10px] border border-vmb-primary/10 bg-white p-4 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-center"
                >
                  <div>
                    <p className="font-semibold text-vmb-primary">
                      {item.address}
                    </p>
                    <p className="text-xs text-vmb-text-muted">{item.type}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-vmb-text-main">
                      {item.purpose}
                    </p>
                    <p className="text-xs text-vmb-text-muted">
                      Owner: {item.owner}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses(
                        item.status,
                      )}`}
                    >
                      {item.status}
                    </span>
                    <span className="rounded-full bg-vmb-bg-soft px-2.5 py-1 text-xs font-semibold text-vmb-text-muted">
                      {item.provider}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 lg:justify-end">
                    <select
                      value={item.status}
                      onChange={(event) =>
                        updateEmailStatus(item.id, event.target.value)
                      }
                      className="rounded-[8px] border border-vmb-primary/10 bg-white px-2 py-2 text-xs outline-none focus:border-vmb-secondary"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeEmail(item.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-vmb-primary/10 text-vmb-text-muted transition hover:bg-vmb-error/10 hover:text-vmb-error"
                      title="Remove email"
                    >
                      <LuTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
