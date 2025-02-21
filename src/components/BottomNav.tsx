
import { Button } from "@/components/ui/button";
import { CarTaxiFront, UserPlus, MapPin, Tag } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex justify-around items-center">
      <Button 
        variant={location.pathname === "/" ? "default" : "ghost"} 
        className="flex flex-col items-center gap-1"
        onClick={() => navigate("/")}
      >
        <CarTaxiFront className="h-5 w-5" />
        <span className="text-xs">Rides</span>
      </Button>
      <Button 
        variant={location.pathname === "/profile" ? "default" : "ghost"} 
        className="flex flex-col items-center gap-1"
        onClick={() => navigate("/profile")}
      >
        <UserPlus className="h-5 w-5" />
        <span className="text-xs">Profile</span>
      </Button>
      <Button 
        variant={location.pathname === "/map" ? "default" : "ghost"} 
        className="flex flex-col items-center gap-1"
        onClick={() => navigate("/map")}
      >
        <MapPin className="h-5 w-5" />
        <span className="text-xs">Map</span>
      </Button>
      <Button 
        variant={location.pathname === "/classifieds" ? "default" : "ghost"} 
        className="flex flex-col items-center gap-1"
        onClick={() => navigate("/classifieds")}
      >
        <Tag className="h-5 w-5" />
        <span className="text-xs">Classifieds</span>
      </Button>
    </nav>
  );
};
