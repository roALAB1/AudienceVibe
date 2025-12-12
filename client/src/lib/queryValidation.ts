/**
 * Spark V2 - Query Validation Logic (CONTEXT-AWARE)
 * Intelligent pattern detection instead of hard-coded keyword lists
 */

export type SearchMode = 'intent' | 'b2b';

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  weight: number;
  check: (query: string, mode: SearchMode) => {
    passed: boolean;
    score: number;
    message: string;
    details?: string;
  };
}

export interface ValidationResult {
  overallScore: number;
  passed: boolean;
  rules: Array<{
    id: string;
    name: string;
    passed: boolean;
    score: number;
    message: string;
    details?: string;
    weight: number;
  }>;
  suggestions: string[];
}

/**
 * Context-Aware Pattern Detection
 */

// Job title patterns (contextual) - handles both singular and plural
const JOB_TITLE_PATTERNS = [
  /\b(software|senior|junior|lead|principal|staff|frontend|backend|full[\s-]?stack)\s+(engineers?|developers?|programmers?|architects?)\b/i,
  /\b(product|project|program|engineering|marketing|sales|operations)\s+(managers?|directors?|leads?|coordinators?)\b/i,
  /\b(data|business|financial|systems|security)\s+(analysts?|scientists?|engineers?|specialists?)\b/i,
  /\b(ux|ui|graphic|web|visual)\s+(designers?|developers?)\b/i,
];

// Executive/role patterns
const ROLE_PATTERNS = [
  /\b(ceo|cto|cfo|coo|cmo|vp|vice president|chief)\b/i,
  /\b(founder|co-founder|owner|president|executive|director)\b/i,
];

// Demographic patterns
const DEMOGRAPHIC_PATTERNS = [
  /\b\d+[-–]\d+\s+years?\s+old\b/i,
  /\b(male|female|men|women|gender)\b/i,
  /\b(married|single|divorced|parent|homeowner|renter)\b/i,
  /\b\$?\d+k?[-–]\$?\d+k?\s+(income|salary|net worth)\b/i,
  /\b(college|university|bachelor|master|phd|degree)\s+(graduate|educated|degree)\b/i,
];

// Location context patterns (preposition + capitalized word)
const LOCATION_CONTEXT_PATTERNS = [
  /\b(in|from|based in|located in|residing in|lives in)\s+[A-Z][a-z]+/,
  /\b[A-Z][a-z]+\s+(resident|native|local)\b/,
];

// Common city/state names (for additional detection)
const KNOWN_LOCATIONS = [
  'san francisco', 'new york', 'los angeles', 'chicago', 'boston', 'seattle',
  'austin', 'denver', 'miami', 'atlanta', 'portland', 'philadelphia',
  'california', 'texas', 'florida', 'washington', 'oregon', 'colorado',
];

// Intent signal patterns (behavioral)
const INTENT_SIGNAL_PATTERNS = [
  /\b(interested in|interest in|passion for|passionate about|care about|value)\b/i,
  /\b(love|enjoy|like|prefer|appreciate)\s+(to\s+)?\w+/i,
  /\b(hobby|hobbies|activity|activities|practice|habit|routine|lifestyle)\b/i,
  /\b(problem|challenge|struggle|difficulty|issue|concern)\s+(with|in)\b/i,
  /\b(goal|aspiration|dream|ambition|objective|aim)\s+(to|of|is)\b/i,
  /\b(believe in|support|advocate|enthusiast|fan of)\b/i,
];

// B2B attribute patterns (company-specific)
const B2B_ATTRIBUTE_PATTERNS = [
  /\b(company|companies|business|businesses|organization|enterprise|firm|corporation)\b/i,
  /\b(startup|startups|saas|b2b|b2c)\b/i,
  /\b(industry|sector|vertical|market)\b/i,
  /\b\$?\d+[km]?[-–]\$?\d+[km]?\s+(revenue|arr|mrr)\b/i,
  /\b\d+[-–]\d+\s+(employees|headcount|people|team)\b/i,
  /\b(founded|funding|series|valuation|growth rate)\b/i,
  /\b(technology|tech stack|platform|infrastructure)\b/i,
];

// B2B forbidden intent patterns
const B2B_FORBIDDEN_INTENT_PATTERNS = [
  /\b(interested in|looking for|want to|need to|planning to|considering)\b/i,
  /\b(hoping to|trying to|seeking|searching for|in the market for)\b/i,
  /\b(recently|just|about to|going to|will|might|may)\s+\w+/i,
];

