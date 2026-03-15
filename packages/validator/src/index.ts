import Ajv, { ValidateFunction, ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import {
  schema,
  calculateLevel,
  nextLevelHints,
  CitemapLevel,
  MODULE_KEYS,
  CITEMAP_SUPPORTED_VERSIONS,
} from '@citemap/schema';

/**
 * Represents a validation error from schema checking
 */
export interface ValidationError {
  path: string;
  message: string;
  keyword: string;
}

/**
 * Represents a validation warning for quality or completeness issues
 */
export interface ValidationWarning {
  path: string;
  message: string;
  suggestion: string;
}

/**
 * Quality score breakdown for a citemap
 */
export interface QualityScore {
  overall: number; // 0-100
  completeness: number; // 0-100
  modules: number; // 0-100
  trust: number; // 0-100
  breakdown: Record<string, number>;
}

/**
 * v3 Level assessment
 */
export interface LevelAssessment {
  current: CitemapLevel;
  claimed?: CitemapLevel;
  claimAccurate: boolean;
  nextLevelHints: string[];
  badge: string; // e.g. "Level 2 ★★☆"
}

/**
 * Complete validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  score: QualityScore;
  level: LevelAssessment;
  version: string;
}

/**
 * Field coverage metrics
 */
export interface FieldCoverage {
  total: number;
  filled: number;
  percentage: number;
}

/**
 * Deep diagnostic analysis of a citemap
 */
export interface Diagnosis {
  siteType: string;
  applicableModules: string[];
  presentModules: string[];
  missingModules: string[];
  fieldCoverage: FieldCoverage;
  recommendations: string[];
  level: LevelAssessment;
}

/**
 * Mapping of siteType to applicable module names
 */
const SITE_TYPE_TO_MODULES: Record<string, string[]> = {
  ecommerce: ['ecommerce'],
  'local-business': ['localBusiness'],
  restaurant: ['localBusiness', 'events'],
  saas: ['software'],
  'content-publisher': ['content'],
  nonprofit: ['nonprofit'],
  healthcare: ['health'],
  education: ['education'],
  'real-estate': ['realEstate'],
  legal: ['legal'],
  financial: ['finance'],
  'events-venue': ['events'],
  'creative-artist': ['creative'],
  government: ['government'],
  'science-research': ['science'],
  person: ['person'],
  places: ['places'],
  general: [],
};

/**
 * Maps module names to their property names in the citemap
 */
const MODULE_PROPERTY_NAMES: Record<string, string> = {
  ecommerce: 'ecommerce',
  localBusiness: 'localBusiness',
  software: 'software',
  content: 'content',
  nonprofit: 'nonprofit',
  health: 'health',
  education: 'education',
  realEstate: 'realEstate',
  legal: 'legal',
  finance: 'finance',
  events: 'events',
  creative: 'creative',
  government: 'government',
  science: 'science',
  person: 'person',
  places: 'places',
};

/**
 * Required fields at the root level of a citemap
 */
const REQUIRED_ROOT_FIELDS = ['@type', 'citemapVersion', 'brand', 'lastVerified'];

/**
 * Recommended fields across all citemaps
 */
const RECOMMENDED_ROOT_FIELDS = [
  'citations',
  'answerContent',
  'contact',
  'citemap',
];

/**
 * Regex pattern for entity IDs: type:slug
 */
const ENTITY_ID_PATTERN = /^[a-z][a-z0-9-]*:[a-z0-9][a-z0-9-]*$/;

/**
 * Get applicable modules for a given siteType
 * @param siteType - The site type from brand.siteType
 * @returns Array of module names that should be present
 */
export function getApplicableModules(siteType: string): string[] {
  return SITE_TYPE_TO_MODULES[siteType] || [];
}

/**
 * Initialize and configure the Ajv validator
 */
function createValidator(): ValidateFunction {
  const ajv = new Ajv({
    strict: false,
    allErrors: true,
    verbose: true,
  });
  addFormats(ajv);
  const validate = ajv.compile(schema as any);
  return validate;
}

/**
 * Convert Ajv errors to our ValidationError format
 */
function formatValidationErrors(errors: ErrorObject[] | null): ValidationError[] {
  if (!errors) return [];

  return errors.map((err) => ({
    path: err.instancePath || '/',
    message: err.message || 'Unknown validation error',
    keyword: err.keyword || 'unknown',
  }));
}

/**
 * Count fields in an object, recursively
 */
function countFields(obj: any): { total: number; filled: number } {
  if (!obj || typeof obj !== 'object') {
    return { total: 0, filled: 0 };
  }

  let total = 0;
  let filled = 0;

  for (const key in obj) {
    if (key.startsWith('@') || key === 'citemapVersion') continue;

    const value = obj[key];
    total++;

    if (value !== null && value !== undefined && value !== '') {
      if (typeof value === 'object') {
        const nested = countFields(value);
        total += nested.total;
        filled += nested.filled;
      }
      filled++;
    }
  }

  return { total, filled };
}

/**
 * Check for trust signals in the citemap
 */
function calculateTrustSignals(data: any): number {
  let score = 0;
  const maxScore = 100;

  // v3: verification module
  if (data?.verification?.externalVerifiers && Array.isArray(data.verification.externalVerifiers) && data.verification.externalVerifiers.length > 0) {
    score += 25;
  }

  // Legacy: externalVerifiers at root (v2 compat)
  if (data?.externalVerifiers && Array.isArray(data.externalVerifiers) && data.externalVerifiers.length > 0) {
    score += 25;
  }

  if (data?.verification?.fieldConfidence && typeof data.verification.fieldConfidence === 'object') {
    const confidenceKeys = Object.keys(data.verification.fieldConfidence);
    if (confidenceKeys.length > 0) {
      score += Math.min(15, confidenceKeys.length * 2);
    }
  }

  if (data?.citemap?.authorizedBy === 'self') {
    score += 15;
  }

  if (data?.answerContent && Array.isArray(data.answerContent) && data.answerContent.length > 0) {
    score += Math.min(15, data.answerContent.length * 2);
  }

  if (data?.citations && typeof data.citations === 'object') {
    if (data.citations.preferredBy || data.citations.awards) {
      score += 10;
    }
  }

  // v3: verifiedClaims bonus
  if (data?.verifiedClaims && Array.isArray(data.verifiedClaims) && data.verifiedClaims.length > 0) {
    score += Math.min(20, data.verifiedClaims.length * 5);
  }

  return Math.min(score, maxScore);
}

/**
 * Calculate completeness score based on filled fields
 */
function calculateCompletenessScore(data: any): number {
  const requiredFieldsFilled = REQUIRED_ROOT_FIELDS.filter(
    (field) => data?.[field] !== null && data?.[field] !== undefined
  ).length;

  const recommendedFieldsFilled = RECOMMENDED_ROOT_FIELDS.filter(
    (field) => data?.[field] !== null && data?.[field] !== undefined
  ).length;

  const requiredScore = (requiredFieldsFilled / REQUIRED_ROOT_FIELDS.length) * 60;
  const recommendedScore = (recommendedFieldsFilled / RECOMMENDED_ROOT_FIELDS.length) * 40;

  return Math.round(requiredScore + recommendedScore);
}

/**
 * Calculate module coverage score
 */
function calculateModuleScore(data: any, applicableModules: string[]): number {
  if (applicableModules.length === 0) return 100;

  const presentCount = applicableModules.filter((moduleName) => {
    const propertyName = MODULE_PROPERTY_NAMES[moduleName];
    return data?.[propertyName] !== null && data?.[propertyName] !== undefined;
  }).length;

  return Math.round((presentCount / applicableModules.length) * 100);
}

/**
 * Generate a level badge string
 */
function levelBadge(level: CitemapLevel): string {
  const stars = '★'.repeat(level) + '☆'.repeat(3 - level);
  return `Level ${level} ${stars}`;
}

/**
 * Assess the CiteMap Level using @citemap/schema helpers
 */
function assessLevel(data: any): LevelAssessment {
  const current = calculateLevel(data as any);
  const claimed = data?.citemapLevel as CitemapLevel | undefined;
  const claimAccurate = claimed == null || claimed === current;
  const hints = nextLevelHints(data as any);

  return {
    current,
    claimed: claimed ?? undefined,
    claimAccurate,
    nextLevelHints: hints,
    badge: levelBadge(current),
  };
}

/**
 * Validate entity IDs found in arrays throughout the citemap
 */
function validateEntityIds(data: any): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  const arraysToCheck: { path: string; items: any[] }[] = [];

  // Collect all arrays that might have entity IDs
  const arrayPaths: [string, string][] = [
    ['answerContent', '/answerContent'],
    ['people', '/people'],
    ['events', '/events'],
  ];

  for (const [key, path] of arrayPaths) {
    if (Array.isArray(data?.[key])) {
      arraysToCheck.push({ path, items: data[key] });
    }
  }

  // Check module arrays
  const moduleArrayFields: Record<string, string[]> = {
    ecommerce: ['heroProducts'],
    localBusiness: ['services'],
    content: ['signatureContent'],
    education: ['courses'],
    creative: ['portfolio.featured'],
    nonprofit: ['programs'],
    government: ['services', 'officials', 'emergencyContacts'],
    science: ['studies', 'datasets', 'trials'],
    businessIP: ['patents', 'trademarks'],
    person: ['canonicalQuotes'],
    health: ['practitioners'],
    finance: ['products'],
    legal: ['attorneys'],
    temporal: ['timeline'],
  };

  for (const [moduleName, fields] of Object.entries(moduleArrayFields)) {
    if (!data?.[moduleName]) continue;
    for (const field of fields) {
      const parts = field.split('.');
      let target = data[moduleName];
      for (const part of parts) {
        target = target?.[part];
      }
      if (Array.isArray(target)) {
        arraysToCheck.push({ path: `/${moduleName}/${field}`, items: target });
      }
    }
  }

  // Validate ID format on each item
  for (const { path, items } of arraysToCheck) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item?.id && typeof item.id === 'string') {
        if (!ENTITY_ID_PATTERN.test(item.id)) {
          warnings.push({
            path: `${path}[${i}].id`,
            message: `Entity ID "${item.id}" does not match required format "type:slug"`,
            suggestion: 'Use lowercase type:slug format, e.g. "service:craft-beer-selection" or "person:betsy-weedman"',
          });
        }
      }
    }
  }

  return warnings;
}

