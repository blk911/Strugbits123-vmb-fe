function resolveLabels(ids, fallbackById = {}) {
    return ids.map((id) => fallbackById[id] ?? id).filter(Boolean);
}
function resolveInviteArtImage(snapshot, services, salonId) {
    return snapshot.selectedInviteArtUrl ?? snapshot.inviteArtImageUrl ?? snapshot.serviceImageUrl ?? "";
}
function resolveServiceImageUrl(snapshot, services) {
    return snapshot.serviceImageUrl ?? snapshot.inviteArtImageUrl ?? "";
}
function snapshotStorageId(sourceTemplateId, version) {
    return `${sourceTemplateId}-v${version}`;
}
export function buildInviteTemplateSnapshot(input) {
    const now = new Date().toISOString();
    const version = input.version ??
        (input.previousSnapshot ? input.previousSnapshot.version + 1 : input.draft.saved ? 1 : 0);
    const status = input.status ?? (input.draft.saved ? "library" : version > 0 ? "library" : "draft");
    return {
        id: snapshotStorageId(input.draft.templateId, version),
        sourceTemplateId: input.draft.templateId,
        templateName: input.draft.displayName,
        categoryId: "nails",
        headline: input.draft.headline,
        body: input.draft.body,
        ctaLabel: input.draft.ctaLabel,
        serviceIds: [...input.draft.serviceIds],
        rewardIds: [...input.draft.serviceOptionIds],
        ownerPhotoUrl: input.ownerPhotoUrl,
        salonLogoUrl: input.salonLogoUrl,
        serviceImageUrl: input.serviceImageUrl,
        inviteArtImageUrl: input.inviteArtImageUrl,
        lockedInviteArtAssetId: input.lockedInviteArtAssetId,
        selectedInviteArtUrl: input.selectedInviteArtUrl,
        priceLabel: input.priceLabel,
        expirationLabel: input.expirationLabel,
        termsText: input.termsText,
        totalValue: input.totalValue,
        savingsAmount: input.savingsAmount,
        offerPrice: input.offerPrice,
        valueLabel: input.valueLabel,
        ownerName: input.ownerName,
        salonName: input.salonName,
        status,
        version,
        createdAt: input.previousSnapshot?.createdAt ?? now,
        updatedAt: now,
    };
}
export function parseInviteTemplateSnapshot(raw) {
    if (!raw || typeof raw !== "object")
        return null;
    const row = raw;
    if (typeof row.id !== "string" ||
        typeof row.sourceTemplateId !== "string" ||
        typeof row.headline !== "string" ||
        typeof row.body !== "string" ||
        typeof row.ctaLabel !== "string") {
        return null;
    }
    return {
        ...row,
        serviceIds: Array.isArray(row.serviceIds) ? [...row.serviceIds] : [],
        rewardIds: Array.isArray(row.rewardIds) ? [...row.rewardIds] : [],
        levelUps: Array.isArray(row.levelUps) ? row.levelUps.filter((levelUp) => levelUp
            && typeof levelUp.label === "string"
            && typeof levelUp.price === "number"
            && typeof levelUp.selected === "boolean") : undefined,
    };
}
export function inviteTemplateSnapshotFromOffer(offer, templateName, options = {}) {
    const embedded = parseInviteTemplateSnapshot(offer.inviteSnapshot);
    if (embedded)
        return embedded;
    const now = offer.updatedAt || new Date().toISOString();
    return {
        id: snapshotStorageId(offer.templateId ?? offer.id, 1),
        sourceTemplateId: offer.templateId ?? offer.id,
        templateName,
        categoryId: "nails",
        headline: offer.headline ?? templateName,
        body: offer.body ?? offer.offerText,
        ctaLabel: offer.ctaLabel ?? "View Offer",
        serviceIds: offer.serviceIds ? [...offer.serviceIds] : [],
        rewardIds: offer.serviceOptionIds ? [...offer.serviceOptionIds] : [],
        priceLabel: offer.valueLabel,
        termsText: offer.terms,
        ownerName: options.ownerName,
        salonName: options.salonName,
        status: "library",
        version: 1,
        createdAt: offer.createdAt ?? now,
        updatedAt: now,
    };
}
export function resolveSnapshotServiceLabels(snapshot, fallbackById = {}) {
    return resolveLabels(snapshot.serviceIds, fallbackById);
}
export function resolveSnapshotRewardLabels(snapshot, fallbackById = {}) {
    return resolveLabels(snapshot.rewardIds, fallbackById);
}
export function snapshotToSalonInviteCardProps(snapshot, options = {}) {
    const services = resolveSnapshotServiceLabels(snapshot, options.serviceFallbackById);
    const inviteArtImageUrl = resolveInviteArtImage(snapshot, services, options.salonId);
    return {
        inviteTypeLabel: snapshot.templateName,
        headline: snapshot.headline,
        body: snapshot.body,
        ctaLabel: snapshot.ctaLabel,
        services,
        rewards: resolveSnapshotRewardLabels(snapshot, options.rewardFallbackById),
        expirationLabel: snapshot.expirationLabel,
        ownerName: snapshot.ownerName ?? "Your nail tech",
        ownerPhotoUrl: snapshot.ownerPhotoUrl,
        salonName: snapshot.salonName,
        salonLogoUrl: snapshot.salonLogoUrl,
        serviceImageUrl: resolveServiceImageUrl(snapshot, services),
        inviteArtImageUrl,
        tokenContext: options.tokenContext,
    };
}
export function formatSnapshotUpdatedAt(snapshot) {
    try {
        return new Date(snapshot.updatedAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }
    catch {
        return snapshot.updatedAt;
    }
}
export function formatSnapshotStatus(snapshot) {
    if (snapshot.status === "published")
        return "Published";
    if (snapshot.status === "library")
        return "In library";
    return "Draft";
}
