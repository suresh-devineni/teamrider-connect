
import { Button } from "@/components/ui/button";
import { CarTaxiFront, UserPlus, MapPin } from "lucide-react";

export const BottomNav = () => {
  return (
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
  );
};
