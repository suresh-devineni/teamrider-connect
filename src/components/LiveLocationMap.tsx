
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useMapsAutocomplete } from "@/hooks/useMapsAutocomplete";
import { supabase } from "@/lib/supabase";
import { MapPin, Car } from "lucide-react";

type Location = {
  user_id: string;
  latitude: number;
  longitude: number;
  user_type: 'driver' | 'rider';
};

interface LiveLocationMapProps {
  rideId: number;
  initialCenter: {
    lat: number;
    lng: number;
  };
}

export const LiveLocationMap = ({ rideId, initialCenter }: LiveLocationMapProps) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const { isLoaded, loadError } = useMapsAutocomplete();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  useEffect(() => {
    // Subscribe to location updates
    const channel = supabase
      .channel('location-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_locations',
          filter: `ride_id=eq.${rideId}`,
        },
        (payload: any) => {
          if (payload.new) {
            setLocations(current => {
              const others = current.filter(loc => loc.user_id !== payload.new.user_id);
              return [...others, payload.new as Location];
            });
          }
        }
      )
      .subscribe();

    // Fetch initial locations
    const fetchLocations = async () => {
      const { data, error } = await supabase
        .from('user_locations')
        .select('*')
        .eq('ride_id', rideId);

      if (error) {
        console.error('Error fetching locations:', error);
        toast.error('Failed to fetch locations');
        return;
      }

      setLocations(data as Location[]);
    };

    fetchLocations();

    // Start watching current user's location
    if ('geolocation' in navigator) {
      const id = navigator.geolocation.watchPosition(
        async (position) => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          // Get user type (driver or rider)
          const { data: ride } = await supabase
            .from('rides')
            .select('driver_id')
            .eq('id', rideId)
            .single();

          const userType = ride?.driver_id === user.id ? 'driver' : 'rider';

          // Update location in database
          const { error } = await supabase
            .from('user_locations')
            .upsert({
              user_id: user.id,
              ride_id: rideId,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              user_type: userType
            }, {
              onConflict: 'user_id,ride_id'
            });

          if (error) {
            console.error('Error updating location:', error);
            toast.error('Failed to update location');
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Failed to get location');
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000
        }
      );

      setWatchId(id);
    } else {
      toast.error('Geolocation is not supported by your browser');
    }

    // Cleanup
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      supabase.removeChannel(channel);
    };
  }, [rideId]);

  if (loadError) {
    return <div className="text-red-500">Error loading map</div>;
  }

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <Card className="w-full h-[300px] mt-4">
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "100%",
          borderRadius: "0.5rem"
        }}
        zoom={14}
        center={initialCenter}
        onLoad={setMap}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {locations.map((location) => (
          <Marker
            key={location.user_id}
            position={{
              lat: Number(location.latitude),
              lng: Number(location.longitude)
            }}
            icon={{
              url: `data:image/svg+xml,${encodeURIComponent(
                location.user_type === 'driver' 
                  ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.3 2.8c-.3.6-.3 1.3 0 1.9.3.5.8.9 1.4.9h1.3v1c0 1.1.9 2 2 2h1"/><path d="M9 17h6"/><path d="M17 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M5 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/></svg>'
                  : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'
              )}`,
              scaledSize: new google.maps.Size(32, 32),
            }}
          />
        ))}
      </GoogleMap>
    </Card>
  );
};
