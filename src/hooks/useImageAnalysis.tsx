
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

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${shipmentId}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('shipment-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Store file record in database
      const { data: fileRecord, error: fileError } = await supabase
        .from('shipment_files')
        .insert({
          shipment_id: shipmentId,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_path: uploadData.path,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (fileError) throw fileError;

      // Mock AI analysis - in production, this would call an AI service
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

      // Update file record with AI analysis
      await supabase
        .from('shipment_files')
        .update({ ai_analysis: mockAnalysis })
        .eq('id', fileRecord.id);

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
      const { data, error } = await supabase
        .from('shipment_files')
        .select('*')
        .eq('shipment_id', shipmentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
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
