import { VMB_CARD_TYPES } from "../cards/card-types.js";
function normalizeCardType(cardType) {
    if (VMB_CARD_TYPES.includes(cardType)) {
        return cardType;
    }
    return "pcn_invite";
}
export function queuedInviteCardToPreviewModel(card, context) {
    return {
        cardType: normalizeCardType(card.cardType),
        salutation: "",
        title: card.actionLabel,
        subtitle: "",
        body: "",
        imageLayout: "collage",
        imageSlots: [],
        accent: "rose",
        cta: card.primaryCta,
        tags: [],
        metadata: { recipientName: card.recipientName },
        inviteCopy: {
            greeting: card.greeting,
            personalConnection: card.personalConnection ?? "",
            inviteMessage: card.inviteMessage ?? "",
            offerMessage: card.offerMessage ?? "",
            signature: card.signature ?? "",
            primaryCta: card.primaryCta,
            secondaryCta: card.secondaryCta ?? "",
        },
        techName: context.techName,
        salonDisplayName: context.salonDisplayName,
        includeOffer: Boolean(card.offerMessage?.trim()),
    };
}
