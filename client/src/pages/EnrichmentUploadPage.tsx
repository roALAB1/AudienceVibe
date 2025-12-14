import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/**
 * Enrichment Upload Page - Simplified to match AudienceLab exactly
 * 
 * Features:
 * - Simple drag-and-drop CSV upload
 * - No form fields, no wizard
 * - Auto-generate enrichment name from timestamp
 * - Submit button (disabled until file selected)
 */
export default function EnrichmentUploadPage() {
  const [, setLocation] = useLocation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const createEnrichmentMutation = trpc.audienceLabAPI.enrichment.createJob.useMutation({
    onSuccess: () => {
      toast.success("Enrichment job created successfully");
      setLocation("/enrichments");
    },
    onError: (error) => {
      toast.error("Failed to create enrichment", {
        description: error.message,
      });
    },
  });

  const handleFileSelect = (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast.error("Please upload a CSV file");
      return;
    }
    setSelectedFile(file);
    toast.success(`Selected: ${file.name}`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,text/csv";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    };
    input.click();
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please select a CSV file");
      return;
    }

    // Auto-generate name from timestamp (matching AudienceLab format)
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
    const enrichmentName = `Enrichment_${timestamp}`;

    // Read file content
    const reader = new FileReader();
    reader.onload = async (e) => {
      const csvContent = e.target?.result as string;
      
      try {
        // Create enrichment job via API
        await createEnrichmentMutation.mutateAsync({
          name: enrichmentName,
          csvData: csvContent,
        });
      } catch (error) {
        // Error handled by mutation
      }
    };
    reader.readAsText(selectedFile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Enrichment</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Upload CSV File</h3>
            
            {/* Drag and Drop Zone */}
            <div
              onClick={handleClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
                transition-colors
                ${isDragging 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }
              `}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                <span className="text-blue-600 font-medium">Click to upload</span>
                {" "}or drag and drop a file
              </p>
              {selectedFile && (
                <p className="mt-4 text-sm text-green-600 font-medium">
                  ✓ {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={!selectedFile || createEnrichmentMutation.isPending}
                className="min-w-[200px]"
              >
                {createEnrichmentMutation.isPending ? "Submitting..." : "Submit Enrichment"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
