
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon } from "lucide-react";

interface ProfileHeaderProps {
  fullName: string | null;
  email: string | null;
  avatarUrl: string | null;
}

export const ProfileHeader = ({ fullName, email, avatarUrl }: ProfileHeaderProps) => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <Avatar className="h-16 w-16">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={fullName || 'User'} />
        ) : (
          <AvatarFallback>
            {fullName ? fullName[0].toUpperCase() : <UserIcon className="h-8 w-8" />}
          </AvatarFallback>
        )}
      </Avatar>
      <div>
        <h2 className="text-xl font-semibold">{fullName || 'Loading...'}</h2>
        <p className="text-gray-500">{email}</p>
      </div>
    </div>
  );
};
