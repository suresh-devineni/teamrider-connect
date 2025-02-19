
import React, { useCallback, useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// Default center coordinates (San Francisco)
const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194
};

const containerStyle = {
  width: '100%',
  height: '100%'
};

const Map = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchApiKey = async () => {
      const { data: { secret }, error } = await supabase.rpc('get_secret', {
        secret_name: 'GOOGLE_MAPS_API_KEY'
      });

      if (error) {
        console.error('Error fetching API key:', error);
        toast.error('Failed to load map');
        return;
      }

      if (secret) {
        setApiKey(secret);
      }
    };

    fetchApiKey();
  }, []);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <main className="pt-24 px-4 pb-20">
          <Card className="p-6 h-[calc(100vh-250px)] flex items-center justify-center">
            <p>Loading map...</p>
          </Card>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="pt-24 px-4 pb-20">
        <Card className="p-6 h-[calc(100vh-250px)]">
          <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={defaultCenter}
              zoom={13}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              <Marker position={defaultCenter} />
            </GoogleMap>
          </LoadScript>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Map;
