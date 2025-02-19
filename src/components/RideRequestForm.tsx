
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LocationInput } from "@/components/LocationInput";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const RideRequestForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    from_location: "",
    to_location: "",
    departure_date: "",
    departure_time: "",
    seats_requested: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in to create a ride request');
        return;
      }

      // First create the ride entry
      const { data: ride, error: rideError } = await supabase
        .from('rides')
        .insert({
          from_location: formData.from_location,
          to_location: formData.to_location,
          departure_date: formData.departure_date,
          departure_time: formData.departure_time,
          seats_available: formData.seats_requested,
          driver_id: user.id,
          driver_name: user.user_metadata.full_name || 'Anonymous'
        })
        .select()
        .single();

      if (rideError) throw rideError;

      // Then create the ride request
      const { error: requestError } = await supabase
        .from('ride_requests')
        .insert({
          ride_id: ride.id,
          requester_id: user.id,
          requester_name: user.user_metadata.full_name || 'Anonymous',
          seats_requested: formData.seats_requested,
          status: 'pending'
        });

      if (requestError) throw requestError;

      toast.success('Ride request created successfully!');
      setFormData({
        from_location: "",
        to_location: "",
        departure_date: "",
        departure_time: "",
        seats_requested: 1
      });
    } catch (error) {
      console.error('Error creating ride request:', error);
      toast.error('Failed to create ride request');
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
            onChange={(value) => setFormData(prev => ({ ...prev, from_location: value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="to_location">To</Label>
          <LocationInput
            id="to_location"
            value={formData.to_location}
            onChange={(value) => setFormData(prev => ({ ...prev, to_location: value }))}
            required
          />
        </div>
        
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
          <Label htmlFor="seats_requested">Number of Seats</Label>
          <Input
            id="seats_requested"
            type="number"
            min="1"
            value={formData.seats_requested}
            onChange={(e) => setFormData(prev => ({ ...prev, seats_requested: parseInt(e.target.value) }))}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Ride Request"}
        </Button>
      </form>
    </Card>
  );
};
