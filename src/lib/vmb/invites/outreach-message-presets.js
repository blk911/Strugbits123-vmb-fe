import { buildRelationshipFirstOutreachMessage, buildRelationshipFirstOutreachSubject, getRelationshipFirstCardForOutreachCategory, RELATIONSHIP_FIRST_INVITE_CARDS, VMB_INVITE_PRESET_SOURCE_MODULES, } from "../cards/relationship-first-invite-copy.js";
export { VMB_INVITE_PRESET_SOURCE_MODULES, RELATIONSHIP_FIRST_INVITE_CARDS };
export const OUTREACH_LOCKED_FOOTER_TEMPLATE = "\n\nSent from VMB on behalf of {salonName}\nPrivate client network · Reply links coming soon.";
export const OUTREACH_LOCKED_FOOTER_OPT_OUT_TEMPLATE = "\n\n— {salonName}\nPrivate client network · Reply STOP to opt out.";
function outreachPresetFromCard(category) {
    const card = getRelationshipFirstCardForOutreachCategory(category);
    if (!card) {
        throw new Error(`Missing relationship-first outreach card for ${category}`);
    }
    return {
        id: category,
        label: card.label,
        description: `${card.label} — relationship-first salon owner voice.`,
        subjectTemplate: `{subjectLine}`,
        messageTemplate: `{editableBody}`,
        lockedFooterTemplate: OUTREACH_LOCKED_FOOTER_TEMPLATE,
        primaryCtaLabel: card.primaryCta,
        channelHintSms: "Personal note with reply prompt",
        channelHintEmail: "Relationship-first invite with salon signature block",
    };
}
export const OUTREACH_MESSAGE_PRESETS = [
    outreachPresetFromCard("private_client_network"),
    outreachPresetFromCard("new_client_welcome"),
    outreachPresetFromCard("revenue_touch"),
    outreachPresetFromCard("trusted_intro_request"),
];
const PRESET_BY_ID = new Map(OUTREACH_MESSAGE_PRESETS.map((preset) => [preset.id, preset]));
export function getOutreachMessagePreset(id) {
    return getDefaultOutreachPreset(id);
}
export function getDefaultOutreachPreset(id) {
    const preset = PRESET_BY_ID.get(id);
    if (!preset) {
        throw new Error(`Missing outreach message preset for ${id}`);
    }
    return { ...preset };
}
export function listOutreachMessagePresets() {
    return OUTREACH_MESSAGE_PRESETS.map((preset) => ({ ...preset }));
}
export function firstNameFromClientName(clientName) {
    const trimmed = clientName?.trim();
    if (!trimmed)
        return "there";
    return trimmed.split(/\s+/)[0] || trimmed;
}
export function renderOutreachTemplate(template, vars) {
    const salonName = vars.salonName?.trim() || "Your Salon";
    const firstName = vars.firstName?.trim() || firstNameFromClientName(vars.clientName);
    const replacements = {
        salonName,
        clientName: vars.clientName?.trim() || "friend",
        firstName,
        welcomeMessage: vars.welcomeMessage?.trim() || "",
        reason: vars.reason?.trim() || "it's been a while",
        suggestedAction: vars.suggestedAction?.trim() || "We have a spot that might work",
        promptText: vars.promptText?.trim() || "",
        subjectLine: "",
        editableBody: "",
    };
    return template.replace(/\{(\w+)\}/g, (_, key) => replacements[key] ?? "");
}
export function buildOutreachLockedFooter(salonName, variant = "standard") {
    const template = variant === "opt_out"
        ? OUTREACH_LOCKED_FOOTER_OPT_OUT_TEMPLATE
        : OUTREACH_LOCKED_FOOTER_TEMPLATE;
    return renderOutreachTemplate(template, { salonName });
}
export function buildOutreachDraftCopyFromPreset(preset, vars) {
    const salonName = vars.salonName?.trim() || "Your Salon";
    const mergedVars = {
        ...vars,
        salonName,
        firstName: vars.firstName ?? firstNameFromClientName(vars.clientName),
    };
    const card = getRelationshipFirstCardForOutreachCategory(preset.id);
    if (!card) {
        throw new Error(`Missing relationship-first card for outreach preset ${preset.id}`);
    }
    const subject = preset.subjectTemplate && preset.subjectTemplate !== "{subjectLine}"
        ? renderOutreachTemplate(preset.subjectTemplate, mergedVars)
        : buildRelationshipFirstOutreachSubject(card, mergedVars);
    const editableMessage = preset.messageTemplate && preset.messageTemplate !== "{editableBody}"
        ? renderOutreachTemplate(preset.messageTemplate, mergedVars)
        : buildRelationshipFirstOutreachMessage(card, {
            ...mergedVars,
            ownerName: mergedVars.ownerName,
            serviceName: mergedVars.serviceName,
            lastVisit: mergedVars.lastVisit,
        });
    return {
        subject,
        editableMessage,
        lockedFooter: renderOutreachTemplate(preset.lockedFooterTemplate, mergedVars),
        primaryCtaLabel: preset.primaryCtaLabel,
    };
}
export function buildOutreachDraftCopy(category, vars) {
    return buildOutreachDraftCopyFromPreset(getDefaultOutreachPreset(category), vars);
}
