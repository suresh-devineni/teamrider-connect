
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Play } from "lucide-react";
import { type Ride } from "@/types/ride";
import { ChatDialog } from "@/components/chat/ChatDialog";
import { RouteMap } from "@/components/RouteMap";
import { LiveLocationMap } from "@/components/LiveLocationMap";
import { RideRequests } from "@/components/RideRequests";
import { RideMetadata } from "@/components/RideMetadata";
import { useRideRequests } from "@/hooks/useRideRequests";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type RideCardProps = {
  ride: Ride;
  type: "offer" | "request";
  onAction: () => Promise<void>;
};

export const RideCard = ({ ride, type, onAction }: RideCardProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const { requests, isLoading, handleRequestSeat, handleRequestAction } = useRideRequests(ride.id, onAction);

  const handleStartRide = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in to start the ride');
        return;
      }

      if (user.id !== ride.driver_id) {
        toast.error('Only the driver can start the ride');
        return;
      }

      const { error } = await supabase
        .from('rides')
        .update({ ride_status: 'in_progress' })
        .eq('id', ride.id);

      if (error) throw error;

      toast.success('Ride started successfully!');
      await onAction();
    } catch (error) {
      console.error('Error starting ride:', error);
      toast.error('Failed to start ride');
    }
  };

  return (
    <>
      <Card className="p-4 space-y-3 hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex gap-2 items-center mb-2">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full">
                {type === "offer" ? "Offering" : "Requesting"}
              </span>
              {ride.ride_status === 'in_progress' && (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                  In Progress
                </span>
              )}
            </div>
            <h3 className="font-medium text-gray-900">{ride.from_location} → {ride.to_location}</h3>
            <p className="text-sm text-gray-500 mt-1">{ride.departure_date}, {ride.departure_time}</p>
            <p className="text-sm text-gray-500">Driver: {ride.driver_name}</p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsChatOpen(true)}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            {type === "offer" && ride.ride_status === 'pending' && (
              <Button
                size="sm"
                variant="default"
                onClick={handleStartRide}
                disabled={isLoading}
              >
                <Play className="h-4 w-4 mr-1" />
                Start Ride
              </Button>
            )}
            <Button 
              size="sm" 
              variant="outline"
              onClick={type === "offer" ? () => setShowRequests(true) : handleRequestSeat}
              disabled={isLoading}
            >
              {type === "offer" ? "View Requests" : "Request Seat"}
            </Button>
          </div>
        </div>

        {ride.ride_status === 'in_progress' ? (
          <LiveLocationMap 
            rideId={ride.id}
            initialCenter={{
              lat: ride.from_latitude || 37.7749,
              lng: ride.from_longitude || -122.4194
            }}
          />
        ) : (
          <RouteMap 
            fromLocation={{
              lat: ride.from_latitude,
              lng: ride.from_longitude
            }}
            toLocation={{
              lat: ride.to_latitude,
              lng: ride.to_longitude
            }}
          />
        )}
        
        {showRequests && requests.length > 0 && (
          <RideRequests 
            requests={requests}
            isLoading={isLoading}
            onAction={handleRequestAction}
          />
        )}
        
        <RideMetadata 
          seatsAvailable={ride.seats_available}
          distance={ride.distance}
        />
      </Card>
      
      <ChatDialog
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        rideId={ride.id}
      />
    </>
  );
};
