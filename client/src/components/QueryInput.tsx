import { cn } from '@/lib/utils';

interface QueryInputProps {
  query: string;
  onChange: (query: string) => void;
  placeholder?: string;
}

export function QueryInput({ query, onChange, placeholder }: QueryInputProps) {
  const charCount = query.length;
  const wordCount = query.trim().split(/\s+/).filter(Boolean).length;
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Query
      </label>
      
      <textarea
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Enter your search query...'}
        rows={4}
        className={cn(
          'w-full px-4 py-3 rounded-lg border-2 border-gray-200',
          'focus:border-blue-500 focus:outline-none',
          'resize-none transition-colors',
          'placeholder:text-gray-400'
        )}
      />
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex gap-4">
          <span>
            <span className="font-medium">{charCount}</span> characters
          </span>
          <span>
            <span className="font-medium">{wordCount}</span> words
          </span>
        </div>
        
        <div className="text-xs">
          {charCount < 10 && (
            <span className="text-red-600">Minimum 10 characters</span>
          )}
          {charCount >= 10 && charCount <= 500 && (
            <span className="text-green-600">✓ Good length</span>
          )}
          {charCount > 500 && (
            <span className="text-orange-600">Maximum 500 characters</span>
          )}
        </div>
      </div>
    </div>
  );
}
