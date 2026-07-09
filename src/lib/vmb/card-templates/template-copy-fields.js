import { buildPersonalInviteCopy } from "../cards/personal-invite-copy.js";
import { getRelationshipFirstCardForTemplateType } from "../cards/relationship-first-invite-copy.js";
import { getDefaultCtaForTemplateType } from "./template-cta-labels.js";
export function resolveTemplateCta(template) {
    return getDefaultCtaForTemplateType(template.type);
}
export function isLegacyRelationshipTemplate(template) {
    return !template.relationshipBenefitTemplate?.trim();
}
export function resolvePersonalConnectionTemplate(template, input) {
    if (template.type === "pcn_invite" && isLegacyRelationshipTemplate(template)) {
        return buildPersonalInviteCopy({
            recipientName: input.recipientName,
            cardType: input.cardType,
            serviceName: input.serviceName,
            visitCount: input.visitCount,
            lastVisit: input.lastVisit,
            salonName: input.salonName,
            techName: input.techName,
            subjectLabel: input.subjectLabel,
            discoveryText: input.discoveryText,
            recommendationText: input.recommendationText,
            ticketValue: input.ticketValue,
        }).personalConnection;
    }
    return template.messageTemplate;
}
export function resolveRelationshipBenefitTemplate(template) {
    if (template.relationshipBenefitTemplate?.trim()) {
        return template.relationshipBenefitTemplate;
    }
    if (template.type === "pcn_invite") {
        return template.messageTemplate;
    }
    if (template.subtitleTemplate?.trim()) {
        return template.subtitleTemplate;
    }
    return "";
}
export function resolveGreetingTemplate(template) {
    return template.greetingTemplate?.trim() || "Dear {clientName},";
}
export function resolveOfferTemplateText(template, input, catalogOfferText) {
    if (catalogOfferText?.trim()) {
        return catalogOfferText;
    }
    return template.offerTemplate?.trim() ?? "";
}
export function normalizeTemplateForEditor(template) {
    if (template.relationshipBenefitTemplate?.trim()) {
        return template;
    }
    if (template.type === "pcn_invite") {
        const pcn = getRelationshipFirstCardForTemplateType("pcn_invite");
        return {
            ...template,
            relationshipBenefitTemplate: template.relationshipBenefitTemplate?.trim() || pcn.relationshipBenefitTemplate,
            messageTemplate: template.messageTemplate?.trim() || pcn.messageTemplate,
        };
    }
    return template;
}
