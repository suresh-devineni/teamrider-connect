
import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useMapsAutocomplete } from "@/hooks/useMapsAutocomplete";

interface LocationInputProps {
  id: string;
  value: string;
  onChange: (value: string, lat?: number, lng?: number) => void;
  placeholder?: string;
  required?: boolean;
}

export const LocationInput = ({ id, value, onChange, placeholder, required }: LocationInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isLoaded, loadError } = useMapsAutocomplete();

  useEffect(() => {
    if (!isLoaded || loadError || !inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['geocode'],
      fields: ['formatted_address', 'geometry'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        const lat = place.geometry?.location?.lat();
        const lng = place.geometry?.location?.lng();
        onChange(place.formatted_address, lat, lng);
      }
    });

    return () => {
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [isLoaded, loadError, onChange]);

  return (
    <Input
      ref={inputRef}
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
    />
  );
};
