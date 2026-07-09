import { buildRelationshipFirstPersonalInviteFallback } from "../cards/relationship-first-invite-copy.js";
/** Deterministic personal invite copy — relationship-first defaults, no AI. */
export function buildPersonalInviteCopy(context) {
    return buildRelationshipFirstPersonalInviteFallback(context);
}
export function buildTechIdentityLine(input) {
    const tech = input.techName?.trim() || "Your stylist";
    const salon = input.salonName?.trim() || "Your Salon";
    return `${tech} from ${salon}`;
}
export function buildPrivateNoteLine(recipientName) {
    const trimmed = recipientName?.trim();
    const first = trimmed?.split(/\s+/)[0];
    if (!first)
        return "A private note for you";
    return `A private note for ${first}`;
}
export function inviteCopyToBody(copy) {
    return [copy.personalConnection, copy.inviteMessage, copy.offerMessage].filter(Boolean).join("\n\n");
}
