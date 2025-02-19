
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { LocationInput } from "@/components/LocationInput";
import { RouteMap } from "@/components/RouteMap";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const DAYS_OF_WEEK = [
  { id: 0, label: "Sun" },
  { id: 1, label: "Mon" },
  { id: 2, label: "Tue" },
  { id: 3, label: "Wed" },
  { id: 4, label: "Thu" },
  { id: 5, label: "Fri" },
  { id: 6, label: "Sat" },
];

export const RideRequestForm = () => {
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
    seats_requested: 1,
    is_recurring: false,
    recurring_days: [] as number[],
    recurring_until: ""
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
          from_latitude: formData.from_latitude,
          from_longitude: formData.from_longitude,
          to_latitude: formData.to_latitude,
          to_longitude: formData.to_longitude,
          departure_date: formData.departure_date,
          departure_time: formData.departure_time,
          seats_available: formData.seats_requested,
          driver_id: user.id,
          driver_name: user.user_metadata.full_name || 'Anonymous',
          is_recurring: formData.is_recurring,
          recurring_days: formData.is_recurring ? formData.recurring_days : [],
          recurring_until: formData.is_recurring ? formData.recurring_until : null
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
          status: 'pending',
          is_recurring: formData.is_recurring,
          recurring_days: formData.is_recurring ? formData.recurring_days : [],
          recurring_until: formData.is_recurring ? formData.recurring_until : null
        });

      if (requestError) throw requestError;

      toast.success('Ride request created successfully!');
      setFormData({
        from_location: "",
        to_location: "",
        from_latitude: null,
        from_longitude: null,
        to_latitude: null,
        to_longitude: null,
        departure_date: "",
        departure_time: "",
        seats_requested: 1,
        is_recurring: false,
        recurring_days: [],
        recurring_until: ""
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

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_recurring"
              checked={formData.is_recurring}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ 
                  ...prev, 
                  is_recurring: checked as boolean,
                  recurring_days: checked ? prev.recurring_days : []
                }))
              }
            />
            <Label htmlFor="is_recurring">Recurring Ride</Label>
          </div>

          {formData.is_recurring && (
            <>
              <div className="flex flex-wrap gap-2 mt-2">
                {DAYS_OF_WEEK.map((day) => (
                  <Button
                    key={day.id}
                    type="button"
                    size="sm"
                    variant={formData.recurring_days.includes(day.id) ? "default" : "outline"}
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        recurring_days: prev.recurring_days.includes(day.id)
                          ? prev.recurring_days.filter(d => d !== day.id)
                          : [...prev.recurring_days, day.id].sort()
                      }));
                    }}
                  >
                    {day.label}
                  </Button>
                ))}
              </div>

              <div className="mt-2">
                <Label htmlFor="recurring_until">Recurring Until</Label>
                <Input
                  id="recurring_until"
                  type="date"
                  value={formData.recurring_until}
                  onChange={(e) => setFormData(prev => ({ ...prev, recurring_until: e.target.value }))}
                  required={formData.is_recurring}
                />
              </div>
            </>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Ride Request"}
        </Button>
      </form>
    </Card>
  );
};
