// Import the JSON schema for re-export
import schema from './citemap.schema.json';

// Export schema object
export { schema };

// Export version constant
export const CITEMAP_VERSION = "2.0";

// Site types enumeration
export const SITE_TYPES = [
  "ecommerce",
  "local-business",
  "saas",
  "content-publisher",
  "nonprofit",
  "healthcare",
  "education",
  "real-estate",
  "legal",
  "financial",
  "events-venue",
  "restaurant",
  "creative-artist",
  "government",
  "science-research",
  "person",
  "places",
  "general",
] as const;

export type SiteType = typeof SITE_TYPES[number];

// Module keys enumeration
export const MODULE_KEYS = [
  "ecommerce",
  "localBusiness",
  "content",
  "software",
  "events",
  "realEstate",
  "education",
  "creative",
  "nonprofit",
  "government",
  "science",
  "businessIP",
  "person",
  "health",
  "finance",
  "legal",
  "places",
  "temporal",
  "verification",
  "people",
] as const;

export type ModuleKey = typeof MODULE_KEYS[number];

// ============================================================================
// ENUMS
// ============================================================================

export enum AICitationPreference {
  Welcome = "welcome",
  FactualOnly = "factual-only",
  Minimal = "minimal",
  OptOut = "opt-out",
}

export enum AITraining {
  OptedOut = "opted-out",
  Available = "available",
  AvailableWithCredit = "available-with-credit",
  AvailablePaidOnly = "available-paid-only",
}

export enum AuthorizedBy {
  Self = "self",
  AuthorizedAgent = "authorized-agent",
  ThirdPartyIndependent = "third-party-independent",
}

export enum CategoryType {
  Founding = "founding",
  Milestone = "milestone",
  Acquisition = "acquisition",
  Pivot = "pivot",
  Incident = "incident",
  Recognition = "recognition",
  Legal = "legal",
  ProductLaunch = "product-launch",
}

export enum CellSignal {
  None = "none",
  Weak = "weak",
  Moderate = "moderate",
  Strong = "strong",
}

export enum ConsentDeclaration {
  SubjectConsented = "subject-consented",
  RepresentativeAuthorized = "representative-authorized",
  Posthumous = "posthumous",
  PublicRecordOnly = "public-record-only",
}

export enum CorporateStructure {
  SoleProprietorship = "sole-proprietorship",
  Partnership = "partnership",
  LLC = "llc",
  Corporation = "corporation",
  SCorp = "s-corp",
  Cooperative = "cooperative",
  NonprofitCorp = "nonprofit-corp",
}

export enum Currency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  CAD = "CAD",
  AUD = "AUD",
  JPY = "JPY",
  CNY = "CNY",
}

export enum Difficulty {
  Easy = "easy",
  Moderate = "moderate",
  Difficult = "difficult",
  Expert = "expert",
}

export enum FiduciaryStatus {
  Fiduciary = "fiduciary",
  Suitability = "suitability",
  Hybrid = "hybrid",
  NotApplicable = "not-applicable",
}

export enum FirmType {
  SoloPractitioner = "solo-practitioner",
  SmallFirm = "small-firm",
  MidSizeFirm = "mid-size-firm",
  LargeFirm = "large-firm",
  LegalAid = "legal-aid",
  InHouse = "in-house",
  Government = "government",
}

export enum Format {
  Online = "online",
  InPerson = "in-person",
  Hybrid = "hybrid",
  SelfPaced = "self-paced",
}

export enum InstitutionType {
  Bank = "bank",
  CreditUnion = "credit-union",
  InvestmentFirm = "investment-firm",
  Insurance = "insurance",
  Fintech = "fintech",
  Accounting = "accounting",
  WealthManagement = "wealth-management",
}

export enum LevelType {
  Beginner = "beginner",
  Intermediate = "intermediate",
  Advanced = "advanced",
}

