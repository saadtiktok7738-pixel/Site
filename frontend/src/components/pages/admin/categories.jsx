import React, { useState, useRef } from "react";
import { useListCategories, useCreateCategory, useDeleteCategory } from "../../apis/index.js";
import { useAuth } from "../../hooks/use-store.js";
import { Button } from "../../ui/button.jsx";
import { Input } from "../../ui/input.jsx";
import { Plus, Trash2, FolderOpen, Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

function ImageUpload({ value, onChange }) {
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full border-2 border-dashed border-border hover:border-accent transition-colors p-3 flex items-center justify-center gap-2 bg-secondary/20 h-10"
      >
        {value ? (
          <div className="flex items-center gap-2 text-xs text-accent font-medium">
            <img src={value} alt="" className="w-6 h-6 object-cover rounded" />
            Image selected (click to change)
          </div>
        ) : (
          <>
            <Upload className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Upload image</span>
          </>
        )}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

export default function AdminCategories() {
  const { adminToken, userToken } = useAuth();
  const token = userToken || adminToken;
  const queryClient = useQueryClient();
  const { data: categories, isLoading } = useListCategories();
  const { mutate: createCategory, isPending } = useCreateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();

  const [form, setForm] = useState({ name: "", imageUrl: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    createCategory(
      {
        data: form,
        request: { headers: { Authorization: `Bearer ${token}` } },
      },
      {
        onSuccess: () => {
          setForm({ name: "", imageUrl: "" });
          queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
        },
      }
    );
  };

  const handleDelete = (id) => {
    if (!confirm("Delete this category?")) return;
    deleteCategory(
      { id, request: { headers: { Authorization: `Bearer ${token}` } } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/categories"] }) }
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Categories Management</h2>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <Input
            placeholder="Category name (e.g. Clothing)"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            className="flex-1"
          />
          <div className="flex-1">
            <ImageUpload value={form.imageUrl} onChange={(v) => setForm((f) => ({ ...f, imageUrl: v }))} />
          </div>
          <Button type="submit" disabled={isPending} className="shrink-0">
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </form>
      </div>

      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="group relative border border-border overflow-hidden hover:border-accent transition-colors"
              >
                <div className="aspect-square overflow-hidden bg-secondary">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderOpen className="w-12 h-12 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="font-semibold text-sm">{cat.name}</span>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-muted-foreground">
            <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No categories yet. Add your first one above.</p>
          </div>
        )}
      </div>
    </div>
  );
}