/**
 * Validate a citemap.json file against the schema
 * @param data - The data to validate (typically parsed citemap.json)
 * @returns ValidationResult with errors, warnings, quality score, and level assessment
 */
export function validate(data: unknown): ValidationResult {
  const validate = createValidator();
  const isValid = validate(data);
  const errors = formatValidationErrors(validate.errors ?? null);

  const warnings: ValidationWarning[] = [];
  const citemapData = data as Record<string, any>;
  const version = citemapData?.citemapVersion || 'unknown';

  // Generate warnings for quality issues
  if (citemapData?.brand) {
    const { siteType } = citemapData.brand;
    const applicableModules = getApplicableModules(siteType);

    for (const moduleName of applicableModules) {
      const propertyName = MODULE_PROPERTY_NAMES[moduleName];
      if (!propertyName) continue;

      if (!citemapData[propertyName]) {
        warnings.push({
          path: `/${propertyName}`,
          message: `Module "${moduleName}" is recommended for siteType "${siteType}" but not present`,
          suggestion: `Add the "${propertyName}" module with relevant data for ${siteType} businesses`,
        });
      }
    }
  }

  if (!citemapData?.citations) {
    warnings.push({
      path: '/citations',
      message: 'No citation preferences specified',
      suggestion: 'Add citation preferences to control how AI systems cite your brand',
    });
  }

  if (!citemapData?.answerContent || (Array.isArray(citemapData.answerContent) && citemapData.answerContent.length === 0)) {
    warnings.push({
      path: '/answerContent',
      message: 'No answer content provided',
      suggestion: 'Add Q&A pairs to improve AI accuracy and citations',
    });
  }

  if (!citemapData?.contact) {
    warnings.push({
      path: '/contact',
      message: 'No contact information provided',
      suggestion: 'Add contact details and social profiles for better discoverability',
    });
  }

  // v3-specific warnings
  if (version === '3.0') {
    if (!citemapData?.citationContract) {
      warnings.push({
        path: '/citationContract',
        message: 'No citationContract specified (v3 recommended)',
        suggestion: 'Add citationContract with preferredName, shortDescription, and disambiguation to control how AI introduces your brand',
      });
    }

    // Validate entity IDs
    warnings.push(...validateEntityIds(citemapData));

    // Check citemapLevel claim accuracy
    if (citemapData?.citemapLevel != null) {
      const actual = calculateLevel(citemapData as any);
      if (citemapData.citemapLevel !== actual) {
        warnings.push({
          path: '/citemapLevel',
          message: `Claimed Level ${citemapData.citemapLevel} but actual content is Level ${actual}`,
          suggestion: `Update citemapLevel to ${actual}, or add missing content to reach Level ${citemapData.citemapLevel}`,
        });
      }
    }
  }

  // Calculate quality score
  const applicableModules = getApplicableModules(citemapData?.brand?.siteType || 'general');
  const completenessScore = calculateCompletenessScore(citemapData);
  const moduleScore = calculateModuleScore(citemapData, applicableModules);
  const trustScore = calculateTrustSignals(citemapData);

  const overallScore = Math.round(
    completenessScore * 0.4 + moduleScore * 0.3 + trustScore * 0.3
  );

  const score: QualityScore = {
    overall: overallScore,
    completeness: completenessScore,
    modules: moduleScore,
    trust: trustScore,
    breakdown: {
      completeness: completenessScore,
      modules: moduleScore,
      trust: trustScore,
    },
  };

  // Assess level
  const level = assessLevel(citemapData);

  return {
    valid: isValid,
    errors,
    warnings,
    score,
    level,
    version,
  };
}

