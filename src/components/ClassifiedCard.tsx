import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditClassifiedDialog } from "@/components/EditClassifiedDialog";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

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

interface ClassifiedCardProps {
  classified: Classified;
}

export function ClassifiedCard({ classified }: ClassifiedCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this classified?")) return;
    
    setIsDeleting(true);
    const { error } = await supabase
      .from('classifieds')
      .delete()
      .eq('id', classified.id);

    if (error) {
      toast.error("Failed to delete classified");
      setIsDeleting(false);
      return;
    }

    toast.success("Classified deleted successfully");
    queryClient.invalidateQueries({ queryKey: ['classifieds'] });
    setIsDeleting(false);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{classified.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {classified.image_url && (
          <img
            src={classified.image_url}
            alt={classified.title}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        )}
        <p className="text-muted-foreground">{classified.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold">₹{classified.price}</span>
          <span className="text-sm text-muted-foreground">
            Posted on {formatDate(classified.created_at)}
          </span>
        </div>
        <div className="text-sm">
          <p>Category: {classified.category}</p>
          <p>Location: {classified.location}</p>
          <p>Contact: {classified.contact_info}</p>
          <p>Status: {classified.status}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => setIsEditDialogOpen(true)}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </CardFooter>

      <EditClassifiedDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        classified={classified}
      />
    </Card>
  );
}