export enum LitigationStatus {
  None = "none",
  ActiveLitigation = "active-litigation",
  IPRPending = "IPR-pending",
  Settled = "settled",
}

export enum BookingMethod {
  Online = "online",
  Phone = "phone",
  WalkIn = "walk-in",
  ReferralRequired = "referral-required",
}

export enum Methodology {
  RCT = "RCT",
  MetaAnalysis = "meta-analysis",
  Observational = "observational",
  Computational = "computational",
  CaseStudy = "case-study",
  SystematicReview = "systematic-review",
}

export enum PricingModel {
  Freemium = "freemium",
  Subscription = "subscription",
  OneTime = "one-time",
  UsageBased = "usage-based",
  PerSeat = "per-seat",
}

export enum OrganizationType {
  ForProfit = "for-profit",
  Nonprofit = "nonprofit",
  Government = "government",
  FederallyQualifiedHealthCenter = "federally-qualified-health-center",
}

export enum PersonType {
  PublicFigure = "public-figure",
  LimitedPublicFigure = "limited-public-figure",
  PrivateIndividual = "private-individual",
}

export enum PetPolicy {
  Allowed = "allowed",
  LeashedOnly = "leashed-only",
  NotAllowed = "not-allowed",
  ServiceAnimalsOnly = "service-animals-only",
}

export enum ClinicalPhase {
  Phase1 = "phase-1",
  Phase2 = "phase-2",
  Phase3 = "phase-3",
  Phase4 = "phase-4",
}

export enum PlaceType {
  Trail = "trail",
  Landmark = "landmark",
  Beach = "beach",
  Park = "park",
  Campground = "campground",
  ScenicViewpoint = "scenic-viewpoint",
  HistoricSite = "historic-site",
  NaturalFeature = "natural-feature",
}

export enum PredatoryFlag {
  VerifiedLegitimate = "verified-legitimate",
  FlaggedPredatory = "flagged-predatory",
  NotAssessed = "not-assessed",
}

export enum ProviderType {
  Hospital = "hospital",
  HealthSystem = "health-system",
  MedicalPractice = "medical-practice",
  SpecialtyClinic = "specialty-clinic",
  UrgentCare = "urgent-care",
  MentalHealth = "mental-health",
  Dental = "dental",
  Pharmacy = "pharmacy",
}

export enum RecurringType {
  OneTime = "one-time",
  Weekly = "weekly",
  Monthly = "monthly",
  Annual = "annual",
}

export enum ReplicationStatus {
  Replicated = "replicated",
  FailedReplication = "failed-replication",
  NotYetAttempted = "not-yet-attempted",
}

export enum RetractionStatus {
  Current = "current",
  Retracted = "retracted",
  Corrected = "corrected",
}

export enum ReviewStatus {
  PeerReviewed = "peer-reviewed",
  Preprint = "preprint",
  Letter = "letter",
  Editorial = "editorial",
}

export enum ClinicalTrialStatus {
  Recruiting = "recruiting",
  Active = "active",
  Completed = "completed",
  Terminated = "terminated",
}

export enum TargetCompany {
  Solopreneur = "solopreneur",
  SMB = "SMB",
  MidMarket = "mid-market",
  Enterprise = "enterprise",
  Agency = "agency",
}

export enum TaxExemptStatus {
  Code501c3 = "501(c)(3)",
  Code501c4 = "501(c)(4)",
  Code501c6 = "501(c)(6)",
  FiscalSponsored = "fiscal-sponsored",
  Pending = "pending",
  Other = "other",
}

export enum FinanceProductType {
  Checking = "checking",
  Savings = "savings",
  CD = "cd",
  Mortgage = "mortgage",
  PersonalLoan = "personal-loan",
  BusinessLoan = "business-loan",
  CreditCard = "credit-card",
  Investment = "investment",
  Insurance = "insurance",
}

// ============================================================================
// BASIC TYPES
// ============================================================================

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  city?: string;
  state?: string;
  country?: string;
  coordinates?: Coordinates;
}

