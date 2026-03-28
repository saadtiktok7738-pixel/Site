import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Truck, RotateCcw, HeadphonesIcon, CreditCard, Zap } from "lucide-react";
import { useListProducts, useListBanners, useListCategories } from "../apis/index.js";
import { ProductCard } from "../shared/ProductCard.jsx";
import { formatPrice } from "../libs/utils.js";
import { Helmet } from "react-helmet";

function CountdownTimer() {
  const getTimeLeft = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="flex gap-3">
      {[
        { label: "HRS", value: timeLeft.hours },
        { label: "MIN", value: timeLeft.minutes },
        { label: "SEC", value: timeLeft.seconds },
      ].map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-black text-white flex items-center justify-center text-xl md:text-2xl font-bold font-display">
            {pad(value)}
          </div>
          <span className="text-xs font-medium text-muted-foreground mt-1">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const { data: bannersData } = useListBanners();
  const { data: hotProducts, isLoading: isLoadingHot } = useListProducts({ section: "hot_selling", limit: 8 });
  const { data: newProducts, isLoading: isLoadingNew } = useListProducts({ section: "new_arrivals", limit: 8 });
  const { data: offerProductsRaw } = useListProducts({ isOfferProduct: true, limit: 1 });
  const { data: categoriesRaw } = useListCategories();

  const offerProduct = offerProductsRaw?.[0] ?? null;
  const categories = categoriesRaw || [];
  const displayBanners = bannersData || [];

  useEffect(() => {
    if (displayBanners.length <= 1) return;
    const interval = setInterval(() => setCurrentSlide(prev => (prev + 1) % displayBanners.length), 5000);
    return () => clearInterval(interval);
  }, [displayBanners.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
     <Helmet>
        <title>Best Online Shopping in Pakistan | Value Cart</title>
        <meta name="description" content="Welcome to Value Cart — discover trending products, hot deals, and new arrivals." />
        <meta property="og:title" content="Home | Value Cart" />
        <meta property="og:description" content="Explore trending products and exclusive deals." />
        <meta property="og:image" content="/default-banner.jpg" />
      </Helmet>
    <div className="flex flex-col w-full">
      {/* Hero Banner */}
      <section className="relative w-full overflow-hidden bg-secondary" style={{ height: "clamp(220px, 56vw, 600px)" }}>
        {displayBanners.map((banner, index) => (
          <div
            key={banner.id}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: index === currentSlide ? 1 : 0, zIndex: index === currentSlide ? 1 : 0 }}
          >
            <img
              src={banner.imageUrl}
              alt={banner.title || "Banner"}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </section>

      {/* Category Slider */}
      <section className="py-5 bg-white border-b border-border overflow-hidden">
        <div className="relative w-full overflow-hidden">
          <div className="flex animate-category-scroll" style={{ width: "max-content" }}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalog?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center gap-2 mx-3 md:mx-5 flex-shrink-0 group cursor-pointer"
              >
                <div className="w-[110px] h-[110px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden border-2 border-transparent transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:scale-105 bg-secondary">
                  <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs md:text-sm font-semibold text-center text-foreground group-hover:text-accent transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Selling */}
      <section className="py-8 md:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-1">Hot Selling</h2>
          <p className="text-muted-foreground text-xs md:text-sm">Our most loved pieces, curated for you.</p>
        </div>
        {isLoadingHot ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[...Array(8)].map((_, i) => <div key={i} className="aspect-[4/5] bg-secondary animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {hotProducts?.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Offer Section */}
      {offerProduct && (
        <section className="py-8 md:py-12 bg-secondary">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div className="w-full overflow-hidden bg-white" style={{ aspectRatio: "1/1" }}>
                <img
                  src={offerProduct.imageUrl}
                  alt={offerProduct.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="space-y-4 md:space-y-6">
                <div>
                  <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">Limited Time Offer</p>
                  <h2 className="text-2xl md:text-4xl font-display font-bold mb-2">{offerProduct.name}</h2>
                  <p className="text-muted-foreground text-sm line-clamp-3">{offerProduct.description}</p>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl md:text-3xl font-bold text-accent">{formatPrice(offerProduct.discountPrice ?? offerProduct.price)}</span>
                  {offerProduct.originalPrice && offerProduct.originalPrice > offerProduct.price && (
                    <span className="text-base md:text-lg text-muted-foreground line-through">{formatPrice(offerProduct.originalPrice)}</span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Offer ends in:</p>
                  <CountdownTimer />
                </div>
                <Link href={`/product/${offerProduct.id}`}>
                  <button className="flex items-center gap-2 bg-black text-white px-6 py-2.5 md:px-8 md:py-3 font-semibold hover:bg-accent transition-colors text-sm md:text-base">
                    <Zap className="w-4 h-4" /> Shop Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="py-8 md:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-1">New Arrivals</h2>
          <p className="text-muted-foreground text-xs md:text-sm">Be the first to experience our latest collection.</p>
        </div>
        {isLoadingNew ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[...Array(8)].map((_, i) => <div key={i} className="aspect-[4/5] bg-secondary animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {newProducts?.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Trust Badges */}
      <section className="border-t border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Truck, title: "Free Shipping", desc: "All Over Pakistan" },
              { icon: RotateCcw, title: "Easy Returns", desc: "7 Days Return Policy" },
              { icon: HeadphonesIcon, title: "24/7 Support", desc: "Dedicated Support" },
              { icon: CreditCard, title: "Fast Shipping", desc: "COD Available" }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2 md:gap-3 group">
                <div className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-secondary flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  <feature.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm md:text-base">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </>
  );
}