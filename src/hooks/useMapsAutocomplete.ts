
import { useLoadScript } from "@react-google-maps/api";

const libraries: ("places")[] = ["places"];

export const useMapsAutocomplete = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // This should be replaced with your API key
    libraries,
  });

  return { isLoaded, loadError };
};
