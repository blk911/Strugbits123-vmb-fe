import { formatInvitationPrice, pricingFromSnapshotFields, } from "../invites/invitation-package-pricing.js";
export function resolveInvitationPricing(snapshot) {
    return pricingFromSnapshotFields(snapshot);
}
export function formatSavingsLabel(pricing) {
    return formatInvitationPrice(pricing.savingsAmount);
}
