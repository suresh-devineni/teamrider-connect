
import React from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { Card } from '@/components/ui/card';
import { useMapsAutocomplete } from '@/hooks/useMapsAutocomplete';
import { toast } from 'sonner';

interface Location {
  lat: number;
  lng: number;
  label: string;
}

interface LocationPreviewProps {
  homeLocation?: Location;
  officeLocation?: Location;
}

const LocationPreview = ({ homeLocation, officeLocation }: LocationPreviewProps) => {
  const [directions, setDirections] = React.useState<google.maps.DirectionsResult | null>(null);
  const { isLoaded, loadError } = useMapsAutocomplete();
  const [distance, setDistance] = React.useState<string>('');

  React.useEffect(() => {
    if (isLoaded && homeLocation && officeLocation) {
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin: { lat: homeLocation.lat, lng: homeLocation.lng },
          destination: { lat: officeLocation.lat, lng: officeLocation.lng },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK') {
            setDirections(result);
            if (result?.routes[0]?.legs[0]?.distance?.text) {
              setDistance(result.routes[0].legs[0].distance.text);
            }
          } else {
            toast.error('Failed to calculate route');
          }
        }
      );
    }
  }, [isLoaded, homeLocation, officeLocation]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const center = homeLocation || officeLocation || { lat: 37.7749, lng: -122.4194 };

  return (
    <Card className="mt-6">
      <div className="p-4">
        <div className="h-[300px] w-full rounded-lg overflow-hidden">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={12}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {homeLocation && (
              <Marker
                position={homeLocation}
                label="H"
                title="Home Location"
              />
            )}
            {officeLocation && (
              <Marker
                position={officeLocation}
                label="O"
                title="Office Location"
              />
            )}
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        </div>
        {distance && (
          <p className="mt-2 text-sm text-gray-600">
            Distance between locations: {distance}
          </p>
        )}
      </div>
    </Card>
  );
};

export default LocationPreview;