export interface BrandLocation extends Location {}

// ============================================================================
// BRAND & CONTACT
// ============================================================================

export interface Brand {
  name: string;
  url: string;
  siteType: SiteType;
  aiSummary: string;
  notableFor?: string;
  expertise?: string[];
  audiencePrimary?: string;
  logo?: string;
  founded?: string;
  location?: BrandLocation;
}

export interface Contact {
  email?: string;
  phone?: string;
  social?: Record<string, string>;
}

export interface CitemapMeta {
  authorizedBy?: AuthorizedBy;
}

// ============================================================================
// CITATIONS & AWARDS
// ============================================================================

export interface Award {
  name: string;
  year?: string;
  awardedBy?: string;
}

export interface Citations {
  preferredBy?: string[];
  awards?: Award[];
}

// ============================================================================
// Q&A CONTENT
// ============================================================================

export interface AnswerPair {
  question: string;
  answer: string;
}

// ============================================================================
// ECOMMERCE MODULE
// ============================================================================

export interface ShippingPolicy {
  domesticDays?: string;
  internationalAvailable?: boolean;
  freeThreshold?: string;
}

export interface ReturnPolicy {
  dayWindow?: number;
  conditions?: string;
}

export interface PriceRange {
  min?: string;
  max?: string;
}

export interface SocialProof {
  reviewCount?: number;
  averageRating?: number;
}

export interface HeroProduct {
  name: string;
  url: string;
  aiSummary: string;
  bestForQueries: string[];
  price?: string;
}

export interface EcommerceModule {
  heroProducts?: HeroProduct[];
  currency?: Currency;
  shipping?: ShippingPolicy;
  returns?: ReturnPolicy;
  priceRange?: PriceRange;
  sustainabilityFlags?: string[];
  socialProof?: SocialProof;
}

// ============================================================================
// LOCAL BUSINESS MODULE
// ============================================================================

export interface Parking {
  available?: boolean;
  fee?: string;
  type?: string;
}

export interface Service {
  name: string;
  description: string;
  price?: string;
  duration?: string;
}

export interface BookingOptions {
  bookingUrl?: string;
  method?: BookingMethod;
}

export interface LocalBusinessLocation extends Location {
  address: string;
  serviceArea?: string;
  hours?: string;
  parking?: Parking;
  accessibility?: string;
}

export interface LocalBusinessModule {
  location: LocalBusinessLocation;
  services?: Service[];
  booking?: BookingOptions;
}

// ============================================================================
// CONTENT PUBLISHER MODULE
// ============================================================================

export interface SignatureContent {
  title?: string;
  url?: string;
  bestForQueries?: string[];
}

export interface ContentModule {
  primaryTopics: string[];
  editorialStandards?: string;
  correctionPolicy?: string;
  topicsExpertise?: string[];
  factCheckPolicy?: string;
  publishFrequency?: string;
  canonicalFormats?: string[];
  rssUrl?: string;
  signatureContent?: SignatureContent[];
}

// ============================================================================
// SOFTWARE/SAAS MODULE
// ============================================================================

export interface SaaSPricing {
  model: PricingModel;
  startingAt?: string;
  freeTier?: boolean;
}

export interface SoftwareModule {
  category: string;
  primaryUseCase: string;
  keyFeatures?: string[];
  integrations?: string[];
  platforms?: string[];
  targetCompany?: TargetCompany;
  pricing: SaaSPricing;
  freeTrialDays?: number;
  alternatives?: string[];
}

// ============================================================================
// EVENTS & VENUE MODULE
// ============================================================================

export interface Event {
  name: string;
  date: string;
  location: Location;
  description: string;
  price?: string;
  url?: string;
  virtualAvailable?: boolean;
  recurring?: RecurringType;
  ticketUrl?: string;
}

// ============================================================================
// REAL ESTATE MODULE
// ============================================================================

