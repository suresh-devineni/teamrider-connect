
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, MapPin, MessageCircle } from "lucide-react";
import { type Ride } from "@/types/ride";
import { ChatDialog } from "@/components/chat/ChatDialog";

type RideCardProps = {
  ride: Ride;
  type: "offer" | "request";
  onAction: () => Promise<void>;
};

export const RideCard = ({ ride, type, onAction }: RideCardProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <Card className="p-4 space-y-3 hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start">
          <div>
            <span className="inline-block px-2 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full mb-2">
              {type === "offer" ? "Offering" : "Requesting"}
            </span>
            <h3 className="font-medium text-gray-900">{ride.from} → {ride.to}</h3>
            <p className="text-sm text-gray-500 mt-1">{ride.date}, {ride.time}</p>
            <p className="text-sm text-gray-500">Driver: {ride.driver}</p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsChatOpen(true)}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={onAction}
            >
              {type === "offer" ? "View Requests" : "Request Seat"}
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <UserPlus className="h-4 w-4 text-gray-400" />
            <span>{ride.seatsAvailable} seats left</span>
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
