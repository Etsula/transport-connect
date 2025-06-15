
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Map, Download, Trash2, HardDrive, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OfflineMap {
  id: string;
  region_name: string;
  bounds_north: number;
  bounds_south: number;
  bounds_east: number;
  bounds_west: number;
  downloaded_at: string;
  last_accessed: string;
  file_size_mb: number;
  is_active: boolean;
}

const OfflineMapManager: React.FC = () => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const [maps, setMaps] = useState<OfflineMap[]>([]);
  const [regionName, setRegionName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOfflineMaps();
  }, [userData.id]);

  const fetchOfflineMaps = async () => {
    if (!userData.id) return;

    try {
      const { data, error } = await supabase
        .from('offline_maps')
        .select('*')
        .eq('user_id', userData.id)
        .order('downloaded_at', { ascending: false });

      if (error) throw error;
      setMaps(data || []);
    } catch (error) {
      console.error('Error fetching offline maps:', error);
    }
  };

  const downloadMap = async () => {
    if (!userData.id || !regionName.trim()) return;

    try {
      setLoading(true);

      // Mock map download - in production this would download actual map tiles
      const mockBounds = {
        north: 51.5074 + Math.random() * 0.1,
        south: 51.5074 - Math.random() * 0.1,
        east: -0.1278 + Math.random() * 0.1,
        west: -0.1278 - Math.random() * 0.1
      };

      const { error } = await supabase
        .from('offline_maps')
        .insert({
          user_id: userData.id,
          region_name: regionName,
          bounds_north: mockBounds.north,
          bounds_south: mockBounds.south,
          bounds_east: mockBounds.east,
          bounds_west: mockBounds.west,
          file_size_mb: Math.round(Math.random() * 100 + 10),
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Map downloaded",
        description: `Offline map for ${regionName} is now available`
      });

      setRegionName('');
      fetchOfflineMaps();
    } catch (error) {
      console.error('Error downloading map:', error);
      toast({
        title: "Download failed",
        description: "Failed to download offline map",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteMap = async (mapId: string) => {
    try {
      const { error } = await supabase
        .from('offline_maps')
        .delete()
        .eq('id', mapId);

      if (error) throw error;

      toast({
        title: "Map deleted",
        description: "Offline map has been removed"
      });

      fetchOfflineMaps();
    } catch (error) {
      console.error('Error deleting map:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete offline map",
        variant: "destructive"
      });
    }
  };

  const updateLastAccessed = async (mapId: string) => {
    try {
      await supabase
        .from('offline_maps')
        .update({ last_accessed: new Date().toISOString() })
        .eq('id', mapId);
    } catch (error) {
      console.error('Error updating last accessed:', error);
    }
  };

  const totalSizeMB = maps.reduce((sum, map) => sum + (map.file_size_mb || 0), 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Offline Map Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Storage Usage</span>
            </div>
            <p className="text-sm text-gray-600">
              {maps.length} maps downloaded • {totalSizeMB.toFixed(1)} MB used
            </p>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Enter region name (e.g., London, Manchester)"
              value={regionName}
              onChange={(e) => setRegionName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && downloadMap()}
            />
            <Button 
              onClick={downloadMap} 
              disabled={loading || !regionName.trim()}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Downloaded Maps</CardTitle>
        </CardHeader>
        <CardContent>
          {maps.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No offline maps downloaded</p>
          ) : (
            <div className="space-y-3">
              {maps.map((map) => (
                <div key={map.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Map className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{map.region_name}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <HardDrive className="h-3 w-3" />
                          {map.file_size_mb} MB
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(map.downloaded_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={map.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {map.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateLastAccessed(map.id)}
                    >
                      Use Map
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteMap(map.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OfflineMapManager;
