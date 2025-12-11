/**
 * Spark V2 - Query Quality Validation
 * Based on query best practices from spark-investigation/08-query-best-practices.md
 */

import type {
  QueryQualityResult,
  QueryValidationIssue,
  SearchMode,
} from "../types";

/**
 * Calculate quality score for a search query
 * Returns score 0-100 with detailed issues and suggestions
 */
export function calculateQualityScore(
  query: string,
  mode: SearchMode
): QueryQualityResult {
  const issues: QueryValidationIssue[] = [];
  const passedRules: string[] = [];
  const failedRules: string[] = [];

  const trimmedQuery = query.trim();
  const wordCount = trimmedQuery.split(/\s+/).length;
  const lowerQuery = trimmedQuery.toLowerCase();

  // Rule 1: Length check (2-10 words optimal)
  if (wordCount < 2) {
    failedRules.push("Length");
    issues.push({
      type: "error",
      message: "Query too short (less than 2 words)",
      suggestion: "Add more specific keywords. Example: 'email marketing' instead of 'email'",
    });
  } else if (wordCount > 10) {
    failedRules.push("Length");
    issues.push({
      type: "warning",
      message: "Query too long (more than 10 words)",
      suggestion: "Simplify to core concepts. Remove unnecessary words.",
    });
  } else {
    passedRules.push("Length");
  }

  // Rule 2: No personas (for Intent search)
  const personaWords = [
    "people who",
    "users who",
    "customers who",
    "businesses that",
    "companies that",
    "individuals",
    "professionals",
    "marketers",
    "developers",
    "founders",
  ];

  const hasPersona = personaWords.some((persona) =>
    lowerQuery.includes(persona)
  );

  if (hasPersona && mode === "intent") {
    failedRules.push("No Personas");
    issues.push({
      type: "error",
      message: "Avoid persona descriptors in Intent search",
      suggestion: 'Focus on what they search for, not who they are. Use "email marketing software" not "marketers who need email tools"',
    });
  } else {
    passedRules.push("No Personas");
  }

  // Rule 3: No audience descriptors
  const audienceDescriptors = [
    "interested in",
    "looking for",
    "searching for",
    "want to",
    "need to",
    "trying to",
  ];

  const hasAudienceDescriptor = audienceDescriptors.some((desc) =>
    lowerQuery.includes(desc)
  );

  if (hasAudienceDescriptor) {
    failedRules.push("No Audience Descriptors");
    issues.push({
      type: "error",
      message: "Avoid audience descriptors",
      suggestion: 'Remove phrases like "interested in" or "looking for". Just use the topic directly.',
    });
  } else {
    passedRules.push("No Audience Descriptors");
  }

  // Rule 4: No hype words
  const hypeWords = [
    "best",
    "top",
    "leading",
    "premium",
    "ultimate",
    "revolutionary",
    "cutting-edge",
    "innovative",
  ];

  const hasHypeWords = hypeWords.some((hype) => lowerQuery.includes(hype));

  if (hasHypeWords) {
    failedRules.push("No Hype Words");
    issues.push({
      type: "warning",
      message: "Avoid marketing/hype words",
      suggestion: 'Remove subjective qualifiers like "best" or "top". Use objective descriptors.',
    });
  } else {
    passedRules.push("No Hype Words");
  }

  // Rule 5: Mode-specific validation
  if (mode === "intent") {
    // Intent should be about what people SEARCH FOR
    const businessIndicators = [
      "company",
      "business",
      "enterprise",
      "corporation",
      "firm",
    ];
    const hasBusinessIndicators = businessIndicators.some((indicator) =>
      lowerQuery.includes(indicator)
    );

    if (hasBusinessIndicators) {
      failedRules.push("Intent Mode Clarity");
      issues.push({
        type: "warning",
        message: "Intent search should focus on user interests, not businesses",
        suggestion: 'Switch to B2B mode or rephrase. Intent: "email deliverability tips", B2B: "email deliverability software companies"',
      });
    } else {
      passedRules.push("Intent Mode Clarity");
    }
  } else {
    // B2B should be about what businesses DO/OFFER
    const intentIndicators = [
      "how to",
      "tips",
      "guide",
      "tutorial",
      "learn",
      "advice",
    ];
    const hasIntentIndicators = intentIndicators.some((indicator) =>
      lowerQuery.includes(indicator)
    );

    if (hasIntentIndicators) {
      failedRules.push("B2B Mode Clarity");
      issues.push({
        type: "warning",
        message: "B2B search should focus on what businesses offer, not user interests",
        suggestion: 'Switch to Intent mode or rephrase. B2B: "SaaS companies", Intent: "how to build SaaS"',
      });
    } else {
      passedRules.push("B2B Mode Clarity");
    }
  }

  // Rule 6: Specificity check
  const vagueTerms = [
    "stuff",
    "things",
    "various",
    "general",
    "misc",
    "etc",
    "anything",
  ];
  const hasVagueTerms = vagueTerms.some((term) => lowerQuery.includes(term));

  if (hasVagueTerms) {
    failedRules.push("Specificity");
    issues.push({
      type: "error",
      message: "Query too vague",
      suggestion: "Be specific about what you're looking for. Use concrete terms.",
    });
  } else {
    passedRules.push("Specificity");
  }

  // Rule 7: No questions
  const questionWords = ["what", "how", "why", "when", "where", "who", "which"];
  const startsWithQuestion = questionWords.some((q) =>
    lowerQuery.startsWith(q)
  );
  const hasQuestionMark = trimmedQuery.includes("?");

  if (startsWithQuestion || hasQuestionMark) {
    failedRules.push("No Questions");
    issues.push({
      type: "warning",
      message: "Avoid question format",
      suggestion: 'Use keywords instead of questions. "email marketing software" not "what is the best email marketing software?"',
    });
  } else {
    passedRules.push("No Questions");
  }

  // Calculate score
  const totalRules = 7;
  const passedCount = passedRules.length;
  let score = Math.round((passedCount / totalRules) * 100);

  // Bonus points for optimal length (3-6 words)
  if (wordCount >= 3 && wordCount <= 6) {
    score = Math.min(100, score + 5);
  }

  // Penalty for critical errors
  const criticalErrors = issues.filter((i) => i.type === "error").length;
  score = Math.max(0, score - criticalErrors * 5);

  return {
    score,
    issues,
    passedRules,
    failedRules,
  };
}

/**
 * Get a human-readable score description
 */
export function getScoreDescription(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Fair";
  if (score >= 40) return "Poor";
  return "Very Poor";
}

/**
 * Get score color class
 */
export function getScoreColor(score: number): string {
  if (score >= 90) return "text-green-600";
  if (score >= 75) return "text-blue-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
}

/**
 * Get star rating (1-5 stars)
 */
export function getStarRating(score: number): string {
  const stars = Math.round(score / 20);
  return "⭐".repeat(stars) + "☆".repeat(5 - stars);
}
