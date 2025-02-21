
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, ArrowUpDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClassifiedCard } from "@/components/ClassifiedCard";
import { CreateClassifiedDialog } from "@/components/CreateClassifiedDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { BottomNav } from "@/components/BottomNav";
import { Skeleton } from "@/components/ui/skeleton";
import { useTenant } from "@/contexts/TenantContext";

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

type SortOption = 'newest' | 'oldest' | 'price-asc' | 'price-desc';

const ITEMS_PER_PAGE = 9;

export default function Classifieds() {
  const navigate = useNavigate();
  const { tenant, isLoading: isTenantLoading } = useTenant();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const { data: classifieds, isLoading, error } = useQuery({
    queryKey: ['classifieds', tenant?.id],
    queryFn: async () => {
      if (!tenant) return [];
      
      let query = supabase
        .from('classifieds')
        .select('*')
        .eq('tenant_id', tenant.id);

      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'oldest') {
        query = query.order('created_at', { ascending: true });
      } else if (sortBy === 'price-asc') {
        query = query.order('price', { ascending: true });
      } else if (sortBy === 'price-desc') {
        query = query.order('price', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Classified[];
    },
    enabled: !!tenant
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

  // Filter and search classifieds
  const filteredClassifieds = classifieds?.filter(classified => 
    (selectedCategory === 'all' || classified.category === selectedCategory) &&
    (selectedLocation === 'all' || classified.location === selectedLocation) &&
    (searchTerm === "" || 
      classified.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classified.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get categories and locations
  const categories = classifieds 
    ? ['all', ...new Set(classifieds.map(c => c.category))]
    : ['all'];
  
  const locations = classifieds
    ? ['all', ...new Set(classifieds.map(c => c.location))]
    : ['all'];

  // Paginate results
  const paginatedClassifieds = filteredClassifieds?.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const totalPages = filteredClassifieds 
    ? Math.ceil(filteredClassifieds.length / ITEMS_PER_PAGE)
    : 0;

  if (error) {
    return (
      <>
        <div className="p-8">Error loading classifieds</div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto p-8 pb-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {tenant?.name ? `${tenant.name} Classifieds` : 'Employee Classifieds'}
          </h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2" />
            Post Classified
          </Button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search classifieds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[180px]">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 flex-col md:flex-row">
            <div className="w-full md:w-1/2">
              <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="w-full flex-wrap h-auto">
                  {categories.map(category => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      className="capitalize"
                    >
                      {category}
                      {category !== 'all' && filteredClassifieds && (
                        <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {filteredClassifieds.filter(c => c.category === category).length}
                        </span>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className="w-full md:w-1/2">
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

          {(selectedCategory !== 'all' || selectedLocation !== 'all' || searchTerm) && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedLocation('all');
                  setSearchTerm('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {isLoading || isTenantLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedClassifieds?.map((classified) => (
                <ClassifiedCard key={classified.id} classified={classified} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i ? "default" : "outline"}
                    onClick={() => setCurrentPage(i)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage === totalPages - 1}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        <CreateClassifiedDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      </div>
      <BottomNav />
    </>
  );
}
