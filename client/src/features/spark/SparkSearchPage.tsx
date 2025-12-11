/**
 * Spark V2 - Main Search Page
 * Smart Query Assistant with quality checking and AudienceLab integration
 */

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { AdvancedOptions } from "./components/AdvancedOptions";
import { ModeSelector } from "./components/ModeSelector";
import { QueryInput } from "./components/QueryInput";
import { QueryQualityChecker } from "./components/QueryQualityChecker";
import type { Lens, SearchMode } from "./types";

export const SparkSearchPage: React.FC = () => {
  const [mode, setMode] = useState<SearchMode>("intent");
  const [query, setQuery] = useState("");
  const [contextPhrases, setContextPhrases] = useState<string[]>([]);
  const [lens, setLens] = useState<Lens>("brand");
  const [granularity, setGranularity] = useState(3);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      // TODO: Implement tRPC search call
      console.log("Searching:", {
        query,
        mode,
        contextPhrases,
        lens,
        granularity,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl space-y-6 py-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Spark V2</h1>
        <p className="text-lg text-muted-foreground">
          Smart Query Assistant with Quality Checking
        </p>
      </div>

      <Separator />

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Mode Selection */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <ModeSelector mode={mode} onChange={setMode} />
          </Card>
        </div>

        {/* Right Column - Query Input and Options */}
        <div className="space-y-4 lg:col-span-2">
          <Card className="p-6">
            <QueryInput
              value={query}
              onChange={setQuery}
              mode={mode}
              onSearch={handleSearch}
              isLoading={isSearching}
            />
          </Card>

          {query.trim() && (
            <QueryQualityChecker query={query} mode={mode} />
          )}

          <Card className="p-4">
            <AdvancedOptions
              contextPhrases={contextPhrases}
              onContextPhrasesChange={setContextPhrases}
              lens={lens}
              onLensChange={setLens}
              granularity={granularity}
              onGranularityChange={setGranularity}
            />
          </Card>
        </div>
      </div>

      {/* Results Section - TODO */}
      {isSearching && (
        <Card className="p-8 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-lg">Searching...</p>
          </div>
        </Card>
      )}
    </div>
  );
};
