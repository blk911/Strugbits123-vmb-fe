export const DEFAULT_NAIL_SERVICE_PRICES = {
    "default-nails-gel-manicure": 60,
    "default-nails-builder-gel": 75,
    "default-nails-structured-gel": 80,
    "default-nails-gel-x": 90,
    "default-nails-acrylic-extensions": 95,
    "default-nails-smart-pedicure": 75,
    "default-nails-fill-refresh": 65,
};
export const DEFAULT_NAIL_ADDON_PRICES = {
    "addon-chrome": 15,
    "addon-french": 12,
    "addon-crystals": 15,
    "addon-freestyle-art": 25,
    "offer-perk-priority-booking": 0,
    "offer-perk-complimentary-repair": 0,
    "offer-perk-removal-credit": 0,
    "addon-medium-length": 10,
    "addon-long-length": 20,
    "addon-xl-length": 35,
};
export function defaultNailServicePrice(serviceId) {
    return DEFAULT_NAIL_SERVICE_PRICES[serviceId] ?? 0;
}
export function defaultNailAddonPrice(addonId) {
    return DEFAULT_NAIL_ADDON_PRICES[addonId] ?? 0;
}
function inviteTypeFromTemplateId(sourceTemplateId) {
    const id = sourceTemplateId?.replace(/^nails-/, "").replace(/-/g, "_");
    return id && Object.hasOwn(DEFAULT_INVITE_TYPE_SAVINGS, id) ? id : undefined;
}
/** Default savings by invite type (USD). Admin Default only. */
export const DEFAULT_INVITE_TYPE_SAVINGS = {
    birthday_celebration: 15,
    referral_invite: 10,
    refresh_reminder: 10,
    we_miss_you: 15,
    open_chair: 15,
    new_client_welcome: 10,
    vip_thank_you: 20,
    private_client_network: 0,
    favorite_providers: 0,
    first_visit_thank_you: 10,
};
export function formatInvitationPrice(amount) {
    return `$${Math.max(0, Math.round(amount)).toLocaleString()}`;
}
export function calculateInvitationPackagePricing(input) {
    const serviceTotal = input.serviceIds.reduce((sum, id) => sum + (input.servicePriceById?.[id] ?? defaultNailServicePrice(id)), 0);
    const addOnTotal = input.serviceOptionIds.reduce((sum, id) => sum + (input.addonPriceById?.[id] ?? defaultNailAddonPrice(id)), 0);
    const totalValue = serviceTotal + addOnTotal;
    const requestedSavings = input.savingsAmount ??
        (input.inviteType != null ? DEFAULT_INVITE_TYPE_SAVINGS[input.inviteType] : 0);
    const savingsAmount = Math.min(totalValue, Math.max(0, requestedSavings));
    const offerPrice = input.offerPriceOverride ?? Math.max(0, totalValue - savingsAmount);
    return {
        serviceTotal,
        addOnTotal,
        totalValue,
        savingsAmount,
        offerPrice,
        priceLabel: formatInvitationPrice(offerPrice),
        valueLabel: formatInvitationPrice(totalValue),
    };
}
export function applyPricingToSnapshotFields(pricing) {
    return {
        totalValue: pricing.totalValue,
        savingsAmount: pricing.savingsAmount,
        offerPrice: pricing.offerPrice,
        valueLabel: pricing.valueLabel,
        priceLabel: pricing.priceLabel,
    };
}
export function pricingFromSnapshotFields(snapshot) {
    if (snapshot.totalValue != null &&
        snapshot.offerPrice != null &&
        snapshot.savingsAmount != null &&
        snapshot.valueLabel &&
        snapshot.priceLabel) {
        const serviceTotal = snapshot.serviceIds.reduce((sum, id) => sum + defaultNailServicePrice(id), 0);
        const addOnTotal = snapshot.rewardIds.reduce((sum, id) => sum + defaultNailAddonPrice(id), 0);
        return {
            serviceTotal,
            addOnTotal,
            totalValue: snapshot.totalValue,
            savingsAmount: snapshot.savingsAmount,
            offerPrice: snapshot.offerPrice,
            valueLabel: snapshot.valueLabel,
            priceLabel: snapshot.priceLabel,
        };
    }
    const inviteType = inviteTypeFromTemplateId(snapshot.sourceTemplateId);
    return calculateInvitationPackagePricing({
        serviceIds: snapshot.serviceIds,
        serviceOptionIds: snapshot.rewardIds,
        inviteType,
    });
}
