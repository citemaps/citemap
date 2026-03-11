import Ajv, { ValidateFunction, ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import schema from '@citemap/schema';

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
 * Complete validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  score: QualityScore;
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

  if (data?.externalVerifiers && Array.isArray(data.externalVerifiers) && data.externalVerifiers.length > 0) {
    score += 30;
  }

  if (data?.citemap?.fieldConfidence && typeof data.citemap.fieldConfidence === 'object') {
    const confidenceKeys = Object.keys(data.citemap.fieldConfidence);
    if (confidenceKeys.length > 0) {
      score += Math.min(20, confidenceKeys.length * 2);
    }
  }

  if (data?.citemap?.authorizedBy === 'self') {
    score += 20;
  }

  if (data?.answerContent && Array.isArray(data.answerContent) && data.answerContent.length > 0) {
    score += Math.min(15, data.answerContent.length * 2);
  }

  if (data?.citations && typeof data.citations === 'object') {
    if (data.citations.preferences || data.citations.awards) {
      score += 15;
    }
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
 * Validate a citemap.json file against the schema
 * @param data - The data to validate (typically parsed citemap.json)
 * @returns ValidationResult with errors, warnings, and quality score
 */
export function validate(data: unknown): ValidationResult {
  const validate = createValidator();
  const isValid = validate(data);
  const errors = formatValidationErrors(validate.errors);

  const warnings: ValidationWarning[] = [];
  const citemapData = data as Record<string, any>;

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

  return {
    valid: isValid,
    errors,
    warnings,
    score,
  };
}

/**
 * Perform deep diagnostic analysis of a citemap
 * @param data - The citemap data to analyze
 * @returns Diagnosis with module coverage and recommendations
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

  if (!citemapData?.externalVerifiers) {
    recommendations.push('Add external verifiers (certifications, awards) to build trust');
  }

  return {
    siteType,
    applicableModules,
    presentModules,
    missingModules,
    fieldCoverage,
    recommendations,
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