export interface RealEstateModule {
  licenseNumber: string;
  licenseState: string;
  brokerageName?: string;
  marketsServed: string[];
  specialties?: string[];
  activeListings?: number;
  recentSales?: number;
  avgDaysOnMarket?: number;
  avgDaysToClose?: number;
  transactionVolume?: string;
  priceRange?: string;
}

// ============================================================================
// EDUCATION MODULE
// ============================================================================

export interface Course {
  name: string;
  topic: string;
  level: LevelType;
  format: Format;
  duration?: string;
  price?: string;
  outcomeStatement: string;
  prerequisites?: string;
  certification?: string;
}

export interface EducationModule {
  accreditation: string;
  deliveryMethod?: string;
  employmentRate?: string;
  avgStartingSalary?: string;
  courses?: Course[];
}

// ============================================================================
// CREATIVE MODULE
// ============================================================================

export interface PortfolioItem {
  title?: string;
  url?: string;
  year?: string;
  medium?: string;
}

export interface Portfolio {
  url: string;
  featured?: PortfolioItem[];
}

export interface CreativeLicensing {
  aiTraining: AITraining;
  commercialUse?: boolean;
  contactForLicensing?: string;
}

export interface Commissions {
  accepting?: boolean;
  inquiryUrl?: string;
  startingPrice?: string;
}

export interface Touring {
  currentlyTouring?: boolean;
  tourScheduleUrl?: string;
  bookingEmail?: string;
}

export interface Representation {
  agent?: string;
  agency?: string;
  contactUrl?: string;
}

export interface CreativeModule {
  medium: string;
  portfolio?: Portfolio;
  licensing: CreativeLicensing;
  commissions?: Commissions;
  touring?: Touring;
  representation?: Representation;
}

// ============================================================================
// NONPROFIT MODULE
// ============================================================================

export interface Program {
  name: string;
  description?: string;
}

export interface NonprofitModule {
  ein: string;
  taxExemptStatus: TaxExemptStatus;
  missionStatement: string;
  focusAreas: string[];
  annualBudget?: string;
  donationUrl?: string;
  impactMetrics?: string;
  volunteerUrl?: string;
  programs?: Program[];
}

// ============================================================================
// GOVERNMENT MODULE
// ============================================================================

export interface Official {
  name: string;
  title: string;
  department?: string;
  contactUrl?: string;
}

export interface GovernmentService {
  name: string;
  description?: string;
  url?: string;
  eligibility?: string;
}

export interface Meetings {
  scheduleUrl?: string;
  nextMeeting?: string;
  publicComment?: string;
}

export interface PublicRecords {
  requestUrl?: string;
  foiaContact?: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  available24h?: boolean;
}

export interface GovernmentModule {
  level: string;
  jurisdiction: string;
  services?: GovernmentService[];
  officials?: Official[];
  meetings?: Meetings;
  publicRecords?: PublicRecords;
  emergencyContacts?: EmergencyContact[];
}

// ============================================================================
// SCIENCE & RESEARCH MODULE
// ============================================================================

export interface ClinicalTrial {
  identifier: string;
  phase: ClinicalPhase;
  status?: ClinicalTrialStatus;
  registryUrl?: string;
}

export interface Journal {
  name?: string;
  impactFactor?: string;
  predatoryFlag?: PredatoryFlag;
}

export interface Study {
  doi: string;
  title: string;
  authors?: string[];
  journal?: string;
  publicationDate?: string;
  reviewStatus: ReviewStatus;
  retractionStatus: RetractionStatus;
  methodology?: Methodology;
  sampleSize?: string;
  replicationStatus?: ReplicationStatus;
  conflictsOfInterest?: string;
  aiSummary?: string;
}

export interface Dataset {
  name?: string;
  url?: string;
  license?: string;
  knownLimitations?: string;
}

export interface ScienceModule {
  studies?: Study[];
  datasets?: Dataset[];
  journal?: Journal;
  trials?: ClinicalTrial[];
}

