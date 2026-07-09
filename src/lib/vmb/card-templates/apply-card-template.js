import { inviteCopyToBody, } from "../cards/personal-invite-copy.js";
import { applyTemplateTokens, buildTemplateTokenContext, withOfferTokens } from "./template-tokens.js";
import { resolveGreetingTemplate, resolveOfferTemplateText, resolvePersonalConnectionTemplate, resolveRelationshipBenefitTemplate, resolveTemplateCta, } from "./template-copy-fields.js";
export function resolveOfferForCategory(offers, category) {
    const active = offers.filter((offer) => offer.active && offer.category === category);
    const custom = active.find((offer) => !offer.isDefault);
    if (custom)
        return custom;
    return active.find((offer) => offer.isDefault);
}
export function resolveOfferForTemplate(template, offers) {
    if (!template.offerCategory || template.offerMode === "none") {
        return undefined;
    }
    return resolveOfferForCategory(offers, template.offerCategory);
}
function shouldIncludeOffer(template, offer, includeOffer = true) {
    if (!includeOffer || template.offerMode === "none")
        return false;
    if (template.offerMode === "required")
        return Boolean(offer ?? template.offerCategory);
    return Boolean(offer);
}
function findNameById(rows, id) {
    if (!id)
        return undefined;
    const row = rows.find((item) => item.id === id);
    return row?.name ?? row?.label ?? row?.title;
}
function toCardPreviewOffer(offer, context = {}) {
    return {
        id: offer.id,
        name: offer.name,
        valueLabel: offer.valueLabel,
        offerText: offer.offerText,
        terms: offer.terms,
        category: offer.category,
        serviceIds: offer.serviceIds,
        serviceOptionIds: offer.serviceOptionIds,
        serviceName: findNameById(context.services ?? [], offer.serviceIds?.[0]),
        upgradeName: findNameById(context.options ?? [], offer.serviceOptionIds?.[0]),
    };
}
function accentFromTemplate(accent) {
    if (accent === "rose" || accent === "gold" || accent === "sage" || accent === "slate" || accent === "plum") {
        return accent;
    }
    return "plum";
}
function layoutFromImageMode(mode) {
    if (mode === "collage")
        return "collage";
    return "single";
}
function buildImageSlots(layout) {
    if (layout === "single") {
        return [{ id: "hero", label: "Hero image" }];
    }
    return [
        { id: "collage-1", label: "Salon moment" },
        { id: "collage-2", label: "Detail" },
        { id: "collage-3", label: "Style" },
    ];
}
function pickOffer(template, input) {
    const offers = input.offers ?? [];
    if (input.selectedOfferId) {
        const selected = offers.find((offer) => offer.id === input.selectedOfferId && offer.active);
        if (selected)
            return selected;
    }
    if (input.offer)
        return input.offer;
    return resolveOfferForTemplate(template, offers);
}
function buildInviteCopyFromTemplate(template, input, tokenContext, catalogOffer) {
    const personalConnection = applyTemplateTokens(resolvePersonalConnectionTemplate(template, input), tokenContext);
    const inviteMessage = applyTemplateTokens(resolveRelationshipBenefitTemplate(template), tokenContext);
    const catalogOfferText = catalogOffer
        ? applyTemplateTokens(catalogOffer.offerText, tokenContext)
        : undefined;
    const offerMessage = applyTemplateTokens(resolveOfferTemplateText(template, input, catalogOfferText), tokenContext);
    const autoCta = resolveTemplateCta(template);
    return {
        greeting: applyTemplateTokens(resolveGreetingTemplate(template), tokenContext),
        personalConnection,
        inviteMessage,
        offerMessage,
        signature: applyTemplateTokens(template.signatureTemplate, tokenContext),
        primaryCta: autoCta,
        secondaryCta: "",
    };
}
function offerIsProminent(cardType) {
    return (cardType === "birthday_card" ||
        cardType === "reactivation_card" ||
        cardType === "refresh_card" ||
        cardType === "open_slot_fill");
}
export function buildPreviewFromTemplate(template, input, ownerName) {
    const baseContext = buildTemplateTokenContext(input, ownerName);
    const catalogOffer = pickOffer(template, input);
    const includeOffer = shouldIncludeOffer(template, catalogOffer, input.includeOffer !== false);
    const tokenContext = includeOffer && catalogOffer
        ? withOfferTokens(baseContext, catalogOffer.offerText, catalogOffer.valueLabel, catalogOffer.terms)
        : baseContext;
    const recipientName = input.recipientName?.trim() || undefined;
    const imageLayout = layoutFromImageMode(template.imageMode === "none" ? "single" : template.imageMode);
    const accent = accentFromTemplate(template.accent);
    const previewOffer = includeOffer && catalogOffer
        ? toCardPreviewOffer(catalogOffer, {
            services: input.services,
            options: input.serviceOptions,
        })
        : undefined;
    const autoCta = resolveTemplateCta(template);
    if (input.cardType === "pcn_invite") {
        const inviteCopy = buildInviteCopyFromTemplate(template, input, tokenContext, catalogOffer);
        return {
            cardType: input.cardType,
            salutation: inviteCopy.greeting,
            title: "",
            subtitle: "",
            body: inviteCopyToBody(inviteCopy),
            imageLayout,
            imageSlots: buildImageSlots(imageLayout),
            accent,
            cta: autoCta,
            tags: [],
            inviteCopy,
            techName: input.techName ?? tokenContext.ownerName,
            salonDisplayName: input.salonName ?? tokenContext.salonName,
            templateId: template.id,
            templateName: template.name,
            offer: previewOffer,
            includeOffer,
            offerProminent: false,
            metadata: {
                recipientName,
                serviceName: input.serviceName,
                lastVisit: input.lastVisit,
                ticketValue: input.ticketValue,
            },
        };
    }
    const salutation = applyTemplateTokens(resolveGreetingTemplate(template), tokenContext);
    const title = applyTemplateTokens(template.titleTemplate ?? "", tokenContext);
    const subtitle = applyTemplateTokens(template.subtitleTemplate ?? "", tokenContext);
    const personalConnection = applyTemplateTokens(resolvePersonalConnectionTemplate(template, input), tokenContext);
    const relationshipBenefit = applyTemplateTokens(resolveRelationshipBenefitTemplate(template), tokenContext);
    const signatureLine = applyTemplateTokens(template.signatureTemplate, tokenContext);
    const templateOfferLine = template.offerTemplate
        ? applyTemplateTokens(template.offerTemplate, tokenContext)
        : "";
    return {
        cardType: input.cardType,
        salutation,
        title,
        subtitle,
        body: personalConnection,
        relationshipBenefit,
        signatureLine,
        imageLayout,
        imageSlots: buildImageSlots(imageLayout),
        accent,
        cta: autoCta,
        tags: [template.name],
        templateId: template.id,
        templateName: template.name,
        offer: previewOffer,
        includeOffer,
        offerProminent: offerIsProminent(input.cardType),
        templateOfferLine: templateOfferLine.trim() ? templateOfferLine : undefined,
        metadata: {
            recipientName,
            serviceName: input.serviceName,
            lastVisit: input.lastVisit,
            birthday: input.birthday,
            referralCount: input.referralCount,
            ticketValue: input.ticketValue,
        },
    };
}
export function cardPreviewToTemplateOverride(draft, base) {
    const now = new Date().toISOString();
    if (draft.cardType === "pcn_invite" && draft.inviteCopy) {
        return {
            ...base,
            id: `${base.type}-${base.salonId ?? "override"}`,
            isDefault: false,
            salonId: base.salonId,
            greetingTemplate: draft.inviteCopy.greeting,
            messageTemplate: draft.inviteCopy.personalConnection,
            relationshipBenefitTemplate: draft.inviteCopy.inviteMessage,
            offerTemplate: draft.inviteCopy.offerMessage,
            signatureTemplate: draft.inviteCopy.signature,
            titleTemplate: undefined,
            subtitleTemplate: undefined,
            updatedAt: now,
        };
    }
    return {
        ...base,
        id: `${base.type}-${base.salonId ?? "override"}`,
        isDefault: false,
        salonId: base.salonId,
        greetingTemplate: draft.salutation,
        titleTemplate: draft.title,
        subtitleTemplate: draft.subtitle,
        messageTemplate: draft.body,
        relationshipBenefitTemplate: draft.relationshipBenefit,
        offerTemplate: draft.templateOfferLine ?? base.offerTemplate,
        signatureTemplate: draft.signatureLine ?? base.signatureTemplate,
        updatedAt: now,
    };
}
