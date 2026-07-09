import React, { useMemo, useState } from "react";
import { Eye, Layers, LockKeyhole } from "lucide-react";
import PageHeader from "../../../components/common/dashboard/PageHeader";
import { buildPreviewFromTemplate } from "../../../lib/vmb/card-templates/apply-card-template";
import { getAllDefaultTemplates } from "../../../lib/vmb/card-templates/default-card-templates";
import { getDefaultCtaForTemplateType } from "../../../lib/vmb/card-templates/template-cta-labels";
import { getRelationshipFirstCardForTemplateType } from "../../../lib/vmb/cards/relationship-first-invite-copy";

const SAMPLE_INPUT = {
  recipientName: "Ava",
  ownerName: "Jenny",
  techName: "Jenny",
  salonName: "Jenny's Studio",
  serviceName: "Color gloss",
  lastVisit: "May 12",
  referralCount: 2,
  nextOpening: "Thursday at 2:00 PM",
  includeOffer: false,
};

function formatCardType(type) {
  return type
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function compactPreviewText(preview, relationshipCard) {
  const text =
    preview.body ||
    preview.relationshipBenefit ||
    preview.inviteCopy?.inviteMessage ||
    relationshipCard.relationshipBenefitTemplate ||
    "";
  return text.replace(/\s+/g, " ").trim();
}

function buildTemplateRow(template) {
  const relationshipCard = getRelationshipFirstCardForTemplateType(template.type);
  const preview = buildPreviewFromTemplate(
    template,
    {
      ...SAMPLE_INPUT,
      cardType: template.type,
    },
    SAMPLE_INPUT.ownerName,
  );

  return {
    id: template.id,
    type: template.type,
    typeLabel: formatCardType(template.type),
    name: template.name,
    title: preview.title || relationshipCard.titleTemplate || relationshipCard.label,
    previewCopy: compactPreviewText(preview, relationshipCard),
    ctaLabel: getDefaultCtaForTemplateType(template.type),
    template,
    preview,
  };
}

export default function VmbTemplateLibrary() {
  const templates = useMemo(
    () => getAllDefaultTemplates().map(buildTemplateRow),
    [],
  );
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-[#fbf8f5] p-4 font-poppins sm:p-7">
      <PageHeader
        title="VMB Template Library"
        description="Recovered invite and card domain templates available to VMB admin."
        showSort={false}
        searchPlaceholder="Search templates"
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-[12px] border border-[#eadfd8] bg-white/80 p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#9d6a72]">
                Domain Templates
              </p>
              <h2 className="mt-1 text-[20px] font-semibold text-[#332a28]">
                Invite/card templates
              </h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#ead8d1] bg-[#fff8f5] px-3 py-1 text-xs font-semibold text-[#7b5558]">
              <Layers className="h-3.5 w-3.5" />
              {templates.length} templates
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {templates.map((item) => (
              <article
                key={item.id}
                className="flex min-h-[250px] flex-col rounded-[10px] border border-[#eadfd8] bg-[#fffdfb] p-4 shadow-[0_14px_34px_rgba(75,49,47,0.06)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#a56f73]">
                      {item.typeLabel}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold leading-tight text-[#332a28]">
                      {item.name}
                    </h3>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#f3e4df] px-2.5 py-1 text-[11px] font-bold text-[#7b5558]">
                    Domain Template
                  </span>
                </div>

                <div className="mt-4 flex-1">
                  <p className="font-studio-serif text-[1.45rem] leading-tight text-[#4a3434]">
                    {item.title}
                  </p>
                  <p className="mt-3 line-clamp-4 text-sm leading-6 text-[#6d5a57]">
                    {item.previewCopy}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#f0e4df] pt-4">
                  <p className="text-sm font-semibold text-[#8f5f62]">
                    {item.ctaLabel}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedTemplate(item)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#e2c8c0] bg-white px-3 py-2 text-xs font-bold text-[#6f484b] transition hover:bg-[#fff8f5]"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="rounded-[12px] border border-[#eadfd8] bg-[#fffdfb] p-5 shadow-sm xl:sticky xl:top-6 xl:self-start">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#9d6a72]">
            Local Preview
          </p>
          <h2 className="mt-2 font-studio-serif text-[2rem] leading-tight text-[#3d2d2d]">
            {selectedTemplate.title}
          </h2>
          <div className="mt-4 rounded-[10px] border border-[#f0ddd8] bg-[#fff8f5] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b27a7d]">
              {selectedTemplate.name}
            </p>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#66514f]">
              {selectedTemplate.preview.body || selectedTemplate.previewCopy}
            </p>
          </div>
          <div className="mt-4 rounded-[10px] border border-[#ead8d1] bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b27a7d]">
              CTA Label
            </p>
            <p className="mt-2 text-sm font-semibold text-[#8f5f62]">
              {selectedTemplate.ctaLabel}
            </p>
          </div>
          <button
            type="button"
            disabled
            className="mt-5 inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-[#e5c9c3] bg-[#f7eee9] px-4 text-sm font-bold text-[#9a7773]"
          >
            <LockKeyhole className="h-4 w-4" />
            Publish coming next
          </button>
        </aside>
      </section>
    </div>
  );
}