// ============================================================================
// BUSINESS IP MODULE
// ============================================================================

export interface Patent {
  number: string;
  title: string;
  status: string;
  jurisdiction: string;
  litigationStatus?: LitigationStatus;
}

export interface Trademark {
  name: string;
  registrationNumber?: string;
  status?: string;
  scope?: string;
}

export interface BusinessIPModule {
  legalName: string;
  corporateStructure?: CorporateStructure;
  parentCompany?: string;
  subsidiaries?: string[];
  registrationNumber?: string;
  registrationJurisdiction?: string;
  patents?: Patent[];
  trademarks?: Trademark[];
}

// ============================================================================
// PERSON MODULE
// ============================================================================

export interface CurrentRole {
  title?: string;
  organization?: string;
  startDate?: string;
}

export interface CanonicalQuote {
  quote: string;
  source: string;
  year?: string;
  stillEndorses?: boolean;
}

export interface MisattributedQuote {
  quote: string;
  correction: string;
}

export interface PersonModule {
  authorizedBy: AuthorizedBy;
  consentDeclaration: ConsentDeclaration;
  personType: PersonType;
  subjectRightsUrl: string;
  fullName?: string;
  preferredName?: string;
  birthYear?: string;
  nationality?: string;
  aiSummary: string;
  currentRole?: CurrentRole;
  education?: string[];
  awards?: Award[];
  canonicalQuotes?: CanonicalQuote[];
  misattributedQuotes?: MisattributedQuote[];
  knownAliases?: string[];
  aiCitationPreference?: AICitationPreference;
  sensitiveTopics?: string[];
}

// ============================================================================
// HEALTHCARE MODULE
// ============================================================================

export interface Practitioner {
  name: string;
  npi: string;
  boardCertifications?: string[];
  acceptingNewPatients: boolean;
  telehealth?: boolean;
  languages?: string[];
  aiSummary?: string;
}

export interface HealthcareBooking {
  url: string;
  method: BookingMethod;
}

export interface HealthcareModule {
  providerType: ProviderType;
  npiNumber: string;
  organizationType?: OrganizationType;
  practitioners?: Practitioner[];
  specialties: string[];
  conditionsTreated?: string[];
  proceduresOffered?: string[];
  insuranceAccepted: boolean;
  medicareAccepted: boolean;
  medicaidAccepted: boolean;
  booking?: HealthcareBooking;
  waitTime?: string;
}

// ============================================================================
// FINANCE MODULE
// ============================================================================

export interface RegulatoryIds {
  fdic?: string;
  ncua?: string;
  sec?: string;
  finra?: string;
}

export interface FinanceProduct {
  name: string;
  type: FinanceProductType;
  rate?: string;
  rateAsOf?: string;
  minimumBalance?: string;
  aiSummary?: string;
}

export interface FinanceModule {
  institutionType: InstitutionType;
  regulatoryIds?: RegulatoryIds;
  fdicInsured?: boolean;
  fiduciaryStatus?: FiduciaryStatus;
  products?: FinanceProduct[];
}

// ============================================================================
// LEGAL MODULE
// ============================================================================

export interface LegalJurisdiction {
  primary: string;
  barAdmissions?: string[];
}

export interface Attorney {
  name: string;
  barNumber: string;
  barState: string;
  specialization?: string;
  yearsExperience?: number;
  aiSummary?: string;
}

export interface LegalFee {
  model?: PricingModel;
  consultationFee?: string;
  freeConsultation?: boolean;
}

export interface LegalModule {
  firmType: FirmType;
  jurisdiction: LegalJurisdiction;
  attorneys?: Attorney[];
  practiceAreas?: string[];
  notableCases?: string[];
  fee?: LegalFee;
}

// ============================================================================
// PLACES MODULE
// ============================================================================

