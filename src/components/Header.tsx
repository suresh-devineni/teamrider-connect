
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
}

export const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log("Profile data:", data);
      if (data) {
        setProfile(data as Profile);
      } else {
        // If no profile exists, create one
        const { data: newData, error: createError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: userId,
              email: user?.email,
              full_name: user?.user_metadata.full_name
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error('Profile creation error:', createError);
          throw createError;
        }

        if (newData) {
          console.log("Created new profile:", newData);
          setProfile(newData as Profile);
        }
      }
    } catch (error) {
      console.error('Error fetching/creating profile:', error);
      toast.error('Failed to load user profile');
    }
  };

  return (
    <header className="px-4 py-6 bg-white/80 backdrop-blur-lg border-b border-gray-100 fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">TeamRider</h1>
          <p className="text-sm text-gray-500 mt-1">Corporate Carpooling</p>
        </div>
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                <Avatar>
                  {profile?.avatar_url ? (
                    <AvatarImage src={profile.avatar_url} alt={profile.full_name || 'User'} />
                  ) : (
                    <AvatarFallback>
                      {profile?.full_name ? profile.full_name[0].toUpperCase() : <UserIcon className="h-5 w-5" />}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-gray-700"
                onClick={() => navigate("/profile")}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{profile?.full_name}</span>
                  <span className="text-sm text-gray-500">{profile?.email}</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            variant="outline"
            onClick={() => setIsAuthModalOpen(true)}
          >
            Login
          </Button>
        )}
      </div>
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
};
