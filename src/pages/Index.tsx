
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { RideToggle } from "@/components/RideToggle";
import { RideCard } from "@/components/RideCard";
import { RideRequestForm } from "@/components/RideRequestForm";
import { OfferRideForm } from "@/components/OfferRideForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { type Ride } from "@/types/ride";
import { toast } from "sonner";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"offer" | "request">("offer");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getUser();
  }, []);

  const { data: rides, isLoading, error, refetch } = useQuery({
    queryKey: ['rides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Ride[];
    }
  });

  const handleTabChange = async (tab: "offer" | "request") => {
    await Haptics.impact({ style: ImpactStyle.Light });
    setActiveTab(tab);
  };

  const handleRideAction = async () => {
    await Haptics.impact({ style: ImpactStyle.Medium });
    await refetch();
  };

  if (error) {
    toast.error('Failed to load rides');
    return null;
  }

  const filteredRides = rides?.filter(ride => {
    if (activeTab === "offer") {
      // In offer tab, show only user's own rides
      return currentUserId ? ride.driver_id === currentUserId : false;
    }
    // In request tab, show all rides except user's own rides
    return currentUserId ? ride.driver_id !== currentUserId : true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="pt-32 px-4 pb-20">
        <RideToggle activeTab={activeTab} onTabChange={handleTabChange} />

        {activeTab === "request" ? (
          <div className="mb-6">
            <RideRequestForm />
          </div>
        ) : (
          <div className="mb-6">
            <OfferRideForm />
          </div>
        )}

        <ScrollArea className="h-[calc(100vh-430px)]">
          {isLoading ? (
            <div className="text-center py-4">Loading rides...</div>
          ) : filteredRides && filteredRides.length > 0 ? (
            <div className="space-y-4">
              {filteredRides.map((ride) => (
                <RideCard 
                  key={ride.id} 
                  ride={ride}
                  type={activeTab} 
                  onAction={handleRideAction}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No rides available
            </div>
          )}
        </ScrollArea>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
