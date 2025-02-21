import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LocationInput } from "@/components/LocationInput";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { User as UserIcon, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { BottomNav } from "@/components/BottomNav";
import LocationPreview from "@/components/LocationPreview";

interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  home_location?: string;
  home_latitude?: number;
  home_longitude?: number;
  office_location?: string;
  office_latitude?: number;
  office_longitude?: number;
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

  const handleLocationChange = async (
    locationType: 'home' | 'office',
    location: string,
    lat?: number,
    lng?: number
  ) => {
    if (!profile) return;

    if (location && (!lat || !lng)) {
      toast.error('Please select a valid location from the suggestions');
      return;
    }

    setIsUpdating(true);
    try {
      const updateData = locationType === 'home' 
        ? {
            home_location: location || null,
            home_latitude: lat || null,
            home_longitude: lng || null
          }
        : {
            office_location: location || null,
            office_latitude: lat || null,
            office_longitude: lng || null
          };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profile.id);

      if (error) throw error;

      setProfile(prev => prev ? {
        ...prev,
        ...updateData
      } : null);

      toast.success(`${locationType === 'home' ? 'Home' : 'Office'} location ${location ? 'updated' : 'cleared'} successfully`);
    } catch (error) {
      console.error(`Error updating ${locationType} location:`, error);
      toast.error(`Failed to update ${locationType} location`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearLocation = (locationType: 'home' | 'office') => {
    handleLocationChange(locationType, '', undefined, undefined);
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

          <div className="space-y-6">
            <div>
              <Label htmlFor="home-location">Home Location</Label>
              <div className="mt-1 relative">
                <LocationInput
                  id="home-location"
                  value={profile?.home_location || ''}
                  onChange={(location, lat, lng) => handleLocationChange('home', location, lat, lng)}
                  placeholder="Enter your home location"
                  required={false}
                />
                {profile?.home_location && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => handleClearLocation('home')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="office-location">Office Location</Label>
              <div className="mt-1 relative">
                <LocationInput
                  id="office-location"
                  value={profile?.office_location || ''}
                  onChange={(location, lat, lng) => handleLocationChange('office', location, lat, lng)}
                  placeholder="Enter your office location"
                  required={false}
                />
                {profile?.office_location && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => handleClearLocation('office')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {isUpdating && (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
              </div>
            )}

            {(profile?.home_latitude || profile?.office_latitude) && (
              <LocationPreview
                homeLocation={
                  profile.home_latitude
                    ? {
                        lat: profile.home_latitude,
                        lng: profile.home_longitude!,
                        label: 'Home'
                      }
                    : undefined
                }
                officeLocation={
                  profile.office_latitude
                    ? {
                        lat: profile.office_latitude,
                        lng: profile.office_longitude!,
                        label: 'Office'
                      }
                    : undefined
                }
              />
            )}
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
