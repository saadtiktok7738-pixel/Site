import React, { useState, useRef } from "react";
import { useListBanners, useCreateBanner, useDeleteBanner } from "../../apis/index.js";
import { useAuth } from "../../hooks/use-store.js";
import { Button } from "../../ui/button.jsx";
import { Input } from "../../ui/input.jsx";
import { Plus, Trash2, Image, Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const MAX_BANNERS = 5;

function ImageUpload({ value, onChange, label }) {
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full border-2 border-dashed border-border hover:border-accent transition-colors p-4 flex flex-col items-center gap-2 bg-secondary/20"
      >
        {value ? (
          <img src={value} alt="preview" className="h-24 w-full object-cover rounded" />
        ) : (
          <>
            <Upload className="w-6 h-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{label}</span>
          </>
        )}
      </button>
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-[11px] text-destructive mt-1 hover:underline"
        >
          Remove image
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

export default function AdminBanners() {
  const { adminToken, userToken } = useAuth();
  const token = userToken || adminToken;
  const queryClient = useQueryClient();
  const { data: banners, isLoading } = useListBanners();
  const { mutate: createBanner, isPending } = useCreateBanner();
  const { mutate: deleteBanner } = useDeleteBanner();

  const [form, setForm] = useState({
    title: "",
    imageUrl: "",
    linkUrl: "",
    buttonText: "Shop Now",
    subtitle: "",
    sortOrder: 0,
    isActive: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.imageUrl) {
      alert("Please upload a banner image.");
      return;
    }
    if ((banners?.length || 0) >= MAX_BANNERS) {
      alert("Maximum 5 banners allowed.");
      return;
    }
    createBanner(
      {
        data: { ...form, sortOrder: form.sortOrder || (banners?.length ?? 0) },
        request: { headers: { Authorization: `Bearer ${token}` } },
      },
      {
        onSuccess: () => {
          setForm({
            title: "",
            imageUrl: "",
            linkUrl: "",
            buttonText: "Shop Now",
            subtitle: "",
            sortOrder: 0,
            isActive: true,
          });
          queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
        },
      }
    );
  };

  const handleDelete = (id) => {
    if (!confirm("Delete this banner?")) return;
    deleteBanner(
      { id, request: { headers: { Authorization: `Bearer ${token}` } } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/banners"] }) }
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Banners Management</h2>
          <span className="text-sm text-muted-foreground">
            {banners?.length ?? 0} / {MAX_BANNERS} banners
          </span>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Banner Image *</label>
            <ImageUpload
              value={form.imageUrl}
              onChange={(v) => setForm((f) => ({ ...f, imageUrl: v }))}
              label="Click to upload banner image"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              placeholder="Banner Title (optional)"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Button Text</label>
            <Input
              placeholder="Shop Now"
              value={form.buttonText}
              onChange={(e) => setForm((f) => ({ ...f, buttonText: e.target.value }))}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Link URL</label>
            <Input
              placeholder="/catalog (optional)"
              value={form.linkUrl}
              onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))}
            />
          </div>

          <div className="sm:col-span-2">
            <Button
              type="submit"
              disabled={isPending || (banners?.length ?? 0) >= MAX_BANNERS}
              className="w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Banner
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : banners && banners.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6">
            {banners.map((banner) => (
              <div key={banner.id} className="group relative border border-border overflow-hidden">
                <div className="aspect-video bg-secondary overflow-hidden">
                  {banner.imageUrl ? (
                    <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-12 h-12 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{banner.title || "(No title)"}</p>
                    {banner.linkUrl && <p className="text-xs text-muted-foreground truncate">{banner.linkUrl}</p>}
                  </div>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="text-destructive ml-2 hover:opacity-70 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-muted-foreground">
            <Image className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No banners yet. Add your first one above.</p>
          </div>
        )}
      </div>
    </div>
  );
}