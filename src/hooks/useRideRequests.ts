
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { type RideRequest } from "@/types/ride";

export const useRideRequests = (rideId: number, onAction: () => Promise<void>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<RideRequest[]>([]);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('ride_requests')
        .select('*')
        .eq('ride_id', rideId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load ride requests');
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
        ride_id: rideId,
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

  const handleRequestAction = async (requestId: number, status: 'accepted' | 'rejected') => {
    try {
      setIsLoading(true);
      
      const { data: request, error: requestError } = await supabase
        .from('ride_requests')
        .select('requester_id, requester_name')
        .eq('id', requestId)
        .single();

      if (requestError) throw requestError;

      const { error } = await supabase
        .from('ride_requests')
        .update({ status })
        .eq('id', requestId);

      if (error) throw error;

      if (status === 'accepted') {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user?.id === request.requester_id) {
          toast('Ride request accepted!', {
            description: `The driver has accepted your request to join the ride.`,
            duration: 5000,
          });
        } else {
          toast('Request accepted', {
            description: `You've accepted ${request.requester_name}'s request to join the ride.`,
            duration: 5000,
          });
        }
      }
      
      await fetchRequests();
      await onAction();
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error('Failed to update request');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requests,
    isLoading,
    fetchRequests,
    handleRequestSeat,
    handleRequestAction
  };
};
