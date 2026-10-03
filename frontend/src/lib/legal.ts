// TODO: switch to Melodyc S.r.l. (controller) and D'Ambrosio Holding S.r.l. (parent company) once both are incorporated.
export const legalEntity = {
  // TODO: "Melodyc S.r.l."
  name: "SkyClouds SRLs",
  // TODO: "Limited liability company (Società a responsabilità limitata)"
  legalForm: "Sole Shareholder Company",
  // TODO: Melodyc S.r.l. registered office
  address: "Corso del Popolo 161",
  city: "45100 Rovigo (RO), Italy",
  // TODO: Melodyc S.r.l. VAT number, then add its REA number to LegalControllerCard
  vatNumber: "01634740292",
  // TODO: info@melodyc.com
  email: "info@skyclouds.co",
  // TODO: dedicated privacy address for Melodyc S.r.l. (e.g. privacy@melodyc.com)
  privacyEmail: "info@skyclouds.co",
  // TODO: Melodyc S.r.l. PEC
  pec: "skyclouds@pec.it",
  website: "melodyc.com",
  // TODO: court of the Melodyc S.r.l. registered office, used for disputes with business users
  court: "Rovigo",
  // TODO: "D'Ambrosio Holding S.r.l." (enables the direction and coordination notice, art. 2497-bis c.c.)
  parentCompany: null as string | null,
};

export const COOKIE_POLICY_VERSION = "2026-10-03";
export const COOKIE_POLICY_UPDATED_AT = "October 3, 2026";
export const COOKIE_CONSENT_MAX_AGE_DAYS = 365;
export const PRIVACY_POLICY_UPDATED_AT = "October 3, 2026";
export const TERMS_UPDATED_AT = "October 2, 2026";
export const COOKIE_POLICY_UPDATED_AT_IT = "3 ottobre 2026";
export const PRIVACY_POLICY_UPDATED_AT_IT = "3 ottobre 2026";
export const TERMS_UPDATED_AT_IT = "2 ottobre 2026";
// Stored with each sign-up as proof of which Terms version was accepted.
export const TERMS_VERSION = "2026-10-02";
