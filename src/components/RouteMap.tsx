
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { useMapsAutocomplete } from "@/hooks/useMapsAutocomplete";

interface RouteMapProps {
  fromLocation: {
    lat: number | null;
    lng: number | null;
  };
  toLocation: {
    lat: number | null;
    lng: number | null;
  };
}

export const RouteMap = ({ fromLocation, toLocation }: RouteMapProps) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const { isLoaded, loadError } = useMapsAutocomplete();
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const center = {
    lat: fromLocation.lat || 37.7749,
    lng: fromLocation.lng || -122.4194
  };

  useEffect(() => {
    if (!isLoaded || !fromLocation.lat || !toLocation.lat) return;

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: new google.maps.LatLng(fromLocation.lat, fromLocation.lng!),
        destination: new google.maps.LatLng(toLocation.lat, toLocation.lng!),
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error("Error fetching directions:", status);
        }
      }
    );
  }, [isLoaded, fromLocation, toLocation]);

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
        zoom={12}
        center={center}
        onLoad={setMap}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {!directions && fromLocation.lat && (
          <Marker position={{ lat: fromLocation.lat, lng: fromLocation.lng! }} />
        )}
        {!directions && toLocation.lat && (
          <Marker position={{ lat: toLocation.lat, lng: toLocation.lng! }} />
        )}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </Card>
  );
};
