import { buildPreviewFromTemplate } from "../card-templates/apply-card-template.js";
import { getDefaultTemplate } from "../card-templates/default-card-templates.js";
import { getDefaultCtaForTemplateType } from "../card-templates/template-cta-labels.js";
import { getRelationshipFirstCardForTemplateType } from "../cards/relationship-first-invite-copy.js";
import { resolveInvitationPricing } from "./invitation-pricing-display.js";

const SLUG_CARD_TYPE = {
  "jennys-salon": "pcn_invite",
  "preview-salon": "refresh_card",
};

const ACTION_LABELS = {
  primary: "Claim My Gift",
  secondary: "Ask for an Adjustment",
  tertiary: "Hold Until Later",
};

function salonDisplayName(salon) {
  if (salon.slug === "preview-salon") return `${salon.ownerFirstName}'s Studio`;
  return salon.salonName;
}

function cardTypeForSalon(salon) {
  return SLUG_CARD_TYPE[salon.slug] ?? "pcn_invite";
}

function serviceNameForSalon(salon) {
  return salon.services?.[0]?.label ?? salon.featuredOffer?.subline ?? "your usual visit";
}

function offerFromSalon(salon, cardType) {
  const offer = salon.featuredOffer ?? {};
  return {
    id: `${salon.slug}-${cardType}-gift`,
    name: offer.headline ?? "Private client gift",
    category: cardType === "open_slot_fill" ? "open_slot" : "service",
    valueLabel: offer.subline ?? "Private gift",
    offerText: offer.detail ?? offer.subline ?? "A private gift is waiting for you.",
    terms: offer.expiresLabel ?? "Private client window",
    serviceIds: [],
    serviceOptionIds: [],
    active: true,
    isDefault: false,
  };
}

function pricingForSalon(salon, cardType) {
  return resolveInvitationPricing({
    serviceIds: [],
    rewardIds: [],
    sourceTemplateId: `nails-${cardType.replace(/_/g, "-")}`,
    totalValue: 0,
    savingsAmount: 0,
    offerPrice: 0,
    valueLabel: salon.featuredOffer?.subline,
    priceLabel: "Private gift",
  });
}

export function buildPublicInviteViewModel(salon) {
  const cardType = cardTypeForSalon(salon);
  const template = getDefaultTemplate(cardType);
  const relationshipCard = getRelationshipFirstCardForTemplateType(cardType);
  const displayName = salonDisplayName(salon);
  const serviceName = serviceNameForSalon(salon);
  const offer = offerFromSalon(salon, cardType);
  const pricing = pricingForSalon(salon, cardType);
  const preview = buildPreviewFromTemplate(
    template,
    {
      cardType,
      recipientName: salon.recipientFirstName,
      ownerName: salon.ownerFirstName,
      techName: salon.ownerFirstName,
      salonName: displayName,
      serviceName,
      offer,
      includeOffer: true,
    },
    salon.ownerFirstName,
  );

  const inviteCopy = preview.inviteCopy;
  const detail =
    inviteCopy?.inviteMessage ||
    preview.relationshipBenefit ||
    salon.featuredOffer?.detail ||
    relationshipCard.relationshipBenefitTemplate;

  return {
    ...salon,
    displaySalonName: displayName,
    templateCardType: cardType,
    templateName: template.name,
    templateCtaLabel: getDefaultCtaForTemplateType(cardType),
    invitePreview: preview,
    pricing,
    actionLabels: ACTION_LABELS,
    featuredOffer: {
      ...salon.featuredOffer,
      headline: preview.templateName || relationshipCard.label || salon.featuredOffer?.headline,
      subline: preview.title || relationshipCard.titleTemplate || salon.featuredOffer?.subline,
      detail,
      expiresLabel: salon.featuredOffer?.expiresLabel ?? offer.terms,
    },
    privateNote:
      inviteCopy?.personalConnection ||
      preview.body ||
      `A private note from ${displayName}, held in a softer place than a standard booking link.`,
  };
}
