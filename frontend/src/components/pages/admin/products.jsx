import React, { useState, useRef } from "react";
import {
  useListProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useListCategories,
} from "../../apis/index.js";
import { useAuth } from "../../hooks/use-store.js";
import { Button } from "../../ui/button.jsx";
import { Input } from "../../ui/input.jsx";
import { Plus, Trash2, Pencil, Upload, X, Image as ImageIcon } from "lucide-react";
import { formatPrice } from "../../libs/utils.js";
import { useQueryClient } from "@tanstack/react-query";

const DEFAULT_FORM = {
  name: "",
  description: "",
  price: 0,
  originalPrice: 0,
  discountPrice: 0,
  category: "",
  section: "hot_selling",
  colors: "",
  stock: 100,
  isHotSelling: false,
  isNewArrival: false,
  isOfferProduct: false,
  inStock: true,
  imageBase64: "",
  extraImages: [],
};

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminProducts() {
  const { adminToken } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const mainImageRef = useRef(null);
  const extraImagesRef = useRef(null);

  const { data: products } = useListProducts();
  const { data: categories } = useListCategories();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  const [formData, setFormData] = useState({ ...DEFAULT_FORM });

  const f = (field) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleMainImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    setFormData((prev) => ({ ...prev, imageBase64: b64 }));
  };

  const handleExtraImages = async (e) => {
    const files = Array.from(e.target.files || []);
    const b64s = await Promise.all(files.map(fileToBase64));
    setFormData((prev) => ({ ...prev, extraImages: [...prev.extraImages, ...b64s] }));
  };

  const removeExtraImage = (idx) => {
    setFormData((prev) => ({
      ...prev,
      extraImages: prev.extraImages.filter((_, i) => i !== idx),
    }));
  };

  const openCreate = () => {
    setFormData({ ...DEFAULT_FORM });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (p) => {
    setFormData({
      name: p.name,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice || 0,
      discountPrice: p.discountPrice || 0,
      imageBase64: p.imageUrl || "",
      extraImages: p.images || [],
      category: p.category,
      section: p.section,
      colors: (p.colors || []).join(", "),
      stock: p.stock || 100,
      isHotSelling: p.isHotSelling,
      isNewArrival: p.isNewArrival,
      isOfferProduct: p.isOfferProduct,
      inStock: p.inStock,
    });
    setEditingId(p.id);
    setIsModalOpen(true);
  };

  const buildPayload = () => ({
    name: formData.name,
    description: formData.description,
    price: Number(formData.price),
    originalPrice: Number(formData.originalPrice) || null,
    discountPrice: Number(formData.discountPrice) || null,
    imageUrl: formData.imageBase64,
    images: formData.extraImages,
    category: formData.category,
    section: formData.section,
    colors: formData.colors
      ? formData.colors.split(",").map((s) => s.trim()).filter(Boolean)
      : [],
    stock: Number(formData.stock),
    isHotSelling: formData.isHotSelling,
    isNewArrival: formData.isNewArrival,
    isOfferProduct: formData.isOfferProduct,
    inStock: formData.inStock,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.imageBase64) {
      alert("Please upload a main product image.");
      return;
    }
    const authHeader = { Authorization: `Bearer ${adminToken}` };
    const onSuccess = () => {
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    };
    if (editingId) {
      updateProduct(
        { id: editingId, data: buildPayload(), request: { headers: authHeader } },
        { onSuccess }
      );
    } else {
      createProduct(
        { data: buildPayload(), request: { headers: authHeader } },
        { onSuccess }
      );
    }
  };

  const handleDelete = (id) => {
    if (!confirm("Delete this product?")) return;
    deleteProduct(
      { id, request: { headers: { Authorization: `Bearer ${adminToken}` } } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/products"] }) }
    );
  };

  const categoryNames = categories?.map((c) => c.name) ?? [];

  return (
  <div className="space-y-5">
    <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-border shadow-sm">
      <h2 className="text-xl font-bold">Products</h2>
      <Button onClick={openCreate} size="sm">
        <Plus className="w-4 h-4 mr-1.5" /> Add Product
      </Button>
    </div>

    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-secondary/50 text-muted-foreground uppercase tracking-wider text-xs border-b border-border">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Tags</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products?.map((product) => (
              <tr key={product.id} className="hover:bg-secondary/20 transition-colors">
                <td className="p-4">
                  <div className="w-12 h-12 bg-secondary overflow-hidden">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="p-4 max-w-[180px]">
                  <p className="font-semibold truncate text-sm">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.section}</p>
                </td>
                <td className="p-4 text-muted-foreground text-sm">{product.category}</td>
                <td className="p-4 font-bold text-sm">{formatPrice(product.price)}</td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    {product.isHotSelling && <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 font-bold w-fit">HOT</span>}
                    {product.isNewArrival && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 font-bold w-fit">NEW</span>}
                    {product.isOfferProduct && <span className="text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 font-bold w-fit">OFFER</span>}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 text-xs font-bold ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.stock} {product.inStock ? "✓" : "✗"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(product)} className="h-8 w-8 p-0">
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)} className="h-8 w-8 p-0">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
        <div className="bg-white w-full max-w-2xl shadow-2xl my-4">
          <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-white z-10">
            <h3 className="text-lg font-bold">{editingId ? "Edit Product" : "Add Product"}</h3>
            <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="p-5 space-y-4">

            {/* Main Image Upload */}
            <div>
              <label className="text-sm font-medium block mb-2">Main Image *</label>
              <div className="flex gap-3 items-start">
                <div className="w-24 h-24 bg-secondary flex items-center justify-center overflow-hidden shrink-0 border border-border">
                  {formData.imageBase64 ? (
                    <img src={formData.imageBase64} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <input ref={mainImageRef} type="file" accept="image/*" onChange={handleMainImage} className="hidden" />
                  <Button type="button" variant="outline" size="sm" onClick={() => mainImageRef.current?.click()}>
                    <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload Image
                  </Button>
                  {formData.imageBase64 && (
                    <button type="button" onClick={() => setFormData(p => ({ ...p, imageBase64: "" }))} className="ml-2 text-xs text-destructive hover:underline">Remove</button>
                  )}
                  <p className="text-xs text-muted-foreground mt-1.5">JPG, PNG, WebP up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Extra Images */}
            <div>
              <label className="text-sm font-medium block mb-2">Additional Images</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.extraImages.map((img, i) => (
                  <div key={i} className="relative w-16 h-16 bg-secondary overflow-hidden border border-border">
                    <img src={img} alt={`Extra ${i}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeExtraImage(i)} className="absolute top-0 right-0 bg-black/60 text-white w-5 h-5 flex items-center justify-center">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <input ref={extraImagesRef} type="file" accept="image/*" multiple onChange={handleExtraImages} className="hidden" />
              <Button type="button" variant="outline" size="sm" onClick={() => extraImagesRef.current?.click()}>
                <Upload className="w-3.5 h-3.5 mr-1.5" /> Add More Images
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium">Product Name *</label>
                <Input placeholder="Name" value={formData.name} onChange={f("name")} required className="mt-1" />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">Description</label>
                <textarea value={formData.description} onChange={f("description")} rows={3} placeholder="Description" className="w-full mt-1 border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring rounded-md" />
              </div>
              <div>
                <label className="text-sm font-medium">Price (PKR) *</label>
                <Input type="number" value={formData.price} onChange={f("price")} required className="mt-1" min={0} />
              </div>
              <div>
                <label className="text-sm font-medium">Original Price (PKR)</label>
                <Input type="number" value={formData.originalPrice} onChange={f("originalPrice")} className="mt-1" min={0} />
              </div>
              <div>
                <label className="text-sm font-medium">Discount Price (PKR)</label>
                <Input type="number" value={formData.discountPrice} onChange={f("discountPrice")} className="mt-1" min={0} />
              </div>
              <div>
                <label className="text-sm font-medium">Stock</label>
                <Input type="number" value={formData.stock} onChange={f("stock")} className="mt-1" min={0} />
              </div>
              <div>
                <label className="text-sm font-medium">Category *</label>
                <select value={formData.category} onChange={f("category")} required className="w-full mt-1 h-10 border border-input px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring rounded-md">
                  <option value="">Select category</option>
                  {categoryNames.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Section</label>
                <select value={formData.section} onChange={f("section")} className="w-full mt-1 h-10 border border-input px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring rounded-md">
                  <option value="hot_selling">Hot Selling</option>
                  <option value="new_arrivals">New Arrivals</option>
                  <option value="featured">Featured</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">Colors (comma-separated hex, e.g. #FF0000, #00FF00)</label>
                <Input placeholder="#000000, #FFFFFF" value={formData.colors} onChange={f("colors")} className="mt-1" />
              </div>
              <div className="col-span-2 flex flex-wrap gap-5">
                {[
                  { key: "isHotSelling", label: "Hot Selling (max 8)" },
                  { key: "isNewArrival", label: "New Arrival (max 8)" },
                  { key: "isOfferProduct", label: "Offer Product (only 1 at a time)" },
                  { key: "inStock", label: "In Stock" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData[key]}
                      onChange={f(key)}
                      className="w-4 h-4 accent-accent"
                    />
                    <span className="text-sm font-medium">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2 border-t border-border">
              <Button type="submit" disabled={isCreating || isUpdating} className="flex-1">
                {isCreating || isUpdating ? "Saving..." : editingId ? "Save Changes" : "Create Product"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);
}