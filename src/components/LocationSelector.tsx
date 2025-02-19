
import { Building, MapPinned, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

type LocationSelectorProps = {
  onLocationSelect: (type: "from" | "to") => Promise<void>;
};

export const LocationSelector = ({ onLocationSelect }: LocationSelectorProps) => {
  return (
    <Card className="mb-6 p-4">
      <div className="space-y-4">
        <div 
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => onLocationSelect("from")}
        >
          <Building className="h-5 w-5 text-gray-400" />
          <div className="flex-1">
            <p className="text-sm text-gray-500">From</p>
            <p className="font-medium">Downtown Office</p>
          </div>
        </div>
        <div 
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => onLocationSelect("to")}
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
  );
};
