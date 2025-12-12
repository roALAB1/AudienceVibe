import * as RadioGroup from '@radix-ui/react-radio-group';
import { cn } from '@/lib/utils';
import type { SearchMode } from '@/lib/queryValidation';

interface ModeSelectorProps {
  mode: SearchMode;
  onChange: (mode: SearchMode) => void;
}

export function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Search Mode
      </label>
      
      <RadioGroup.Root
        value={mode}
        onValueChange={(value) => onChange(value as SearchMode)}
        className="flex gap-4"
      >
        <RadioGroup.Item
          value="intent"
          className={cn(
            'flex-1 px-4 py-3 rounded-lg border-2 transition-all cursor-pointer',
            mode === 'intent'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5',
                mode === 'intent'
                  ? 'border-blue-500'
                  : 'border-gray-300'
              )}
            >
              {mode === 'intent' && (
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              )}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">Intent Search</div>
              <div className="text-sm text-gray-600 mt-1">
                Find people based on their interests and behaviors
              </div>
            </div>
          </div>
        </RadioGroup.Item>
        
        <RadioGroup.Item
          value="b2b"
          className={cn(
            'flex-1 px-4 py-3 rounded-lg border-2 transition-all cursor-pointer',
            mode === 'b2b'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5',
                mode === 'b2b'
                  ? 'border-blue-500'
                  : 'border-gray-300'
              )}
            >
              {mode === 'b2b' && (
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              )}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">B2B Search</div>
              <div className="text-sm text-gray-600 mt-1">
                Find companies matching specific criteria
              </div>
            </div>
          </div>
        </RadioGroup.Item>
      </RadioGroup.Root>
    </div>
  );
}
