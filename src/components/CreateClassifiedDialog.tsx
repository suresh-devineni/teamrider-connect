
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const CLASSIFIED_CATEGORIES = [
  "Electronics",
  "Furniture",
  "Vehicles",
  "Books",
  "Sports & Fitness",
  "Home & Garden",
  "Clothing",
  "Musical Instruments",
  "Collectibles",
  "Free Stuff",
  "Pets & Pet Supplies",
  "Tools",
  "Games & Toys",
  "Appliances",
  "Other"
] as const;

interface CreateClassifiedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateClassifiedDialog({ open, onOpenChange }: CreateClassifiedDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    contact_info: "",
    image_url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to create a classified");
        return;
      }

      const { error } = await supabase
        .from('classifieds')
        .insert({
          ...formData,
          price: parseFloat(formData.price),
          user_id: user.id,
        });

      if (error) throw error;

      toast.success("Classified created successfully");
      queryClient.invalidateQueries({ queryKey: ['classifieds'] });
      onOpenChange(false);
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "",
        contact_info: "",
        image_url: "",
      });
    } catch (error) {
      console.error('Error creating classified:', error);
      toast.error("Failed to create classified");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Classified</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CLASSIFIED_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_info">Contact Information</Label>
            <Input
              id="contact_info"
              value={formData.contact_info}
              onChange={(e) => setFormData(prev => ({ ...prev, contact_info: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL (optional)</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Classified"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
