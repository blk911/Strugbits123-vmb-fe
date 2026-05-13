import PageHeader from "../../../components/common/dashboard/PageHeader";

const sectionContent = {
  staff: {
    title: "Staff",
    description: "Manage internal staff, associates and admin access.",
    cards: [
      {
        title: "Staff Directory",
        body: "Track team members, roles, owner assignments and onboarding status.",
      },
      {
        title: "Access Levels",
        body: "Define who can access admin tools, support workflows and email operations.",
      },
      {
        title: "Onboarding Queue",
        body: "Stage new associates before mailbox and system access are activated.",
      },
    ],
  },
  support: {
    title: "Support",
    description: "Manage support channels, escalation ownership and response routing.",
    cards: [
      {
        title: "Support Inbox",
        body: "Track support@ routing, ownership and response coverage.",
      },
      {
        title: "Escalations",
        body: "Define when issues move to tech, admin or operations.",
      },
      {
        title: "Support Notes",
        body: "Capture internal support procedures for salons and clients.",
      },
    ],
  },
  contacts: {
    title: "Contacts",
    description: "Manage company contacts, vendors and internal operations records.",
    cards: [
      {
        title: "Company Contacts",
        body: "Maintain key VMB contacts for admin, tech, support and operations.",
      },
      {
        title: "Vendor Contacts",
        body: "Track SendGrid, Google Workspace, hosting and payment provider contacts.",
      },
      {
        title: "Emergency Contacts",
        body: "Keep critical operational contacts easy to find.",
      },
    ],
  },
};

export default function SettingsSection({ section }) {
  const content = sectionContent[section] || sectionContent.staff;

  return (
    <div className="p-7 font-poppins gap-8 flex flex-col">
      <PageHeader
        title={`Settings: ${content.title}`}
        description={content.description}
        showSort={false}
        searchPlaceholder={`Search ${content.title.toLowerCase()}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {content.cards.map((card) => (
          <div
            key={card.title}
            className="rounded-[12px] border border-vmb-primary/10 bg-white/70 p-5 shadow-sm"
          >
            <h2 className="text-[18px] font-semibold text-vmb-primary">
              {card.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-vmb-text-muted">
              {card.body}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-[12px] border border-dashed border-vmb-primary/15 bg-white p-8 text-center">
        <p className="text-sm font-medium text-vmb-primary">
          Backend wiring pending
        </p>
        <p className="mt-2 text-sm text-vmb-text-muted">
          This settings area is staged for provider/API integration after the
          admin data model is finalized.
        </p>
      </div>
    </div>
  );
}
