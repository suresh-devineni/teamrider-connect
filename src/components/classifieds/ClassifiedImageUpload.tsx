
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";

interface ClassifiedImageUploadProps {
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
}

export const ClassifiedImageUpload = ({
  imagePreview,
  onImageChange,
  onImageRemove
}: ClassifiedImageUploadProps) => {
  return (
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
              onClick={onImageRemove}
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
                onChange={onImageChange}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassifiedImageUpload;
