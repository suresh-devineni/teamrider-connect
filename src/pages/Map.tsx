
import React, { useCallback, useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

// Default center coordinates (San Francisco)
const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194
};

const containerStyle = {
  width: '100%',
  height: '100%'
};

interface UserLocation {
  user_id: string;
  latitude: number;
  longitude: number;
  user_type: string;
}

const Map = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  // Fetch API key
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data, error } = await supabase.rpc('get_secret', {
          secret_name: 'GOOGLE_MAPS_API_KEY'
        });

        if (error) {
          console.error('Error fetching API key:', error);
          toast.error('Failed to load map');
          return;
        }

        const parsedData = JSON.parse(data);
        if (parsedData.secret) {
          setApiKey(parsedData.secret);
        } else {
          toast.error('Google Maps API key not found');
        }
      } catch (error) {
        console.error('Error processing API key:', error);
        toast.error('Failed to load map configuration');
      }
    };

    fetchApiKey();
  }, []);

  // Fetch user locations
  const { data: userLocations, isLoading: isLoadingLocations } = useQuery({
    queryKey: ['userLocations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_locations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching locations:', error);
        toast.error('Failed to load employee locations');
        throw error;
      }

      return data as UserLocation[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);

    // If we have user locations, fit the map bounds to include all markers
    if (userLocations && userLocations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      userLocations.forEach((location) => {
        bounds.extend({
          lat: Number(location.latitude),
          lng: Number(location.longitude),
        });
      });
      map.fitBounds(bounds);
    }
  }, [userLocations]);

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
              {userLocations?.map((location) => (
                <Marker
                  key={location.user_id}
                  position={{
                    lat: Number(location.latitude),
                    lng: Number(location.longitude)
                  }}
                  title={`User ${location.user_id}`}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Map;
