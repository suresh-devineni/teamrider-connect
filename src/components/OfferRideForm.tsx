
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LocationInput } from "@/components/LocationInput";
import { RouteMap } from "@/components/RouteMap";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const OfferRideForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    from_location: "",
    to_location: "",
    from_latitude: null as number | null,
    from_longitude: null as number | null,
    to_latitude: null as number | null,
    to_longitude: null as number | null,
    departure_date: "",
    departure_time: "",
    seats_available: 1
  });

  useEffect(() => {
    // Get current location when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Use Google Maps Geocoding service to get address from coordinates
            const geocoder = new google.maps.Geocoder();
            const response = await geocoder.geocode({
              location: { lat: latitude, lng: longitude }
            });

            if (response.results[0]) {
              setFormData(prev => ({
                ...prev,
                from_location: response.results[0].formatted_address,
                from_latitude: latitude,
                from_longitude: longitude
              }));
            }
          } catch (error) {
            console.error('Error getting address:', error);
            toast.error('Could not get current location address');
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Could not get current location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in to offer a ride');
        return;
      }

      const { error } = await supabase
        .from('rides')
        .insert({
          from_location: formData.from_location,
          to_location: formData.to_location,
          from_latitude: formData.from_latitude,
          from_longitude: formData.from_longitude,
          to_latitude: formData.to_latitude,
          to_longitude: formData.to_longitude,
          departure_date: formData.departure_date,
          departure_time: formData.departure_time,
          seats_available: formData.seats_available,
          driver_id: user.id,
          driver_name: user.user_metadata.full_name || 'Anonymous'
        });

      if (error) throw error;

      toast.success('Ride offered successfully!');
      setFormData({
        from_location: "",
        to_location: "",
        from_latitude: null,
        from_longitude: null,
        to_latitude: null,
        to_longitude: null,
        departure_date: "",
        departure_time: "",
        seats_available: 1
      });
    } catch (error) {
      console.error('Error offering ride:', error);
      toast.error('Failed to offer ride');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="from_location">From</Label>
          <LocationInput
            id="from_location"
            value={formData.from_location}
            onChange={(value, lat, lng) => setFormData(prev => ({
              ...prev,
              from_location: value,
              from_latitude: lat || null,
              from_longitude: lng || null
            }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="to_location">To</Label>
          <LocationInput
            id="to_location"
            value={formData.to_location}
            onChange={(value, lat, lng) => setFormData(prev => ({
              ...prev,
              to_location: value,
              to_latitude: lat || null,
              to_longitude: lng || null
            }))}
            required
          />
        </div>

        <RouteMap 
          fromLocation={{
            lat: formData.from_latitude,
            lng: formData.from_longitude
          }}
          toLocation={{
            lat: formData.to_latitude,
            lng: formData.to_longitude
          }}
        />
        
        <div>
          <Label htmlFor="departure_date">Date</Label>
          <Input
            id="departure_date"
            type="date"
            value={formData.departure_date}
            onChange={(e) => setFormData(prev => ({ ...prev, departure_date: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="departure_time">Time</Label>
          <Input
            id="departure_time"
            type="time"
            value={formData.departure_time}
            onChange={(e) => setFormData(prev => ({ ...prev, departure_time: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="seats_available">Available Seats</Label>
          <Input
            id="seats_available"
            type="number"
            min="1"
            value={formData.seats_available}
            onChange={(e) => setFormData(prev => ({ ...prev, seats_available: parseInt(e.target.value) }))}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating..." : "Offer Ride"}
        </Button>
      </form>
    </Card>
  );
};
