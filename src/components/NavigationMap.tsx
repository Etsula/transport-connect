
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet with webpack/vite
// This is needed because Leaflet's default marker icons reference assets that aren't bundled
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

// Animation component for map centering
function FlyToLocation({ locations }: { locations: [number, number][] }) {
  const map = useMap();
  
  useEffect(() => {
    if (locations.length === 0) return;
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      map.flyTo(locations[currentIndex], 13, {
        animate: true,
        duration: 2
      });
      currentIndex = (currentIndex + 1) % locations.length;
    }, 5000);
    
    return () => clearInterval(interval);
  }, [map, locations]);
  
  return null;
}

interface NavigationMapProps {
  className?: string;
  showTraffic?: boolean;
}

const NavigationMap: React.FC<NavigationMapProps> = ({ className, showTraffic = true }) => {
  // Sample locations for demonstration
  const locations: [number, number][] = [
    [-1.286389, 36.817223], // Nairobi
    [0.091517, 34.767906], // Kisumu
    [-0.303099, 36.080025], // Nakuru
    [3.632364, 41.37380]  // Moyale
  ];
  
  const defaultCenter: [number, number] = [-1.286389, 36.817223];
  
  return (
    <MapContainer
      center={defaultCenter}
      zoom={6}
      className={`${className || "h-96 w-full rounded-lg shadow-lg"}`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Traffic layer - conditionally rendered */}
      {showTraffic && (
        <TileLayer
          attribution='Traffic data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tiles.osm.org/hot/{z}/{x}/{y}.png"
        />
      )}
      
      {/* Sample markers for key locations */}
      {locations.map((position, idx) => (
        <Marker key={idx} position={position}>
          <Popup>
            {idx === 0 && "Nairobi Warehouse"}
            {idx === 1 && "Kisumu Distribution Center"}
            {idx === 2 && "Nakuru Sorting Center"}
            {idx === 3 && "Moyale Border Post"}
          </Popup>
        </Marker>
      ))}
      
      {/* Animation for demonstration */}
      <FlyToLocation locations={locations} />
    </MapContainer>
  );
};

export default NavigationMap;
