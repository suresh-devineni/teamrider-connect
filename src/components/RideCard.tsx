import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, MapPin, MessageCircle, Check, X, Play } from "lucide-react";
import { type Ride, type RideRequest } from "@/types/ride";
import { ChatDialog } from "@/components/chat/ChatDialog";
import { RouteMap } from "@/components/RouteMap";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type RideCardProps = {
  ride: Ride;
  type: "offer" | "request";
  onAction: () => Promise<void>;
};

export const RideCard = ({ ride, type, onAction }: RideCardProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [requests, setRequests] = useState<RideRequest[]>([]);

  const handleStartRide = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestSeat = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in to request a ride');
        return;
      }

      const { error } = await supabase.from('ride_requests').insert({
        ride_id: ride.id,
        requester_id: user.id,
        requester_name: user.user_metadata.full_name || 'Anonymous',
        status: 'pending',
        seats_requested: 1
      });

      if (error) throw error;

      toast.success('Ride request sent successfully!');
      await onAction();
    } catch (error) {
      console.error('Error requesting ride:', error);
      toast.error('Failed to request ride');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewRequests = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('ride_requests')
        .select('*')
        .eq('ride_id', ride.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setRequests(data);
      setShowRequests(true);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load ride requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAction = async (requestId: number, status: 'accepted' | 'rejected') => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('ride_requests')
        .update({ status })
        .eq('id', requestId);

      if (error) throw error;

      toast.success(`Request ${status}`);
      
      const { data, error: fetchError } = await supabase
        .from('ride_requests')
        .select('*')
        .eq('ride_id', ride.id)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setRequests(data);
      
      await onAction();
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error('Failed to update request');
    } finally {
      setIsLoading(false);
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
              onClick={type === "offer" ? handleViewRequests : handleRequestSeat}
              disabled={isLoading}
            >
              {type === "offer" ? "View Requests" : "Request Seat"}
            </Button>
          </div>
        </div>

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
        
        {showRequests && requests.length > 0 && (
          <div className="border-t pt-3 mt-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Ride Requests</h4>
            <div className="space-y-2">
              {requests.map((request) => (
                <div key={request.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div>
                    <p className="text-sm font-medium">{request.requester_name}</p>
                    <p className="text-xs text-gray-500">{request.seats_requested} seats</p>
                  </div>
                  {request.status === 'pending' ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleRequestAction(request.id, 'accepted')}
                        disabled={isLoading}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRequestAction(request.id, 'rejected')}
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <span className={`text-xs font-medium ${
                      request.status === 'accepted' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <UserPlus className="h-4 w-4 text-gray-400" />
            <span>{ride.seats_available} seats left</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{ride.distance}</span>
          </div>
        </div>
      </Card>
      
      <ChatDialog
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        rideId={ride.id}
      />
    </>
  );
};
