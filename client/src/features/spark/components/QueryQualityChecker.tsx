/**
 * Spark V2 - QueryQualityChecker Component
 * Real-time query validation with 7 rules and scoring
 */

import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

import type { QueryQualityResult, SearchMode } from "../types";
import {
  calculateQualityScore,
  getScoreColor,
  getScoreDescription,
  getStarRating,
} from "../utils/queryValidation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";


interface QueryQualityCheckerProps {
  query: string;
  mode: SearchMode;
  className?: string;
}

export const QueryQualityChecker: React.FC<QueryQualityCheckerProps> = ({
  query,
  mode,
  className,
}) => {
  const [result, setResult] = useState<QueryQualityResult | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResult(null);
      return;
    }

    // Debounce validation
    const timer = setTimeout(() => {
      const qualityResult = calculateQualityScore(query, mode);
      setResult(qualityResult);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, mode]);

  if (!result) return null;

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
  };

  const scoreDescription = getScoreDescription(result.score);
  const starRating = getStarRating(result.score);

  return (
    <div className={className}>
      <Accordion type="single" collapsible defaultValue="quality">
        <AccordionItem value="quality" className="border-none">
          <AccordionTrigger className="rounded-lg bg-muted/50 px-4 py-3 hover:bg-muted hover:no-underline">
            <div className="flex items-center gap-3">
              <span className="text-base font-semibold">Query Quality:</span>
              <Badge
                variant={result.score >= 75 ? "default" : "destructive"}
                className={cn("text-sm", getScoreColor(result.score))}
              >
                {result.score}/100
              </Badge>
              <span className="text-sm">{starRating}</span>
              <span className="text-sm text-muted-foreground">
                ({scoreDescription})
              </span>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-4 pt-4">
            <div className="space-y-3">
              {/* Passed Rules */}
              {result.passedRules.length > 0 && (
                <div className="rounded-lg bg-green-50 p-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-green-800">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Passed Rules ({result.passedRules.length}/7)</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {result.passedRules.map((rule) => (
                      <Badge
                        key={rule}
                        variant="outline"
                        className="border-green-300 bg-white text-green-700"
                      >
                        ✓ {rule}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Issues */}
              {result.issues.length > 0 ? (
                <div className="space-y-2">
                  {result.issues.map((issue, index) => (
                    <Alert
                      key={index}
                      variant={issue.type === "error" ? "destructive" : "default"}
                      className={cn(
                        issue.type === "warning" && "border-yellow-300 bg-yellow-50",
                        issue.type === "info" && "border-blue-300 bg-blue-50"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {getIssueIcon(issue.type)}
                        <div className="flex-1">
                          <p className="font-medium">{issue.message}</p>
                          <AlertDescription className="mt-1">
                            <span className="font-medium">💡 Suggestion:</span>{" "}
                            {issue.suggestion}
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              ) : (
                <Alert className="border-green-300 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Excellent query!</strong> All validation rules
                    passed. Ready for high-quality results.
                  </AlertDescription>
                </Alert>
              )}

              {/* Score Breakdown */}
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-sm font-medium">Score Breakdown:</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Rules Passed:</span>
                    <span className="ml-2 font-medium text-green-600">
                      {result.passedRules.length}/7
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Issues Found:</span>
                    <span className="ml-2 font-medium text-red-600">
                      {result.issues.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Errors:</span>
                    <span className="ml-2 font-medium">
                      {result.issues.filter((i) => i.type === "error").length}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Warnings:</span>
                    <span className="ml-2 font-medium">
                      {result.issues.filter((i) => i.type === "warning").length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
