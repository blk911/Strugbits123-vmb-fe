/**
 * VMB + tAIkOS — normalized canonical model (mock / schema-first).
 * Anticipates future ingestion: salon exports → validated entities → truth threads → overlays.
 *
 * Truth thread engine (long-term):
 * - Combine: provider exports, Google Calendar, IG, TikTok, VMB invites, referral activity,
 *   behavioral timing, family context, trusted-provider affinity.
 * - Truth threads generate opportunity overlays; actions deepen human-context signals.
 */

/**
 * @typedef {Object} CanonicalClient
 * @property {string} id
 * @property {string} displayName
 * @property {string | null} primaryProviderId
 * @property {number} lifetimeValueCents
 * @property {string[]} segmentTags
 * @property {string | null} lastVisitAt
 * @property {Record<string, unknown>} [extensions]
 */

/**
 * @typedef {Object} CanonicalAppointment
 * @property {string} id
 * @property {string} clientId
 * @property {string} providerId
 * @property {string} serviceId
 * @property {string} startsAt
 * @property {string} status
 */

/**
 * @typedef {Object} CanonicalTransaction
 * @property {string} id
 * @property {string} clientId
 * @property {number} amountCents
 * @property {string} occurredAt
 * @property {string} [serviceId]
 */

/**
 * @typedef {Object} CanonicalProvider
 * @property {string} id
 * @property {string} name
 * @property {string} platformKey
 * @property {'upload'|'api'|'assisted'} connectionMode
 */

/**
 * @typedef {Object} CanonicalService
 * @property {string} id
 * @property {string} name
 * @property {string} [category]
 */

/**
 * @typedef {Object} CanonicalCampaign
 * @property {string} id
 * @property {string} title
 * @property {string} opportunityType
 * @property {'draft'|'approved'|'scheduled'|'sent'|'complete'|'hold'} status
 * @property {string[]} targetClientIds
 * @property {string} messagePreview
 * @property {string | null} sendAt
 * @property {string} whyRecommended
 */

/**
 * @typedef {Object} CanonicalOpportunity
 * @property {string} id
 * @property {string} title
 * @property {string} signalSummary
 * @property {string} contextSummary
 * @property {string} recommendedAction
 * @property {string[]} evidenceClientIds
 */

/**
 * @typedef {Object} RelationshipSignal
 * @property {string} id
 * @property {string} clientId
 * @property {'referral'|'repeat_cadence'|'vip'|'social_proof'|'event'} kind
 * @property {number} score
 * @property {string} [note]
 */

/**
 * @typedef {Object} HumanContextSignal
 * @property {string} id
 * @property {string} clientId
 * @property {'child_birthday'|'spouse'|'trusted_provider'|'wedding'|'preferred_day'|'vacation'|'self_care'|'family_event'|'gift_occasion'} kind
 * @property {string | null} value
 * @property {'confirmed'|'inferred'|'prompted'} confidence
 */

export const CANONICAL_SCHEMA_VERSION = "vmb.taikos.canonical.v0.mock";
