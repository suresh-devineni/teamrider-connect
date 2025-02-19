
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CarTaxiFront, UserPlus, MapPin } from "lucide-react";
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const Index = () => {
  const [activeTab, setActiveTab] = useState<"offer" | "request">("offer");

  const handleTabChange = async (tab: "offer" | "request") => {
    await Haptics.impact({ style: ImpactStyle.Light });
    setActiveTab(tab);
  };

  const handleRideAction = async () => {
    await Haptics.impact({ style: ImpactStyle.Medium });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="px-4 py-6 bg-white/80 backdrop-blur-lg border-b border-gray-100 fixed top-0 left-0 right-0 z-50">
        <h1 className="text-2xl font-semibold text-gray-900">TeamRider</h1>
        <p className="text-sm text-gray-500 mt-1">Corporate Carpooling</p>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-4 pb-20">
        {/* Ride Type Toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "offer" ? "default" : "outline"}
            onClick={() => handleTabChange("offer")}
            className="flex-1 transition-all duration-300"
          >
            Offer Ride
          </Button>
          <Button
            variant={activeTab === "request" ? "default" : "outline"}
            onClick={() => handleTabChange("request")}
            className="flex-1 transition-all duration-300"
          >
            Request Ride
          </Button>
        </div>

        {/* Available Rides */}
        <ScrollArea className="h-[calc(100vh-240px)]">
          <div className="space-y-4">
            {[1, 2, 3].map((ride) => (
              <RideCard 
                key={ride} 
                type={activeTab} 
                onAction={handleRideAction}
              />
            ))}
          </div>
        </ScrollArea>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex justify-around items-center">
        <Button variant="ghost" className="flex flex-col items-center gap-1">
          <CarTaxiFront className="h-5 w-5" />
          <span className="text-xs">Rides</span>
        </Button>
        <Button variant="ghost" className="flex flex-col items-center gap-1">
          <UserPlus className="h-5 w-5" />
          <span className="text-xs">Profile</span>
        </Button>
        <Button variant="ghost" className="flex flex-col items-center gap-1">
          <MapPin className="h-5 w-5" />
          <span className="text-xs">Map</span>
        </Button>
      </nav>
    </div>
  );
};

const RideCard = ({ 
  type, 
  onAction 
}: { 
  type: "offer" | "request";
  onAction: () => Promise<void>;
}) => {
  return (
    <Card className="p-4 space-y-3 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <span className="inline-block px-2 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full mb-2">
            {type === "offer" ? "Offering" : "Requesting"}
          </span>
          <h3 className="font-medium text-gray-900">Downtown Office → Tech Park</h3>
          <p className="text-sm text-gray-500 mt-1">Tomorrow, 8:30 AM</p>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          className="shrink-0"
          onClick={onAction}
        >
          {type === "offer" ? "View Requests" : "Request Seat"}
        </Button>
      </div>
      
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <UserPlus className="h-4 w-4 text-gray-400" />
          <span>3 seats left</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>5.2 km</span>
        </div>
      </div>
    </Card>
  );
};

export default Index;
