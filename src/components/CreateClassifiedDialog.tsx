
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ImagePlus, Loader2 } from "lucide-react";

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
  "Real Estate",
  "Other"
] as const;

interface CreateClassifiedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateClassifiedDialog({ open, onOpenChange }: CreateClassifiedDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    contact_info: "",
    image_url: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('classifieds')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('classifieds')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to create a classified");
        return;
      }

      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const { error } = await supabase
        .from('classifieds')
        .insert({
          ...formData,
          price: parseFloat(formData.price),
          user_id: user.id,
          image_url: imageUrl,
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
      setImageFile(null);
      setImagePreview(null);
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
            <Label htmlFor="image">Image</Label>
            <div className="flex flex-col items-center gap-4">
              {imagePreview ? (
                <div className="relative w-full">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="w-full">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:border-primary"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImagePlus className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="text-sm text-gray-500">Click to upload image</p>
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || isUploading}
          >
            {(isSubmitting || isUploading) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isSubmitting ? "Creating..." : "Create Classified"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