/**
 * Perform deep diagnostic analysis of a citemap
 * @param data - The citemap data to analyze
 * @returns Diagnosis with module coverage, recommendations, and level assessment
 */
export function diagnose(data: unknown): Diagnosis {
  const citemapData = data as Record<string, any>;
  const siteType = citemapData?.brand?.siteType || 'unknown';
  const applicableModules = getApplicableModules(siteType);

  const presentModules = applicableModules.filter((moduleName) => {
    const propertyName = MODULE_PROPERTY_NAMES[moduleName];
    return citemapData[propertyName] !== null && citemapData[propertyName] !== undefined;
  });

  const missingModules = applicableModules.filter((moduleName) => !presentModules.includes(moduleName));

  const { total, filled } = countFields(citemapData);
  const fieldCoverage: FieldCoverage = {
    total,
    filled,
    percentage: total > 0 ? Math.round((filled / total) * 100) : 0,
  };

  const recommendations: string[] = [];

  if (missingModules.length > 0) {
    recommendations.push(
      `Add the following modules for better coverage: ${missingModules.join(', ')}`
    );
  }

  if (fieldCoverage.percentage < 50) {
    recommendations.push('Fill in more fields to improve AI citation accuracy');
  }

  if (!citemapData?.answerContent || citemapData.answerContent.length === 0) {
    recommendations.push('Add Q&A pairs in answerContent to guide AI responses');
  }

  if (!citemapData?.citations) {
    recommendations.push('Define citation preferences in the citations field');
  }

  if (!citemapData?.verification) {
    recommendations.push('Add a verification block with externalVerifiers or fieldConfidence to build trust');
  }

  // v3-specific recommendations
  const version = citemapData?.citemapVersion;
  if (version === '3.0') {
    if (!citemapData?.citationContract) {
      recommendations.push('Add citationContract to control how AI introduces your brand');
    }
    if (!citemapData?.verifiedClaims || citemapData.verifiedClaims.length === 0) {
      recommendations.push('Add verifiedClaims with externally checkable IDs (NPI, EIN, bar license, etc.)');
    }
  }

  // Level assessment with next-level hints
  const level = assessLevel(citemapData);
  if (level.nextLevelHints.length > 0) {
    for (const hint of level.nextLevelHints) {
      recommendations.push(`To reach Level ${level.current + 1}: ${hint}`);
    }
  }

  return {
    siteType,
    applicableModules,
    presentModules,
    missingModules,
    fieldCoverage,
    recommendations,
    level,
  };
}

/**
 * Validate and diagnose in one call
 * @param data - The citemap data
 * @returns Combined ValidationResult and Diagnosis
 */
export function validateAndDiagnose(data: unknown): ValidationResult & { diagnosis: Diagnosis } {
  return {
    ...validate(data),
    diagnosis: diagnose(data),
  };
}
