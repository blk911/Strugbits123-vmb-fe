export function inviteTemplateIdForType(inviteType) {
    return `nails-${inviteType.replace(/_/g, "-")}`;
}
const CARD_TYPE_TO_INVITE_TEMPLATE_ID = {
    pcn_invite: inviteTemplateIdForType("private_client_network"),
    birthday_card: inviteTemplateIdForType("birthday_celebration"),
    referral_invite: inviteTemplateIdForType("referral_invite"),
    open_slot_fill: inviteTemplateIdForType("open_chair"),
    refresh_card: inviteTemplateIdForType("refresh_reminder"),
    reactivation_card: inviteTemplateIdForType("we_miss_you"),
    vip_thank_you: inviteTemplateIdForType("vip_thank_you"),
    service_card: inviteTemplateIdForType("favorite_providers"),
};
export function getInviteTemplateIdForCardType(cardType) {
    return CARD_TYPE_TO_INVITE_TEMPLATE_ID[cardType];
}
function getSalonInviteInventoryStatus(copy) {
    const status = copy.inventoryStatus ?? "published";
    return status === "published" ? "approved" : status;
}
export function isSalonInviteMatchingActive(copy) {
    return getSalonInviteInventoryStatus(copy) === "approved";
}
/** Stable nails-* template key — strips salon-scoped offer/storage prefixes when present. */
export function normalizeSourceTemplateId(raw) {
    const id = raw?.trim();
    if (!id)
        return null;
    if (/^nails-[a-z0-9-]+$/i.test(id))
        return id;
    const tail = id.match(/-(nails-[a-z0-9-]+)$/i);
    if (tail?.[1])
        return tail[1];
    return id;
}
const OPPORTUNITY_CATEGORY_TO_TEMPLATE_ID = {
    "PCN Invite": inviteTemplateIdForType("private_client_network"),
    Birthday: inviteTemplateIdForType("birthday_celebration"),
    Referral: inviteTemplateIdForType("referral_invite"),
    Reactivation: inviteTemplateIdForType("we_miss_you"),
    Retention: inviteTemplateIdForType("refresh_reminder"),
    "Open Slot": inviteTemplateIdForType("open_chair"),
};
const CARD_TYPE_TO_INVITE_TYPE = {
    pcn_invite: "private_client_network",
    birthday_card: "birthday_celebration",
    referral_invite: "referral_invite",
    open_slot_fill: "open_chair",
    refresh_card: "refresh_reminder",
    reactivation_card: "we_miss_you",
    vip_thank_you: "vip_thank_you",
    service_card: "new_client_welcome",
};
export function expectedTemplateIdForCardType(cardType) {
    return (getInviteTemplateIdForCardType(cardType) ??
        (CARD_TYPE_TO_INVITE_TYPE[cardType]
            ? inviteTemplateIdForType(CARD_TYPE_TO_INVITE_TYPE[cardType])
            : `nails-${cardType.replace(/_/g, "-")}`));
}
export function expectedTemplateIdForOpportunity(opportunity, suggestedCardType) {
    const fromCategory = OPPORTUNITY_CATEGORY_TO_TEMPLATE_ID[opportunity.category];
    if (fromCategory)
        return fromCategory;
    return expectedTemplateIdForCardType(suggestedCardType);
}
export function templateKeysForPublishedCopy(copy) {
    const keys = new Set();
    const fromCopy = normalizeSourceTemplateId(copy.sourceTemplateId);
    const fromSnapshot = normalizeSourceTemplateId(copy.snapshot?.sourceTemplateId);
    if (fromCopy)
        keys.add(fromCopy);
    if (fromSnapshot)
        keys.add(fromSnapshot);
    return Array.from(keys);
}
/** Index published copies by normalized sourceTemplateId (copy + snapshot keys). */
export function indexPublishedCopiesByTemplateId(copies) {
    const map = new Map();
    for (const copy of copies) {
        if (!isSalonInviteMatchingActive(copy))
            continue;
        for (const key of templateKeysForPublishedCopy(copy)) {
            const existing = map.get(key);
            if (!existing || copy.publishedVersion > existing.publishedVersion) {
                map.set(key, copy);
            }
        }
    }
    return map;
}
export function findPublishedCopyForTemplateId(copies, expectedTemplateId) {
    const normalizedExpectedTemplateId = normalizeSourceTemplateId(expectedTemplateId) ?? expectedTemplateId;
    const index = indexPublishedCopiesByTemplateId(copies);
    const hit = index.get(normalizedExpectedTemplateId) ?? null;
    if (!hit) {
        return {
            copy: null,
            matchSource: "none",
            expectedTemplateId,
            normalizedExpectedTemplateId,
        };
    }
    const copyKey = normalizeSourceTemplateId(hit.sourceTemplateId);
    const matchSource = copyKey === normalizedExpectedTemplateId
        ? "copy.sourceTemplateId"
        : "copy.snapshot.sourceTemplateId";
    return {
        copy: hit,
        matchSource,
        expectedTemplateId,
        normalizedExpectedTemplateId,
    };
}
export function publishedCopiesForDebug(copies) {
    return copies.map((copy) => ({
        copyId: copy.id,
        salonId: copy.salonId,
        sourceTemplateId: copy.sourceTemplateId,
        snapshotSourceTemplateId: copy.snapshot?.sourceTemplateId ?? "",
        normalizedKeys: templateKeysForPublishedCopy(copy),
        templateName: copy.snapshot?.templateName ?? copy.sourceTemplateId,
        publishedVersion: copy.publishedVersion,
    }));
}
