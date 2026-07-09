import { getRelationshipFirstCardForTemplateType } from "../cards/relationship-first-invite-copy.js";
const CTA_BY_TYPE = Object.fromEntries([
    "pcn_invite",
    "refresh_card",
    "reactivation_card",
    "open_slot_fill",
    "referral_invite",
    "vip_thank_you",
    "birthday_card",
    "service_card",
].map((type) => [type, getRelationshipFirstCardForTemplateType(type).primaryCta]));
export function getDefaultCtaForTemplateType(type) {
    return CTA_BY_TYPE[type];
}
