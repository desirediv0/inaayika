import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { testimonials } from "@/api/adminService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2,
  ArrowLeft,
  Image as ImageIcon,
  MoreVertical,
  Quote,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDropzone } from "react-dropzone";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/context";
import { StarRatingInput, StarRatingDisplay } from "@/components/ui/StarRating";

function TestimonialForm({
  mode,
  testimonialId,
}: {
  mode: "create" | "edit";
  testimonialId?: string;
}) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(mode === "edit");
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    rating: 5,
    text: "",
    displayOrder: 0,
    isActive: true,
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  useEffect(() => {
    if (mode === "create") {
      const fetchNext = async () => {
        try {
          const res = await testimonials.getTestimonials({ limit: 1, sort: "displayOrder", order: "desc" });
          if (res.data.success) {
            const list = res.data.data?.testimonials || [];
            const max = list.length > 0 ? Math.max(...list.map((t: any) => t.displayOrder || 0)) : -1;
            setFormData((prev) => ({ ...prev, displayOrder: max + 1 }));
          }
        } catch {}
      };
      fetchNext();
    }
  }, [mode]);

  useEffect(() => {
    if (mode === "edit" && testimonialId) {
      const fetch = async () => {
        try {
          setFormLoading(true);
          const res = await testimonials.getTestimonialById(testimonialId);
          if (res.data.success) {
            const t = res.data.data.testimonial;
            setFormData({
              name: t.name || "",
              role: t.role || "",
              rating: t.rating || 5,
              text: t.text || "",
              displayOrder: t.displayOrder || 0,
              isActive: t.isActive,
            });
            if (t.image) setImagePreview(t.image);
          }
        } catch {
          toast.error("Failed to load testimonial");
        } finally {
          setFormLoading(false);
        }
      };
      fetch();
    }
  }, [mode, testimonialId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.text.trim()) {
      toast.error("Name and review text are required");
      return;
    }

    setIsLoading(true);
    try {
      if (mode === "create") {
        await testimonials.createTestimonial({ ...formData, image: image || undefined });
        toast.success("Testimonial created successfully");
      } else if (testimonialId) {
        await testimonials.updateTestimonial(testimonialId, { ...formData, image: image || undefined });
        toast.success("Testimonial updated successfully");
      }
      navigate("/testimonials");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (formLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/testimonials")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {mode === "create" ? "Add Testimonial" : "Edit Testimonial"}
        </h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <Label>Customer Photo</Label>
              <div
                {...getRootProps()}
                className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                }`}
              >
                <input {...getInputProps()} />
                {imagePreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-primary/20" />
                    <p className="text-xs text-muted-foreground">Click or drag to replace</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Drop customer photo here or click to upload</p>
                  </div>
                )}
              </div>
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name">Customer Name *</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Meera Deshmukh" className="mt-1" required />
            </div>

            {/* Role */}
            <div>
              <Label htmlFor="role">Role / Location</Label>
              <Input id="role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="e.g. Bride, Mumbai" className="mt-1" />
            </div>

            {/* Rating */}
            <div>
              <Label>Rating</Label>
              <div className="mt-1">
                <StarRatingInput value={formData.rating} onChange={(v) => setFormData({ ...formData, rating: v })} />
              </div>
            </div>

            {/* Review Text */}
            <div>
              <Label htmlFor="text">Review Text *</Label>
              <Textarea id="text" value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })} placeholder="Write the customer review..." rows={4} className="mt-1" required />
            </div>

            {/* Display Order */}
            <div>
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input id="displayOrder" type="number" value={formData.displayOrder} onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })} className="mt-1 w-32" />
            </div>

            {/* Active */}
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch checked={formData.isActive} onCheckedChange={(v) => setFormData({ ...formData, isActive: v })} />
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate("/testimonials")} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {mode === "create" ? "Create Testimonial" : "Update Testimonial"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function TestimonialsList() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await testimonials.getTestimonials({ sort: "displayOrder", order: "asc" });
      if (res.data.success) setItems(res.data.data?.testimonials || []);
    } catch {
      toast.error("Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await testimonials.deleteTestimonial(id);
      toast.success("Deleted successfully");
      fetchTestimonials();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await testimonials.toggleActive(id);
      fetchTestimonials();
    } catch {
      toast.error("Failed to toggle");
    }
  };

  const filtered = items.filter(
    (t) =>
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.text?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage customer reviews displayed on the website</p>
        </div>
        <Button onClick={() => navigate("/testimonials/new")} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search testimonials..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Quote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No testimonials found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex items-center gap-3 sm:contents">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-primary/20 flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                        {item.name?.charAt(0)}
                      </div>
                    )}
                    <div className="sm:hidden">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{item.name}</h3>
                        <Badge variant={item.isActive ? "default" : "secondary"} className="text-[10px]">
                          {item.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      {item.role && <p className="text-xs text-muted-foreground">{item.role}</p>}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="hidden sm:flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      {item.role && <span className="text-xs text-muted-foreground">— {item.role}</span>}
                      <Badge variant={item.isActive ? "default" : "secondary"} className="ml-auto text-[10px]">
                        {item.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-0.5 mb-2">
                      <StarRatingDisplay rating={item.rating} />
                      <span className="text-xs text-muted-foreground ml-1">{item.rating}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.text}</p>
                  </div>
                  <div className="flex sm:block gap-2 self-end sm:self-start">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/testimonials/edit/${item.id}`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggle(item.id)}>
                      {item.isActive ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4 text-gray-400" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TestimonialsPage() {
  const { id } = useParams();
  const location = useLocation();
  const isCreate = location.pathname === "/testimonials/new";
  const isEdit = location.pathname.startsWith("/testimonials/edit/");

  if (isCreate) return <TestimonialForm mode="create" />;
  if (isEdit && id) return <TestimonialForm mode="edit" testimonialId={id} />;
  return <TestimonialsList />;
}
