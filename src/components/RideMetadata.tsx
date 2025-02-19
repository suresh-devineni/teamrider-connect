
import { UserPlus, MapPin } from "lucide-react";

type RideMetadataProps = {
  seatsAvailable: number;
  distance: string;
};

export const RideMetadata = ({ seatsAvailable, distance }: RideMetadataProps) => {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-600">
      <div className="flex items-center gap-1">
        <UserPlus className="h-4 w-4 text-gray-400" />
        <span>{seatsAvailable} seats left</span>
      </div>
      <div className="flex items-center gap-1">
        <MapPin className="h-4 w-4 text-gray-400" />
        <span>{distance}</span>
      </div>
    </div>
  );
};
