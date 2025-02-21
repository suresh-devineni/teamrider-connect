
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormData {
  title: string;
  description: string;
  price: string;
  category: string;
  contact_info: string;
  location: string;
  image_url: string;  // Added this field
}

interface ClassifiedFormFieldsProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  categories: readonly string[];
}

export const ClassifiedFormFields = ({
  formData,
  setFormData,
  categories
}: ClassifiedFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Price (₹)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Enter location"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select 
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
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
          onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
          required
        />
      </div>
    </>
  );
};
