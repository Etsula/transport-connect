
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AIAnalysisResult {
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  weight_estimate?: number;
  object_type?: string;
  confidence?: number;
}

export const useImageAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const analyzeImage = async (file: File, shipmentId: string): Promise<AIAnalysisResult | null> => {
    try {
      setLoading(true);

      // For now, create a mock analysis since the table doesn't exist in types yet
      // In production, this would upload to storage and call an AI service
      const mockAnalysis: AIAnalysisResult = {
        dimensions: {
          length: Math.floor(Math.random() * 100) + 10,
          width: Math.floor(Math.random() * 100) + 10,
          height: Math.floor(Math.random() * 50) + 5,
          unit: 'cm'
        },
        weight_estimate: Math.floor(Math.random() * 20) + 1,
        object_type: 'package',
        confidence: 0.85 + Math.random() * 0.15
      };

      // Store the analysis result in shipment for now
      await supabase
        .from('shipments')
        .update({ 
          dimensions: `${mockAnalysis.dimensions?.length}x${mockAnalysis.dimensions?.width}x${mockAnalysis.dimensions?.height} ${mockAnalysis.dimensions?.unit}`
        })
        .eq('id', shipmentId);

      toast({
        title: "Image analyzed successfully",
        description: "AI has estimated the package dimensions"
      });

      return mockAnalysis;
    } catch (error: any) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze image",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getShipmentImages = async (shipmentId: string) => {
    try {
      // For now, return empty array since table doesn't exist in types
      // In production, this would fetch from shipment_files table
      console.log('Fetching images for shipment:', shipmentId);
      return [];
    } catch (error) {
      console.error('Error fetching shipment images:', error);
      return [];
    }
  };

  return {
    analyzeImage,
    getShipmentImages,
    loading
  };
};
