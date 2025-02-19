
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type RideToggleProps = {
  activeTab: "offer" | "request";
  onTabChange: (tab: "offer" | "request") => Promise<void>;
};

export const RideToggle = ({ activeTab, onTabChange }: RideToggleProps) => {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => onTabChange(value as "offer" | "request")}
      className="w-full mb-6"
    >
      <TabsList className="w-full">
        <TabsTrigger value="offer" className="flex-1">
          Offer Ride
        </TabsTrigger>
        <TabsTrigger value="request" className="flex-1">
          Request Ride
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
