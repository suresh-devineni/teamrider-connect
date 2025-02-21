
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LocationInput } from "@/components/LocationInput";
import { Loader2, X } from "lucide-react";
import LocationPreview from "@/components/LocationPreview";

interface Location {
  location?: string;
  latitude?: number;
  longitude?: number;
}

interface LocationFieldsProps {
  homeLocation: Location;
  officeLocation: Location;
  isUpdating: boolean;
  onLocationChange: (
    locationType: 'home' | 'office',
    location: string,
    lat?: number,
    lng?: number
  ) => void;
  onClearLocation: (locationType: 'home' | 'office') => void;
}

export const LocationFields = ({
  homeLocation,
  officeLocation,
  isUpdating,
  onLocationChange,
  onClearLocation,
}: LocationFieldsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="home-location">Home Location</Label>
        <div className="mt-1 relative">
          <LocationInput
            id="home-location"
            value={homeLocation.location || ''}
            onChange={(location, lat, lng) => onLocationChange('home', location, lat, lng)}
            placeholder="Enter your home location"
            required={false}
          />
          {homeLocation.location && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => onClearLocation('home')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="office-location">Office Location</Label>
        <div className="mt-1 relative">
          <LocationInput
            id="office-location"
            value={officeLocation.location || ''}
            onChange={(location, lat, lng) => onLocationChange('office', location, lat, lng)}
            placeholder="Enter your office location"
            required={false}
          />
          {officeLocation.location && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => onClearLocation('office')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {isUpdating && (
        <div className="flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
        </div>
      )}

      {(homeLocation.latitude || officeLocation.latitude) && (
        <LocationPreview
          homeLocation={
            homeLocation.latitude
              ? {
                  lat: homeLocation.latitude,
                  lng: homeLocation.longitude!,
                  label: 'Home'
                }
              : undefined
          }
          officeLocation={
            officeLocation.latitude
              ? {
                  lat: officeLocation.latitude,
                  lng: officeLocation.longitude!,
                  label: 'Office'
                }
              : undefined
          }
        />
      )}
    </div>
  );
};
