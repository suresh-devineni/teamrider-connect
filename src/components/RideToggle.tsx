
import { Button } from "@/components/ui/button";

type RideToggleProps = {
  activeTab: "offer" | "request";
  onTabChange: (tab: "offer" | "request") => Promise<void>;
};

export const RideToggle = ({ activeTab, onTabChange }: RideToggleProps) => {
  return (
    <div className="flex gap-2 mb-6">
      <Button
        variant={activeTab === "offer" ? "default" : "outline"}
        onClick={() => onTabChange("offer")}
        className="flex-1 transition-all duration-300"
      >
        Offer Ride
      </Button>
      <Button
        variant={activeTab === "request" ? "default" : "outline"}
        onClick={() => onTabChange("request")}
        className="flex-1 transition-all duration-300"
      >
        Request Ride
      </Button>
    </div>
  );
};
