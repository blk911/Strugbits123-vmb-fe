function splitNextOpening(nextOpening) {
    const value = nextOpening?.trim();
    if (!value)
        return {};
    const atIndex = value.toLowerCase().indexOf(" at ");
    if (atIndex === -1) {
        return { preferredDay: value };
    }
    return {
        preferredDay: value.slice(0, atIndex).trim(),
        preferredTime: value.slice(atIndex + 4).trim(),
    };
}
function firstName(name) {
    const trimmed = name?.trim();
    if (!trimmed)
        return "Friend";
    return trimmed.split(/\s+/)[0] || trimmed;
}
export function buildTemplateTokenContext(input, ownerName) {
    const nextOpening = input.nextOpening?.trim();
    const openingParts = splitNextOpening(nextOpening);
    const serviceName = input.serviceName?.trim();
    return {
        clientName: firstName(input.recipientName),
        ownerName: ownerName?.trim() || input.techName?.trim() || "Your stylist",
        salonName: input.salonName?.trim() || "Your Salon",
        serviceName,
        lastVisit: input.lastVisit?.trim(),
        visitCount: input.visitCount,
        referralCount: input.referralCount,
        offer: input.recommendationText?.trim(),
        offerValue: undefined,
        offerTerms: undefined,
        nextOpening,
        styleName: serviceName,
        preferredDay: openingParts.preferredDay,
        preferredTime: openingParts.preferredTime,
    };
}
export function applyTemplateTokens(template, context) {
    let result = template;
    const lastAppointmentDate = context.lastVisit;
    const replacements = {
        "{clientName}": context.clientName,
        "{ownerName}": context.ownerName,
        "{salonName}": context.salonName,
        "{serviceName}": context.serviceName,
        "{lastVisit}": context.lastVisit,
        "{lastAppointmentDate}": lastAppointmentDate,
        "{visitCount}": context.visitCount != null ? String(context.visitCount) : undefined,
        "{referralCount}": context.referralCount != null ? String(context.referralCount) : undefined,
        "{offer}": context.offer,
        "{offerValue}": context.offerValue,
        "{offerTerms}": context.offerTerms,
        "{nextOpening}": context.nextOpening,
        "{styleName}": context.styleName ?? context.serviceName,
        "{preferredDay}": context.preferredDay,
        "{preferredTime}": context.preferredTime,
    };
    for (const [token, value] of Object.entries(replacements)) {
        result = result.split(token).join(value ?? "");
    }
    return result.replace(/[^\S\n]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}
export function withOfferTokens(context, offerText, valueLabel, terms) {
    return {
        ...context,
        offer: offerText ?? context.offer,
        offerValue: valueLabel,
        offerTerms: terms,
    };
}
