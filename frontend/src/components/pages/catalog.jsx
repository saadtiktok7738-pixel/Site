import React, { useState, useEffect } from "react";
import { useSearch, useLocation } from "wouter";
import { useListProducts, useListCategories } from "../apis/index.js";
import { ProductCard } from "../shared/ProductCard.jsx";
import { Input } from "../ui/input.jsx";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button.jsx";
import { Helmet } from "react-helmet-async";

const PAGE_SIZE = 12;

// ✅ helper to safely extract array
const extractProducts = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.products)) return data.data.products;
  if (Array.isArray(data?.products)) return data.products;
  return [];
};

export default function Catalog() {
  const searchStr = useSearch();
  const [, setLocation] = useLocation();

  const params = new URLSearchParams(searchStr.startsWith("?") ? searchStr.slice(1) : searchStr);
  const urlCategory = params.get("category") || "";
  const urlSearch = params.get("search") || "";

  const [search, setSearch] = useState(urlSearch);
  const [category, setCategory] = useState(urlCategory);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setCategory(urlCategory);
    setSearch(urlSearch);
    setPage(1);
  }, [urlCategory, urlSearch]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [page]);

  // ✅ FIXED products extraction
  const { data: productsRaw, isLoading } = useListProducts({
    search: search || undefined,
    category: category || undefined,
  });

  const products = extractProducts(productsRaw);

  // ✅ FIXED categories extraction
  const { data: apiCategories } = useListCategories();

  const categories = Array.isArray(apiCategories)
    ? apiCategories
    : apiCategories?.data || [];

  const categoryNames = categories.map(c => c.name);

  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / PAGE_SIZE);

  const paginatedProducts = products.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setPage(1);
    const newParams = new URLSearchParams();
    if (cat) newParams.set("category", cat);
    if (search) newParams.set("search", search);
    const qs = newParams.toString();
    setLocation(`/catalog${qs ? `?${qs}` : ""}`);
    setMobileFiltersOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    if (search.trim()) newParams.set("search", search.trim());
    if (category) newParams.set("category", category);
    const qs = newParams.toString();
    setLocation(`/catalog${qs ? `?${qs}` : ""}`);
    setPage(1);
  };

  const handleClear = () => {
    setSearch("");
    setCategory("");
    setPage(1);
    setLocation("/catalog");
  };

  return (
    <>
     <Helmet>
        <title>{category ? `${category} Catalog | My Store` : "Catalog | Value Cart"}</title>
        <meta
          name="description"
          content={category ? `Browse all products in ${category}.` : "Browse our entire product catalog."}
        />
        <meta property="og:title" content={category ? `${category} Catalog | My Store` : "Catalog | My Store"} />
        <meta property="og:description" content={category ? `Explore ${category} products.` : "Check out all products."} />
        <meta property="og:image" content="/default-catalog.jpg" />
      </Helmet>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">

      {/* Header */}
      <div className="mb-6 md:mb-10 border-b border-border pb-5 md:pb-8">
        <div className="flex items-center justify-between gap-4 mb-3">
          <h1 className="text-2xl md:text-5xl font-display font-bold">Catalog</h1>

          <form onSubmit={handleSearch} className="flex-1 max-w-xs md:max-w-md ml-auto">
            <div className="relative">
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                tabIndex={-1}
              >
                <Search className="w-4 h-4" />
              </button>

              <Input
                placeholder="Search and press Enter..."
                className="pl-9 pr-8 h-9 md:h-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {search && (
                <button
                  type="button"
                  onClick={() => { setSearch(""); handleClear(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs md:text-sm">
            Showing {paginatedProducts.length} of {totalProducts} products
            {category && <span className="ml-1">in <strong>{category}</strong></span>}
            {search && <span className="ml-1">for "<strong>{search}</strong>"</span>}
          </p>

          <Button
            variant="outline"
            size="sm"
            className="shrink-0 md:hidden h-8 text-xs gap-1.5"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filter
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8">

        {/* Sidebar + Filters unchanged */}

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-[4/5] bg-secondary animate-pulse" />)}
            </div>
          ) : totalProducts === 0 ? (
            <div className="text-center py-20 bg-secondary/30 border border-border border-dashed">
              <Search className="w-10 h-10 text-muted-foreground mx-auto mb-4 opacity-40" />
              <h3 className="text-lg font-semibold mb-1">No products found</h3>
              <p className="text-sm text-muted-foreground mb-4">Try a different category or search term.</p>
              <Button variant="outline" size="sm" onClick={handleClear}>Clear Filters</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8 md:mt-10">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}>
                      {p}
                    </button>
                  ))}

                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
}