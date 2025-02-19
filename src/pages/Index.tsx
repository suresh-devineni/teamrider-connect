
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CarTaxiFront, UserPlus, MapPin, Clock, Building, MapPinned } from "lucide-react";
import { Haptics, ImpactStyle } from '@capacitor/haptics';

type Ride = {
  id: number;
  from: string;
  to: string;
  time: string;
  date: string;
  seatsAvailable: number;
  distance: string;
  driver: string;
};

const mockRides: Ride[] = [
  {
    id: 1,
    from: "Downtown Office",
    to: "Tech Park",
    time: "8:30 AM",
    date: "Tomorrow",
    seatsAvailable: 3,
    distance: "5.2 km",
    driver: "John Smith"
  },
  {
    id: 2,
    from: "Central Station",
    to: "Business District",
    time: "9:00 AM",
    date: "Tomorrow",
    seatsAvailable: 2,
    distance: "3.8 km",
    driver: "Sarah Johnson"
  },
  {
    id: 3,
    from: "Innovation Hub",
    to: "Corporate HQ",
    time: "8:45 AM",
    date: "Tomorrow",
    seatsAvailable: 4,
    distance: "6.1 km",
    driver: "Michael Chen"
  }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<"offer" | "request">("offer");
  const [selectedLocation, setSelectedLocation] = useState<"from" | "to" | null>(null);

  const handleTabChange = async (tab: "offer" | "request") => {
    await Haptics.impact({ style: ImpactStyle.Light });
    setActiveTab(tab);
  };

  const handleRideAction = async () => {
    await Haptics.impact({ style: ImpactStyle.Medium });
  };

  const handleLocationSelect = async (type: "from" | "to") => {
    await Haptics.impact({ style: ImpactStyle.Light });
    setSelectedLocation(type);
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
        {/* Location Selection */}
        <Card className="mb-6 p-4">
          <div className="space-y-4">
            <div 
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleLocationSelect("from")}
            >
              <Building className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">From</p>
                <p className="font-medium">Downtown Office</p>
              </div>
            </div>
            <div 
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleLocationSelect("to")}
            >
              <MapPinned className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">To</p>
                <p className="font-medium">Tech Park</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <Clock className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">When</p>
                <p className="font-medium">Tomorrow, 8:30 AM</p>
              </div>
            </div>
          </div>
        </Card>

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
        <ScrollArea className="h-[calc(100vh-430px)]">
          <div className="space-y-4">
            {mockRides.map((ride) => (
              <RideCard 
                key={ride.id} 
                ride={ride}
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
  ride,
  type, 
  onAction 
}: { 
  ride: Ride;
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
          <h3 className="font-medium text-gray-900">{ride.from} → {ride.to}</h3>
          <p className="text-sm text-gray-500 mt-1">{ride.date}, {ride.time}</p>
          <p className="text-sm text-gray-500">Driver: {ride.driver}</p>
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
          <span>{ride.seatsAvailable} seats left</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>{ride.distance}</span>
        </div>
      </div>
    </Card>
  );
};

export default Index;
