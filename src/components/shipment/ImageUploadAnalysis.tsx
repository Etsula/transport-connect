
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, Camera, Package, Ruler } from 'lucide-react';
import { useImageAnalysis } from '@/hooks/useImageAnalysis';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadAnalysisProps {
  shipmentId: string;
  onDimensionsDetected?: (dimensions: any) => void;
}

const ImageUploadAnalysis: React.FC<ImageUploadAnalysisProps> = ({ 
  shipmentId, 
  onDimensionsDetected 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const { analyzeImage, loading } = useImageAnalysis();
  const { toast } = useToast();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
    }
  }, [toast]);

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    const result = await analyzeImage(selectedFile, shipmentId);
    if (result) {
      setAnalysis(result);
      if (onDimensionsDetected && result.dimensions) {
        onDimensionsDetected(result.dimensions);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          AI Package Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-4">
            Upload a photo of your package for AI dimension analysis
          </p>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="max-w-xs mx-auto"
          />
        </div>

        {selectedFile && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-600">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button onClick={handleAnalyze} disabled={loading}>
                {loading ? "Analyzing..." : "Analyze"}
              </Button>
            </div>
          </div>
        )}

        {analysis && (
          <div className="bg-green-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              <h3 className="font-medium text-green-800">Analysis Results</h3>
              <Badge variant="secondary">
                {Math.round(analysis.confidence * 100)}% confidence
              </Badge>
            </div>
            
            {analysis.dimensions && (
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Length</p>
                  <p className="font-bold">{analysis.dimensions.length} {analysis.dimensions.unit}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Width</p>
                  <p className="font-bold">{analysis.dimensions.width} {analysis.dimensions.unit}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Height</p>
                  <p className="font-bold">{analysis.dimensions.height} {analysis.dimensions.unit}</p>
                </div>
              </div>
            )}

            {analysis.weight_estimate && (
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-green-600" />
                <span className="text-sm">
                  Estimated weight: <strong>{analysis.weight_estimate} kg</strong>
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploadAnalysis;
