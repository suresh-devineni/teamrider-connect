
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClassifiedCard } from "@/components/ClassifiedCard";
import { CreateClassifiedDialog } from "@/components/CreateClassifiedDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Classified {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  status: 'active' | 'sold' | 'expired';
  created_at: string;
  user_id: string;
  contact_info: string;
  image_url?: string;
  location: string;
}

export default function Classifieds() {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  const { data: classifieds, isLoading, error } = useQuery({
    queryKey: ['classifieds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classifieds')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Classified[];
    }
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to view classifieds");
        navigate("/auth");
      }
    };
    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return <div className="p-8">Loading classifieds...</div>;
  }

  if (error) {
    return <div className="p-8">Error loading classifieds</div>;
  }

  // Get unique categories and locations from classifieds
  const categories = classifieds 
    ? ['all', ...new Set(classifieds.map(c => c.category))]
    : ['all'];
  
  const locations = classifieds
    ? ['all', ...new Set(classifieds.map(c => c.location))]
    : ['all'];

  // Filter classifieds by selected category and location
  const filteredClassifieds = classifieds?.filter(classified => 
    (selectedCategory === 'all' || classified.category === selectedCategory) &&
    (selectedLocation === 'all' || classified.location === selectedLocation)
  );

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Employee Classifieds</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2" />
          Post Classified
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="w-1/2">
          <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full flex-wrap h-auto">
              {categories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="capitalize"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="w-1/2">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map(location => (
                <SelectItem key={location} value={location} className="capitalize">
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClassifieds?.map((classified) => (
          <ClassifiedCard key={classified.id} classified={classified} />
        ))}
      </div>

      <CreateClassifiedDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
