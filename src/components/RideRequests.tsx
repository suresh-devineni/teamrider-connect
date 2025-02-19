
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { type RideRequest } from "@/types/ride";

type RideRequestsProps = {
  requests: RideRequest[];
  isLoading: boolean;
  onAction: (requestId: number, status: 'accepted' | 'rejected') => Promise<void>;
};

export const RideRequests = ({ requests, isLoading, onAction }: RideRequestsProps) => {
  return (
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
                  onClick={() => onAction(request.id, 'accepted')}
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onAction(request.id, 'rejected')}
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
  );
};