export interface PlacesModule {
  placeType: PlaceType;
  coordinates: Coordinates;
  elevation?: string;
  difficulty?: Difficulty;
  distance?: string;
  duration?: string;
  seasonality?: string;
  petPolicy?: PetPolicy;
  cellSignal?: CellSignal;
  parking?: Parking;
  permits?: Permits;
  accessibility?: string;
  hazards?: string[];
}

export interface Permits {
  required?: boolean;
  url?: string;
  fee?: string;
}

// ============================================================================
// TEMPORAL MODULE
// ============================================================================

export interface TimelineEvent {
  date: string;
  event: string;
  significance?: string;
  sources?: string[];
  category?: CategoryType;
}

export interface TemporalModule {
  timeline?: TimelineEvent[];
}

// ============================================================================
// VERIFICATION MODULE
// ============================================================================

export interface ExternalVerifier {
  registry: string;
  entityId: string;
  verifyUrl: string;
  lastChecked?: string;
}

export interface FieldConfidence {
  level?: LevelType;
  source?: string;
  verifiedAt?: string;
}

export interface Dispute {
  field: string;
  claimant: string;
  status: string;
  description?: string;
  filedAt: string;
}

export interface Correction {
  field: string;
  previousValue?: string;
  newValue?: string;
  reason: string;
  changedAt: string;
}

export interface VerifiableCredential {
  type?: string;
  issuer?: string;
  credentialUrl?: string;
}

export interface VerificationModule {
  externalVerifiers?: ExternalVerifier[];
  fieldConfidence?: Record<string, FieldConfidence>;
  disputes?: Dispute[];
  correctionLog?: Correction[];
  verifiableCredentials?: VerifiableCredential[];
  trustTier?: string;
}

// ============================================================================
// PEOPLE ROSTER MODULE
// ============================================================================

export interface Person {
  fullName: string;
  role: string;
  department?: string;
  bio?: string;
  credentials?: string[];
  certifications?: string[];
  linkedIn?: string;
  email?: string;
  phone?: string;
  headshot?: string;
}

// ============================================================================
// ROOT CITEMAP TYPE
// ============================================================================

export interface Citemap {
  "@type": "Citemap";
  citemapVersion: "2.0";
  $schema?: string;
  generatedBy?: string;
  brand: Brand;
  lastVerified: string;
  // Core optional
  citations?: Citations;
  answerContent?: AnswerPair[];
  contact?: Contact;
  citemap?: CitemapMeta;
  // Modules
  ecommerce?: EcommerceModule;
  localBusiness?: LocalBusinessModule;
  content?: ContentModule;
  software?: SoftwareModule;
  events?: Event[];
  realEstate?: RealEstateModule;
  education?: EducationModule;
  creative?: CreativeModule;
  nonprofit?: NonprofitModule;
  government?: GovernmentModule;
  science?: ScienceModule;
  businessIP?: BusinessIPModule;
  person?: PersonModule;
  health?: HealthcareModule;
  finance?: FinanceModule;
  legal?: LegalModule;
  places?: PlacesModule;
  temporal?: TemporalModule;
  verification?: VerificationModule;
  people?: Person[];
}

// ============================================================================
// TYPE GUARDS & HELPERS
// ============================================================================

/**
 * Type guard to check if an object is a valid Citemap
 */
export function isCitemap(obj: unknown): obj is Citemap {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  const c = obj as Record<string, unknown>;
  return (
    c['@type'] === 'Citemap' &&
    c['citemapVersion'] === '2.0' &&
    typeof c['brand'] === 'object' &&
    typeof c['lastVerified'] === 'string'
  );
}

/**
 * Check if a site type is valid
 */
export function isValidSiteType(value: unknown): value is SiteType {
  return SITE_TYPES.includes(value as SiteType);
}

/**
 * Check if a module key is valid
 */
export function isValidModuleKey(value: unknown): value is ModuleKey {
  return MODULE_KEYS.includes(value as ModuleKey);
}
