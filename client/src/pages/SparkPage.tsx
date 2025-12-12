import { useState, useEffect } from 'react';
import { ModeSelector } from '@/components/ModeSelector';
import { QueryInput } from '@/components/QueryInput';
import { ValidationDisplay } from '@/components/ValidationDisplay';
import { AdvancedOptions } from '@/components/AdvancedOptions';
import { validateQuery, type SearchMode, type ValidationResult } from '@/lib/queryValidation';

function SparkPage() {
  // Core state
  const [mode, setMode] = useState<SearchMode>('intent');
  const [query, setQuery] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  
  // Advanced options state
  const [contextPhrases, setContextPhrases] = useState('');
  const [lens, setLens] = useState('');
  const [granularity, setGranularity] = useState('');
  
  // Real-time validation
  useEffect(() => {
    if (query.trim().length > 0) {
      const result = validateQuery(query, mode);
      setValidationResult(result);
    } else {
      setValidationResult(null);
    }
  }, [query, mode]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Spark V2
              </h1>
              <p className="text-sm text-gray-600">
                Smart Query Assistant
              </p>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Input */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Query Configuration
              </h2>
              
              <div className="space-y-6">
                <ModeSelector mode={mode} onChange={setMode} />
                
                <QueryInput
                  query={query}
                  onChange={setQuery}
                  placeholder={
                    mode === 'intent'
                      ? 'e.g., software engineers interested in AI and machine learning'
                      : 'e.g., SaaS companies with 50-200 employees in San Francisco'
                  }
                />
                
                <AdvancedOptions
                  contextPhrases={contextPhrases}
                  onContextPhrasesChange={setContextPhrases}
                  lens={lens}
                  onLensChange={setLens}
                  granularity={granularity}
                  onGranularityChange={setGranularity}
                />
              </div>
            </div>
            
            {/* Info Card */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                💡 How it works
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Choose your search mode (Intent or B2B)</li>
                <li>• Enter your query using specific keywords</li>
                <li>• Get real-time validation and quality scoring</li>
                <li>• Improve your query based on suggestions</li>
              </ul>
            </div>
          </div>
          
          {/* Right Column: Validation */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Validation Results
              </h2>
              
              <ValidationDisplay result={validationResult} />
            </div>
          </div>
        </div>
        
        {/* Footer Stats */}
        {validationResult && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {validationResult.overallScore}
                </div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {validationResult.rules.filter((r) => r.passed).length}
                </div>
                <div className="text-sm text-gray-600">Rules Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {validationResult.rules.filter((r) => !r.passed).length}
                </div>
                <div className="text-sm text-gray-600">Rules Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {validationResult.suggestions.length}
                </div>
                <div className="text-sm text-gray-600">Suggestions</div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="mt-12 pb-8 text-center text-sm text-gray-500">
        <p>Spark V2 - Built with minimal dependencies for maximum performance</p>
        <p className="mt-1">React 19 • Vite 7 • Tailwind CSS 4 • TypeScript</p>
      </footer>
    </div>
  );
}

export default SparkPage;
