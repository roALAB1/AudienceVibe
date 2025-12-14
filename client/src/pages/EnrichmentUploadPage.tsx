import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { StartEnrichmentModal } from "@/components/StartEnrichmentModal";
import { Upload, X, ArrowLeftRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { parseCSV, type ParsedCSV } from "@/lib/csvParser";
import {
  detectFields,
  validateMappings,
  AVAILABLE_FIELDS,
  type FieldMapping,
} from "@/lib/fieldMapping";

export default function EnrichmentUploadPage() {
  const [, setLocation] = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<ParsedCSV | null>(null);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const createJobMutation = trpc.audienceLabAPI.enrichment.createJob.useMutation();

  const handleFileSelect = async (selectedFile: File) => {
    // Validate file type
    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    try {
      // Read file content
      const text = await selectedFile.text();
      
      // Parse CSV
      const parsed = parseCSV(text);
      
      // Show success toast
      toast.success(`Successfully processed ${parsed.rowCount.toLocaleString()} rows`);
      
      // Detect fields and create mappings
      const mappings = detectFields(parsed.columns, parsed.rows);
      
      // Update state
      setFile(selectedFile);
      setCsvData(parsed);
      setFieldMappings(mappings);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to parse CSV file');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleMappingChange = (csvColumn: string, newField: string) => {
    setFieldMappings(prev =>
      prev.map(mapping =>
        mapping.csvColumn === csvColumn
          ? { ...mapping, mappedField: newField, isAutoMapped: false }
          : mapping
      )
    );
  };

  const handleRemoveFile = () => {
    setFile(null);
    setCsvData(null);
    setFieldMappings([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitClick = () => {
    console.log('🎯 [SUBMIT] Button clicked');
    
    // Validate mappings
    const validation = validateMappings(fieldMappings);
    if (!validation.isValid) {
      console.error('❌ [VALIDATION] Invalid field mappings:', validation.errors);
      toast.error(validation.errors[0]);
      return;
    }

    if (!csvData || !file) {
      console.error('❌ [VALIDATION] No CSV file uploaded');
      toast.error('No CSV file uploaded');
      return;
    }

    // Count mapped fields
    const mappedCount = fieldMappings.filter(
      m => m.mappedField && m.mappedField !== '' && m.mappedField !== 'DO_NOT_IMPORT'
    ).length;
    
    console.log('✅ [VALIDATION] All checks passed:', {
      csvRows: csvData.rows.length,
      mappedFields: mappedCount,
      fieldMappings: fieldMappings.map(m => ({ csv: m.csvColumn, mapped: m.mappedField }))
    });

    // Show modal for enrichment name and operator
    setShowModal(true);
  };

  const handleModalSubmit = async (name: string, operator: "OR" | "AND") => {
    console.log('handleModalSubmit called with:', { name, operator });
    setShowModal(false);

    if (!csvData || !file) {
      console.error('No CSV data or file');
      toast.error('No CSV file uploaded');
      return;
    }

    try {
      // Transform CSV data + mappings to API format
      const mappedColumns = fieldMappings
        .filter(m => m.mappedField && m.mappedField !== '' && m.mappedField !== 'DO_NOT_IMPORT')
        .map(m => m.mappedField as string); // Keep UPPERCASE for columns

      const records = csvData.rows.map(row => {
        const record: any = {};
        fieldMappings.forEach(mapping => {
          if (mapping.mappedField && mapping.mappedField !== '' && mapping.mappedField !== 'DO_NOT_IMPORT') {
            // Convert UPPERCASE field to lowercase for records
            const apiField = mapping.mappedField.toLowerCase();
            const value = row[mapping.csvColumn];
            if (value && value.trim() !== '') {
              record[apiField] = value.trim();
            }
          }
        });
        return record;
      });

      // Create enrichment job
      console.log('Calling API with:', { name, operator, recordCount: records.length, columns: mappedColumns });
      const result = await createJobMutation.mutateAsync({
        name,
        records,
        operator,
        columns: mappedColumns,
      });
      console.log('API response:', result);

      toast.success('Data uploaded successfully and queued for enrichment');
      setLocation('/enrichments');
    } catch (error: any) {
      console.error('❌ [API ERROR] Failed to create enrichment job:', error);
      
      // Extract detailed error message
      let errorMessage = 'Failed to create enrichment job';
      if (error.message) {
        errorMessage = error.message;
      }
      if (error.data?.message) {
        errorMessage = error.data.message;
      }
      
      // Log full error for debugging
      console.error('Full error details:', {
        message: error.message,
        data: error.data,
        stack: error.stack
      });
      
      toast.error(errorMessage);
    }
  };

  const isValid = csvData && validateMappings(fieldMappings).isValid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm mb-6">
        <div className="container mx-auto px-6 py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <a href="/" className="hover:text-gray-900">Home</a>
            <span>›</span>
            <a href="/enrichments" className="hover:text-gray-900">Enrichment</a>
            <span>›</span>
            <span className="text-gray-900">Upload</span>
          </nav>
          
          <h1 className="text-2xl font-bold text-gray-900">Enrichment</h1>
        </div>
      </header>

      <main className="container mx-auto px-6">
        {/* Upload Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Upload CSV File</h2>
          </div>

          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
                transition-colors
                ${isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }
              `}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-700 font-medium mb-1">
                Click to upload or drag and drop a file
              </p>
              <p className="text-sm text-gray-500">CSV files only</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-900">{file.name}</span>
              <button
                onClick={handleRemoveFile}
                className="text-red-600 hover:text-red-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Field Mapping Section */}
        {csvData && fieldMappings.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            {/* Section Header with Bulk Action */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Map CSV Columns to Fields</h2>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setFieldMappings(prev =>
                      prev.map(mapping => ({ ...mapping, mappedField: 'DO_NOT_IMPORT', isAutoMapped: false }))
                    );
                    toast.success('All fields set to "Do Not Import"');
                  }}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  DO NOT IMPORT ALL
                </Button>
                <Button
                  onClick={() => {
                    if (!csvData) return;
                    const autoMapped = detectFields(csvData.columns, csvData.rows);
                    setFieldMappings(autoMapped);
                    const mappedCount = autoMapped.filter(m => m.isAutoMapped).length;
                    toast.success(`${mappedCount} field(s) auto-mapped`);
                  }}
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  AUTO MAP ALL
                </Button>
              </div>
            </div>

            {/* Column Headers */}
            <div className="grid grid-cols-3 gap-6 pb-3 border-b border-gray-200 font-medium text-gray-700 text-sm">
              <div>Column Name</div>
              <div>Select Fields</div>
              <div>Samples</div>
            </div>

            {/* Mapping Rows */}
            <div className="divide-y divide-gray-200">
              {fieldMappings.map(mapping => (
                <FieldMappingRow
                  key={mapping.csvColumn}
                  mapping={mapping}
                  onMappingChange={handleMappingChange}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Bar */}
      {csvData && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Detected {csvData.rowCount.toLocaleString()} rows
            </div>
            <Button
              onClick={handleSubmitClick}
              disabled={!isValid}
              className="bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Submit Enrichment
            </Button>
          </div>
        </div>
      )}

      {/* Start Enrichment Modal */}
      <StartEnrichmentModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        defaultName={file?.name.replace('.csv', '') || ''}
      />
    </div>
  );
}

interface FieldMappingRowProps {
  mapping: FieldMapping;
  onMappingChange: (csvColumn: string, newField: string) => void;
}

function FieldMappingRow({ mapping, onMappingChange }: FieldMappingRowProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFields = AVAILABLE_FIELDS.filter(field =>
    field.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-3 gap-6 py-4">
      {/* Column 1: Column Name */}
      <div className="flex items-start gap-2">
        {mapping.isAutoMapped && (
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
        )}
        <div>
          <div className="font-medium text-gray-900">{mapping.csvColumn}</div>
          <div className="text-sm text-gray-600">{mapping.completeness}% complete</div>
        </div>
      </div>

      {/* Column 2: Select Fields */}
      <div>
        <Select
          value={mapping.mappedField || ''}
          onValueChange={(value) => onMappingChange(mapping.csvColumn, value)}
        >
          <SelectTrigger className="border-2 border-yellow-400 bg-yellow-50">
            <SelectValue placeholder="Select field..." />
          </SelectTrigger>
          <SelectContent className="z-[100]">
            <div className="p-2 sticky top-0 bg-white border-b border-gray-200">
              <Input
                placeholder="Search fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-2"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <SelectItem value="DO_NOT_IMPORT" className="font-medium text-gray-500 hover:bg-gray-100">
              Do Not Import
            </SelectItem>
            {filteredFields.map(field => (
              <SelectItem key={field.value} value={field.value} className="hover:bg-blue-50">
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Column 3: Samples */}
      <div className="text-sm text-gray-700 space-y-1">
        {mapping.samples.map((sample, i) => (
          <div key={i} className="truncate">{sample}</div>
        ))}
      </div>
    </div>
  );
}
