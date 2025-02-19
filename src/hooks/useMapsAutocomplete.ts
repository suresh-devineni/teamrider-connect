
import { useLoadScript } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const libraries: ("places")[] = ["places"];

export const useMapsAutocomplete = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data, error } = await supabase.rpc('get_secret', {
          secret_name: 'GOOGLE_MAPS_API_KEY'
        });
        
        if (error) {
          console.error('Error fetching API key:', error);
          return;
        }

        if (data) {
          const parsedData = JSON.parse(data);
          setApiKey(parsedData.secret || null);
        }
      } catch (error) {
        console.error('Error parsing API key:', error);
      }
    };

    fetchApiKey();
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || '',
    libraries,
  });

  return { 
    isLoaded: isLoaded && !!apiKey, 
    loadError 
  };
};
