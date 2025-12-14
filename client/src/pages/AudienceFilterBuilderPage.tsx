import { useState } from 'react';
import { useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { FileText, Eye } from 'lucide-react';
import type { FilterCategory } from '@/types/audience-filters';

// Filter category configuration
const FILTER_CATEGORIES: Array<{
  id: FilterCategory;
  label: string;
  icon: string;
}> = [
  { id: 'intent', label: 'Intent', icon: '🎯' },
  { id: 'date', label: 'Date', icon: '📅' },
  { id: 'business', label: 'Business', icon: '💼' },
  { id: 'financial', label: 'Financial', icon: '💰' },
  { id: 'personal', label: 'Personal', icon: '👤' },
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { id: 'housing', label: 'Housing', icon: '🏠' },
  { id: 'location', label: 'Location', icon: '📍' },
  { id: 'contact', label: 'Contact', icon: '📧' },
];

export default function AudienceFilterBuilderPage() {
  const params = useParams<{ id: string }>();
  const [activeCategory, setActiveCategory] = useState<FilterCategory | null>(null);
  const [audienceName] = useState('Test Audience Research'); // TODO: Fetch from API

  const handlePreview = () => {
    // TODO: Implement preview functionality
    console.log('Preview audience');
  };

  const handleGenerateAudience = () => {
    // TODO: Implement generate audience functionality
    console.log('Generate audience');
  };

  const handleCategoryClick = (category: FilterCategory) => {
    setActiveCategory(category);
    // TODO: Open filter modal for this category
    console.log('Open filter modal for:', category);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{audienceName}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Audience Filters
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handlePreview}
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Button
                onClick={handleGenerateAudience}
                className="gap-2"
              >
                Generate Audience
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Category Tabs */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto">
            {FILTER_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium
                  border-b-2 transition-colors whitespace-nowrap
                  ${
                    activeCategory === category.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  }
                `}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Empty State */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Preview Your Audience
          </h2>
          <p className="text-muted-foreground mb-6">
            Customize your filters to build your audience. Get started by
            building your core target audience.
          </p>
          <Button
            size="lg"
            onClick={() => handleCategoryClick('intent')}
          >
            Build Audience
          </Button>
        </div>
      </div>

      {/* TODO: Add filter modals */}
      {/* {activeCategory === 'intent' && <IntentFilterModal ... />} */}
      {/* {activeCategory === 'business' && <BusinessFilterModal ... />} */}
      {/* etc. */}
    </div>
  );
}
