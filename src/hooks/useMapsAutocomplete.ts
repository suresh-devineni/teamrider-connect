
import { useLoadScript } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const libraries: ("places")[] = ["places"];

export const useMapsAutocomplete = () => {
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string>("");

  useEffect(() => {
    const fetchApiKey = async () => {
      const { data, error } = await supabase.rpc('get_secret', {
        secret_name: 'GOOGLE_MAPS_API_KEY'
      });
      
      if (!error && data) {
        const parsedData = JSON.parse(data);
        setGoogleMapsApiKey(parsedData.secret || "");
      }
    };

    fetchApiKey();
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
    libraries,
  });

  return { isLoaded, loadError };
};
