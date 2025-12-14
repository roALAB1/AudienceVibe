import { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import type {
  FilterCategory,
  AudienceFilters,
  BusinessFilters,
  LocationFilters,
  IntentFilters,
  ContactFilters,
  PersonalFilters,
  FinancialFilters,
  FamilyFilters,
  HousingFilters,
} from '@/types/audience-filters';

// Import all filter modals
import BusinessFiltersModal from '@/components/audiences/BusinessFiltersModal';
import LocationFiltersModal from '@/components/audiences/LocationFiltersModal';
import IntentFiltersModal from '@/components/audiences/IntentFiltersModal';
import ContactFiltersModal from '@/components/audiences/ContactFiltersModal';
import PersonalFiltersModal from '@/components/audiences/PersonalFiltersModal';
import FinancialFiltersModal from '@/components/audiences/FinancialFiltersModal';
import FamilyFiltersModal from '@/components/audiences/FamilyFiltersModal';
import HousingFiltersModal from '@/components/audiences/HousingFiltersModal';

// Filter category configuration
const FILTER_CATEGORIES: Array<{
  id: FilterCategory;
  label: string;
  icon: string;
}> = [
  { id: 'intent', label: 'Intent', icon: '🎯' },
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
  const [, navigate] = useLocation();
  
  const [activeCategory, setActiveCategory] = useState<FilterCategory | null>(null);
  const [audienceName] = useState('Vibe Code Audience Builder');
  
  // State for all filters
  const [filters, setFilters] = useState<AudienceFilters>({});

  // Helper to count active filters for a category
  const getFilterCount = (category: FilterCategory): number => {
    const categoryFilters = filters[category];
    if (!categoryFilters) return 0;

    switch (category) {
      case 'business':
        const businessFilters = categoryFilters as BusinessFilters;
        return Object.values(businessFilters).filter((arr) => arr && arr.length > 0).length;
      
      case 'location':
        const locationFilters = categoryFilters as LocationFilters;
        return (
          (locationFilters.cities?.length || 0) +
          (locationFilters.states?.length || 0) +
          (locationFilters.zipCodes?.length || 0)
        );
      
      case 'intent':
        return 1; // Intent always counts as 1 if configured
      
      case 'contact':
        const contactFilters = categoryFilters as ContactFilters;
        return Object.values(contactFilters).filter((v) => v === true).length;
      
      case 'personal':
        const personalFilters = categoryFilters as PersonalFilters;
        return 1 + (personalFilters.filters?.length || 0);
      
      case 'financial':
        const financialFilters = categoryFilters as FinancialFilters;
        return financialFilters.filters?.length || 0;
      
      case 'family':
        const familyFilters = categoryFilters as FamilyFilters;
        return familyFilters.filters?.length || 0;
      
      case 'housing':
        const housingFilters = categoryFilters as HousingFilters;
        return housingFilters.filters?.length || 0;
      
      default:
        return 0;
    }
  };

  // Get total filter count
  const totalFilterCount = FILTER_CATEGORIES.reduce(
    (sum, cat) => sum + getFilterCount(cat.id),
    0
  );

  const handleCategoryClick = (category: FilterCategory) => {
    setActiveCategory(category);
  };

  const handleClearFilters = (category: FilterCategory) => {
    setFilters({
      ...filters,
      [category]: undefined,
    });
    toast.success(`${category} filters cleared`);
  };

  const handleClearAllFilters = () => {
    setFilters({});
    toast.success('All filters cleared');
  };

  const handlePreview = () => {
    if (totalFilterCount === 0) {
      toast.error('Please add at least one filter to preview');
      return;
    }
    
    // TODO: Implement preview API call
    toast.info('Preview functionality coming soon');
    console.log('Preview filters:', filters);
  };

  const handleGenerateAudience = () => {
    if (totalFilterCount === 0) {
      toast.error('Please add at least one filter to generate audience');
      return;
    }

    // TODO: Implement generate audience API call
    toast.success('Generating audience...');
    console.log('Generate audience with filters:', filters);
    
    // Navigate back to audiences page after generation
    setTimeout(() => {
      navigate('/audiences');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                {audienceName}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Build custom audiences with advanced filters • {totalFilterCount} filters active
              </p>
            </div>
            <div className="flex items-center gap-3">
              {totalFilterCount > 0 && (
                <Button
                  variant="ghost"
                  onClick={handleClearAllFilters}
                  className="text-destructive hover:text-destructive"
                >
                  Clear All
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handlePreview}
                className="gap-2"
                disabled={totalFilterCount === 0}
              >
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Button
                onClick={handleGenerateAudience}
                className="gap-2"
                disabled={totalFilterCount === 0}
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
            {FILTER_CATEGORIES.map((category) => {
              const count = getFilterCount(category.id);
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium
                    border-b-2 transition-colors whitespace-nowrap relative
                    ${
                      activeCategory === category.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                    }
                  `}
                >
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                  {count > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5">
                      {count}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {totalFilterCount === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-16">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Build Your Custom Audience
            </h2>
            <p className="text-muted-foreground mb-6">
              Select filter categories above to define your target audience. Combine multiple
              filters for precise targeting.
            </p>
            <Button
              size="lg"
              onClick={() => handleCategoryClick('intent')}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Start with Intent Filters
            </Button>
          </div>
        ) : (
          /* Active Filters Display */
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Active Filters</h3>
              <div className="grid gap-4">
                {FILTER_CATEGORIES.map((category) => {
                  const count = getFilterCount(category.id);
                  if (count === 0) return null;

                  return (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-card"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <p className="font-medium">{category.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {count} filter{count !== 1 ? 's' : ''} active
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCategoryClick(category.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleClearFilters(category.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add More Filters */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Add More Filters</h3>
              <div className="flex flex-wrap gap-2">
                {FILTER_CATEGORIES.map((category) => {
                  const count = getFilterCount(category.id);
                  if (count > 0) return null;

                  return (
                    <Button
                      key={category.id}
                      variant="outline"
                      onClick={() => handleCategoryClick(category.id)}
                      className="gap-2"
                    >
                      <span>{category.icon}</span>
                      <span>{category.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Modals */}
      <BusinessFiltersModal
        open={activeCategory === 'business'}
        onOpenChange={(open) => !open && setActiveCategory(null)}
        initialFilters={filters.business}
        onSave={(businessFilters) => setFilters({ ...filters, business: businessFilters })}
      />

      <LocationFiltersModal
        open={activeCategory === 'location'}
        onOpenChange={(open) => !open && setActiveCategory(null)}
        initialFilters={filters.location}
        onSave={(locationFilters) => setFilters({ ...filters, location: locationFilters })}
      />

      <IntentFiltersModal
        open={activeCategory === 'intent'}
        onOpenChange={(open) => !open && setActiveCategory(null)}
        initialFilters={filters.intent}
        onSave={(intentFilters) => setFilters({ ...filters, intent: intentFilters })}
      />

      <ContactFiltersModal
        open={activeCategory === 'contact'}
        onOpenChange={(open) => !open && setActiveCategory(null)}
        initialFilters={filters.contact}
        onSave={(contactFilters) => setFilters({ ...filters, contact: contactFilters })}
      />

      <PersonalFiltersModal
        open={activeCategory === 'personal'}
        onOpenChange={(open) => !open && setActiveCategory(null)}
        initialFilters={filters.personal}
        onSave={(personalFilters) => setFilters({ ...filters, personal: personalFilters })}
      />

      <FinancialFiltersModal
        open={activeCategory === 'financial'}
        onOpenChange={(open) => !open && setActiveCategory(null)}
        initialFilters={filters.financial}
        onSave={(financialFilters) => setFilters({ ...filters, financial: financialFilters })}
      />

      <FamilyFiltersModal
        open={activeCategory === 'family'}
        onOpenChange={(open) => !open && setActiveCategory(null)}
        initialFilters={filters.family}
        onSave={(familyFilters) => setFilters({ ...filters, family: familyFilters })}
      />

      <HousingFiltersModal
        open={activeCategory === 'housing'}
        onOpenChange={(open) => !open && setActiveCategory(null)}
        initialFilters={filters.housing}
        onSave={(housingFilters) => setFilters({ ...filters, housing: housingFilters })}
      />
    </div>
  );
}