// Vague marketing terms
const VAGUE_TERMS = [
  'best', 'top', 'leading', 'innovative', 'cutting-edge', 'revolutionary',
  'game-changing', 'world-class', 'premier', 'ultimate', 'amazing',
  'awesome', 'great', 'excellent', 'perfect', 'ideal',
];

// Question words
const QUESTION_WORDS = ['what', 'where', 'when', 'who', 'why', 'how', 'which'];

/**
 * Intelligent Detection Functions
 */

function detectPersona(query: string): { detected: boolean; matches: string[] } {
  const matches: string[] = [];
  
  // Check job title patterns
  JOB_TITLE_PATTERNS.forEach(pattern => {
    const match = query.match(pattern);
    if (match) matches.push(match[0]);
  });
  
  // Check role patterns
  ROLE_PATTERNS.forEach(pattern => {
    const match = query.match(pattern);
    if (match) matches.push(match[0]);
  });
  
  return {
    detected: matches.length > 0,
    matches: Array.from(new Set(matches)), // Remove duplicates
  };
}

function detectDemographics(query: string): { detected: boolean; matches: string[] } {
  const matches: string[] = [];
  
  DEMOGRAPHIC_PATTERNS.forEach(pattern => {
    const match = query.match(pattern);
    if (match) matches.push(match[0]);
  });
  
  return {
    detected: matches.length > 0,
    matches: Array.from(new Set(matches)),
  };
}

function detectLocation(query: string): { detected: boolean; matches: string[] } {
  const matches: string[] = [];
  const lowerQuery = query.toLowerCase();
  
  // Only flag location if it's used as a FILTER (describing WHO people are)
  // NOT if it's a topic of interest (WHAT they're interested in)
  
  // Check for filtering patterns: "people in [Location]", "based in [Location]"
  const filteringPatterns = [
    /\bpeople (in|from|based in|located in|residing in)\s+[A-Z][a-z]+/,
    /\b(based in|located in|residing in|lives in|from)\s+[A-Z][a-z]+/,
    /\b[A-Z][a-z]+\s+(resident|native|local)\b/,
  ];
  
  filteringPatterns.forEach(pattern => {
    const match = query.match(pattern);
    if (match) matches.push(match[0]);
  });
  
  // Check known locations ONLY with filtering prepositions
  KNOWN_LOCATIONS.forEach(location => {
    // Only flag if location is used to FILTER people, not as topic
    if (lowerQuery.includes(`people in ${location}`) || 
        lowerQuery.includes(`people from ${location}`) ||
        lowerQuery.includes(`based in ${location}`) ||
        lowerQuery.includes(`located in ${location}`) ||
        lowerQuery.includes(`residing in ${location}`)) {
      matches.push(location);
    }
  });
  
  return {
    detected: matches.length > 0,
    matches: Array.from(new Set(matches)),
  };
}

function detectIntentSignals(query: string): { detected: boolean; matches: string[] } {
  const matches: string[] = [];
  
  INTENT_SIGNAL_PATTERNS.forEach(pattern => {
    const match = query.match(pattern);
    if (match) matches.push(match[0]);
  });
  
  return {
    detected: matches.length > 0,
    matches: Array.from(new Set(matches)),
  };
}

function detectB2BAttributes(query: string): { detected: boolean; matches: string[] } {
  const matches: string[] = [];
  
  B2B_ATTRIBUTE_PATTERNS.forEach(pattern => {
    const match = query.match(pattern);
    if (match) matches.push(match[0]);
  });
  
  return {
    detected: matches.length > 0,
    matches: Array.from(new Set(matches)),
  };
}

function detectB2BForbiddenIntent(query: string): { detected: boolean; matches: string[] } {
  const matches: string[] = [];
  
  B2B_FORBIDDEN_INTENT_PATTERNS.forEach(pattern => {
    const match = query.match(pattern);
    if (match) matches.push(match[0]);
  });
  
  return {
    detected: matches.length > 0,
    matches: Array.from(new Set(matches)),
  };
}

/**
 * Validation Rules
 */

