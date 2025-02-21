
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ClassifiedFormFields } from "./classifieds/ClassifiedFormFields";
import { ClassifiedImageUpload } from "./classifieds/ClassifiedImageUpload";

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

const initialFormData = {
  title: "",
  description: "",
  price: "",
  category: "",
  contact_info: "",
  image_url: "",
  location: "",
};

export function CreateClassifiedDialog({ open, onOpenChange }: CreateClassifiedDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

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
      const { error: uploadError } = await supabase.storage
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
      setFormData(initialFormData);
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
          <ClassifiedFormFields
            formData={formData}
            setFormData={setFormData}
            categories={CLASSIFIED_CATEGORIES}
          />
          
          <ClassifiedImageUpload
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            onImageRemove={() => {
              setImageFile(null);
              setImagePreview(null);
            }}
          />

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
