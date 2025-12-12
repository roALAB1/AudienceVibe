import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AdvancedOptionsProps {
  contextPhrases: string;
  onContextPhrasesChange: (value: string) => void;
  lens: string;
  onLensChange: (value: string) => void;
  granularity: string;
  onGranularityChange: (value: string) => void;
}

export function AdvancedOptions({
  contextPhrases,
  onContextPhrasesChange,
  lens,
  onLensChange,
  granularity,
  onGranularityChange,
}: AdvancedOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
      <Collapsible.Trigger
        className={cn(
          'w-full flex items-center justify-between',
          'px-4 py-3 rounded-lg border-2 border-gray-200',
          'bg-white hover:bg-gray-50 transition-colors',
          'text-left font-medium text-gray-900'
        )}
      >
        <span>Advanced Options</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </Collapsible.Trigger>
      
      <Collapsible.Content className="mt-4 space-y-4">
        {/* Context Phrases */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Context Phrases
            <span className="text-gray-500 font-normal ml-2">(Optional)</span>
          </label>
          <input
            type="text"
            value={contextPhrases}
            onChange={(e) => onContextPhrasesChange(e.target.value)}
            placeholder="e.g., software engineer, product manager"
            className={cn(
              'w-full px-4 py-2 rounded-lg border-2 border-gray-200',
              'focus:border-blue-500 focus:outline-none',
              'transition-colors placeholder:text-gray-400'
            )}
          />
          <p className="text-xs text-gray-500">
            Additional context to refine your search
          </p>
        </div>
        
        {/* Lens */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Lens
            <span className="text-gray-500 font-normal ml-2">(Optional)</span>
          </label>
          <select
            value={lens}
            onChange={(e) => onLensChange(e.target.value)}
            className={cn(
              'w-full px-4 py-2 rounded-lg border-2 border-gray-200',
              'focus:border-blue-500 focus:outline-none',
              'transition-colors bg-white'
            )}
          >
            <option value="">Default</option>
            <option value="professional">Professional</option>
            <option value="personal">Personal</option>
            <option value="academic">Academic</option>
            <option value="social">Social</option>
          </select>
          <p className="text-xs text-gray-500">
            Perspective or focus for the search
          </p>
        </div>
        
        {/* Granularity */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Granularity
            <span className="text-gray-500 font-normal ml-2">(Optional)</span>
          </label>
          <select
            value={granularity}
            onChange={(e) => onGranularityChange(e.target.value)}
            className={cn(
              'w-full px-4 py-2 rounded-lg border-2 border-gray-200',
              'focus:border-blue-500 focus:outline-none',
              'transition-colors bg-white'
            )}
          >
            <option value="">Default</option>
            <option value="broad">Broad</option>
            <option value="moderate">Moderate</option>
            <option value="specific">Specific</option>
            <option value="precise">Precise</option>
          </select>
          <p className="text-xs text-gray-500">
            Level of detail in search results
          </p>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
