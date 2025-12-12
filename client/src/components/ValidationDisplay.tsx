import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ValidationResult } from '@/lib/queryValidation';
import { getQualityLevel } from '@/lib/queryValidation';

interface ValidationDisplayProps {
  result: ValidationResult | null;
}

export function ValidationDisplay({ result }: ValidationDisplayProps) {
  if (!result) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
        Enter a query to see validation results
      </div>
    );
  }
  
  const quality = getQualityLevel(result.overallScore);
  
  return (
      <div className="space-y-4 animate-in fade-in duration-300">
      {/* Overall Score */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Query Quality Score
          </h3>
          <div
            className={cn(
              'px-3 py-1 rounded-full text-sm font-medium',
              quality.level === 'excellent' && 'bg-green-100 text-green-700',
              quality.level === 'good' && 'bg-blue-100 text-blue-700',
              quality.level === 'fair' && 'bg-yellow-100 text-yellow-700',
              quality.level === 'poor' && 'bg-red-100 text-red-700'
            )}
          >
            {quality.label}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-5xl font-bold text-gray-900">
            {result.overallScore}
          </div>
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-700 ease-out',
                  quality.level === 'excellent' && 'bg-green-500',
                  quality.level === 'good' && 'bg-blue-500',
                  quality.level === 'fair' && 'bg-yellow-500',
                  quality.level === 'poor' && 'bg-red-500'
                )}
                style={{ width: `${result.overallScore}%` }}
              />
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {result.passed ? (
                <span className="text-green-600 font-medium">
                  ✓ Query meets quality standards
                </span>
              ) : (
                <span className="text-orange-600 font-medium">
                  ⚠ Query needs improvement
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Rule Results */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Validation Rules
        </h3>
        
        <div className="space-y-3">
          {result.rules.map((rule) => (
            <div
              key={rule.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg',
                rule.passed ? 'bg-green-50' : 'bg-orange-50'
              )}
            >
              <div className="mt-0.5">
                {rule.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : rule.score >= 50 ? (
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-gray-900">{rule.name}</div>
                  <div className="text-sm font-medium text-gray-600">
                    {rule.score}/100
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-1">{rule.message}</div>
                {rule.details && (
                  <div className="text-xs text-gray-500 mt-1">{rule.details}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <div className="bg-blue-50 rounded-lg border-2 border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            💡 Suggestions
          </h3>
          <ul className="space-y-2">
            {result.suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-blue-800">
                • {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
