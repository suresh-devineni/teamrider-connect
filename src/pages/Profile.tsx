
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LocationInput } from "@/components/LocationInput";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { User as UserIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BottomNav } from "@/components/BottomNav";

interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  home_location?: string;
  home_latitude?: number;
  home_longitude?: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate('/');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setProfile(data as Profile);
        } else {
          const { data: newData, error: createError } = await supabase
            .from('profiles')
            .insert([
              { 
                id: session.user.id,
                email: session.user.email,
                full_name: session.user.user_metadata.full_name
              }
            ])
            .select()
            .single();

          if (createError) throw createError;
          if (newData) setProfile(newData as Profile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLocationChange = async (location: string, lat?: number, lng?: number) => {
    if (!profile) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          home_location: location,
          home_latitude: lat,
          home_longitude: lng
        })
        .eq('id', profile.id);

      if (error) throw error;

      setProfile(prev => prev ? {
        ...prev,
        home_location: location,
        home_latitude: lat,
        home_longitude: lng
      } : null);

      toast.success('Home location updated successfully');
    } catch (error) {
      console.error('Error updating home location:', error);
      toast.error('Failed to update home location');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="pt-24 px-4 pb-20">
        <Card className="p-6 mb-4">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-16 w-16">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.full_name || 'User'} />
              ) : (
                <AvatarFallback>
                  {profile?.full_name ? profile.full_name[0].toUpperCase() : <UserIcon className="h-8 w-8" />}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{profile?.full_name || 'Loading...'}</h2>
              <p className="text-gray-500">{profile?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="home-location">Home Location</Label>
              <div className="mt-1">
                <LocationInput
                  id="home-location"
                  value={profile?.home_location || ''}
                  onChange={handleLocationChange}
                  placeholder="Enter your home location"
                  required={false}
                />
              </div>
              {isUpdating && (
                <div className="flex items-center justify-center mt-2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                </div>
              )}
            </div>
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