const lengthRule: ValidationRule = {
  id: 'length',
  name: 'Length Check',
  description: 'Query should be 10-500 characters',
  weight: 10,
  check: (query: string) => {
    const length = query.trim().length;
    
    if (length < 10) {
      return {
        passed: false,
        score: 0,
        message: 'Query too short',
        details: `${length} characters (minimum 10)`,
      };
    }
    
    if (length > 500) {
      return {
        passed: false,
        score: 50,
        message: 'Query too long',
        details: `${length} characters (maximum 500)`,
      };
    }
    
    if (length >= 20 && length <= 200) {
      return {
        passed: true,
        score: 100,
        message: 'Optimal length',
        details: `${length} characters`,
      };
    }
    
    return {
      passed: true,
      score: 80,
      message: 'Acceptable length',
      details: `${length} characters`,
    };
  },
};

const vagueTermsRule: ValidationRule = {
  id: 'vague-terms',
  name: 'No Marketing Language',
  description: 'Strictly forbid vague marketing terms',
  weight: 15,
  check: (query: string) => {
    const lowerQuery = query.toLowerCase();
    const foundVagueTerms = VAGUE_TERMS.filter((term) =>
      lowerQuery.includes(term)
    );
    
    if (foundVagueTerms.length === 0) {
      return {
        passed: true,
        score: 100,
        message: 'No marketing language detected',
      };
    }
    
    return {
      passed: false,
      score: foundVagueTerms.length === 1 ? 30 : 0,
      message: 'Contains forbidden marketing language',
      details: `Remove: ${foundVagueTerms.join(', ')}`,
    };
  },
};

const questionFormatRule: ValidationRule = {
  id: 'question-format',
  name: 'No Questions',
  description: 'Use keywords only, never questions',
  weight: 15,
  check: (query: string) => {
    const lowerQuery = query.toLowerCase().trim();
    const startsWithQuestion = QUESTION_WORDS.some((word) =>
      lowerQuery.startsWith(word + ' ')
    );
    const hasQuestionMark = query.includes('?');
    
    if (startsWithQuestion || hasQuestionMark) {
      return {
        passed: false,
        score: 0,
        message: 'Questions are strictly forbidden',
        details: 'Rewrite as keywords describing what you want',
      };
    }
    
    return {
      passed: true,
      score: 100,
      message: 'Proper keyword format',
    };
  },
};

const modePurityRule: ValidationRule = {
  id: 'mode-purity',
  name: 'Mode Purity',
  description: 'Intelligent context-aware mode separation',
  weight: 30, // Highest weight!
  check: (query: string, mode: SearchMode) => {
    if (mode === 'intent') {
      // Detect forbidden elements in Intent mode
      const persona = detectPersona(query);
      const demographics = detectDemographics(query);
      const location = detectLocation(query);
      const intentSignals = detectIntentSignals(query);
      
      const violations: string[] = [];
      if (persona.detected) {
        violations.push(...persona.matches.map(m => `persona: "${m}"`));
      }
      if (demographics.detected) {
        violations.push(...demographics.matches.map(m => `demographic: "${m}"`));
      }
      if (location.detected) {
        violations.push(...location.matches.map(m => `location: "${m}"`));
      }
      
      const totalViolations = violations.length;
      
      if (totalViolations > 0) {
        return {
          passed: false,
          score: totalViolations >= 3 ? 0 : (totalViolations === 2 ? 20 : 40),
          message: 'Intent mode: Focus on behaviors and interests, not WHO people are',
          details: `Remove: ${violations.join(', ')}`,
        };
      }
      
      // Check for required intent signals
      if (!intentSignals.detected) {
        return {
          passed: false,
          score: 50,
          message: 'Intent mode requires behavioral signals',
          details: 'Add: interested in, passion for, care about, problem with, goal to',
        };
      }
      
      return {
        passed: true,
        score: 100,
        message: 'Pure intent query - focuses on behaviors and interests',
      };
    }
    
    if (mode === 'b2b') {
      // Detect forbidden elements in B2B mode
      const forbiddenIntent = detectB2BForbiddenIntent(query);
      const b2bAttributes = detectB2BAttributes(query);
      
      if (forbiddenIntent.detected) {
        const violations = forbiddenIntent.matches.map(m => `"${m}"`);
        return {
          passed: false,
          score: violations.length >= 2 ? 0 : 40,
          message: 'B2B mode: Describe company attributes, not intent or behavior',
          details: `Remove intent language: ${violations.join(', ')}`,
        };
      }
      
      // Check for required B2B attributes
      if (!b2bAttributes.detected) {
        return {
          passed: false,
          score: 50,
          message: 'B2B mode requires company-specific attributes',
          details: 'Add: companies, revenue, employees, industry, SaaS, technology',
        };
      }
      
      return {
        passed: true,
        score: 100,
        message: 'Pure B2B query - focuses on company attributes',
      };
    }
    
    return {
      passed: true,
      score: 100,
      message: 'Mode purity OK',
    };
  },
};

