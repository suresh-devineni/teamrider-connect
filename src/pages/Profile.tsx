
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { toast } from "sonner";
import { BottomNav } from "@/components/BottomNav";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { LocationFields } from "@/components/profile/LocationFields";

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
          <ProfileHeader
            fullName={profile?.full_name}
            email={profile?.email}
            avatarUrl={profile?.avatar_url}
          />

          <LocationFields
            homeLocation={{
              location: profile?.home_location,
              latitude: profile?.home_latitude,
              longitude: profile?.home_longitude,
            }}
            officeLocation={{
              location: profile?.office_location,
              latitude: profile?.office_latitude,
              longitude: profile?.office_longitude,
            }}
            isUpdating={isUpdating}
            onLocationChange={handleLocationChange}
            onClearLocation={handleClearLocation}
          />
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