const specificityRule: ValidationRule = {
  id: 'specificity',
  name: 'Specificity',
  description: 'Include specific, concrete details',
  weight: 15,
  check: (query: string) => {
    const hasNumbers = /\d/.test(query);
    const words = query.toLowerCase().split(/\s+/);
    const meaningfulWords = words.filter(w => w.length > 4).length;
    
    if (meaningfulWords >= 5 && hasNumbers) {
      return {
        passed: true,
        score: 100,
        message: 'Highly specific query',
      };
    }
    
    if (meaningfulWords >= 3) {
      return {
        passed: true,
        score: 80,
        message: 'Moderately specific',
      };
    }
    
    return {
      passed: false,
      score: 40,
      message: 'Lacks specificity',
      details: 'Add more concrete details and specific terms',
    };
  },
};

const keywordDensityRule: ValidationRule = {
  id: 'keyword-density',
  name: 'No Keyword Stuffing',
  description: 'Avoid excessive keyword repetition',
  weight: 10,
  check: (query: string) => {
    const words = query.toLowerCase().split(/\s+/);
    const wordCount: Record<string, number> = {};
    
    words.forEach((word) => {
      if (word.length > 3) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });
    
    const maxRepetition = Math.max(...Object.values(wordCount), 0);
    
    if (maxRepetition === 1) {
      return {
        passed: true,
        score: 100,
        message: 'No keyword repetition',
      };
    }
    
    if (maxRepetition === 2) {
      return {
        passed: true,
        score: 80,
        message: 'Minimal repetition',
      };
    }
    
    return {
      passed: false,
      score: maxRepetition === 3 ? 50 : 20,
      message: 'Excessive keyword repetition',
      details: 'Use more varied terminology',
    };
  },
};

const actionabilityRule: ValidationRule = {
  id: 'actionability',
  name: 'Actionability',
  description: 'Query is clear and actionable',
  weight: 5,
  check: (query: string) => {
    const words = query.trim().split(/\s+/);
    const wordCount = words.length;
    
    if (wordCount < 3) {
      return {
        passed: false,
        score: 0,
        message: 'Too vague to be actionable',
        details: 'Add more context and details',
      };
    }
    
    if (wordCount >= 5) {
      return {
        passed: true,
        score: 100,
        message: 'Clear and actionable',
      };
    }
    
    return {
      passed: true,
      score: 70,
      message: 'Reasonably actionable',
    };
  },
};

const ALL_RULES: ValidationRule[] = [
  lengthRule,
  vagueTermsRule,
  questionFormatRule,
  modePurityRule,
  specificityRule,
  keywordDensityRule,
  actionabilityRule,
];

export function validateQuery(
  query: string,
  mode: SearchMode
): ValidationResult {
  const results = ALL_RULES.map((rule) => {
    const result = rule.check(query, mode);
    return {
      id: rule.id,
      name: rule.name,
      passed: result.passed,
      score: result.score,
      message: result.message,
      details: result.details,
      weight: rule.weight,
    };
  });
  
  const totalWeight = ALL_RULES.reduce((sum, rule) => sum + rule.weight, 0);
  const weightedScore = results.reduce(
    (sum, result) => sum + (result.score * result.weight) / 100,
    0
  );
  const overallScore = Math.round((weightedScore / totalWeight) * 100);
  
  const suggestions: string[] = [];
  results.forEach((result) => {
    if (!result.passed && result.details) {
      suggestions.push(`${result.name}: ${result.details}`);
    }
  });
  
  return {
    overallScore,
    passed: overallScore >= 70,
    rules: results,
    suggestions,
  };
}

export function getQualityLevel(score: number): {
  level: 'excellent' | 'good' | 'fair' | 'poor';
  color: string;
  label: string;
} {
  if (score >= 90) {
    return { level: 'excellent', color: 'green', label: 'Excellent' };
  }
  if (score >= 70) {
    return { level: 'good', color: 'blue', label: 'Good' };
  }
  if (score >= 50) {
    return { level: 'fair', color: 'yellow', label: 'Fair' };
  }
  return { level: 'poor', color: 'red', label: 'Poor' };
}
