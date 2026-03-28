const Product = {
  id: 0,
  name: "",
  description: "",
  price: 0,
  originalPrice: null,   // optional
  discountPrice: null,   // optional
  imageUrl: "",
  images: [],            // array of image URLs
  category: "",
  section: "",
  colors: [],            // array of colors
  stock: 0,
  isHotSelling: false,
  isNewArrival: false,
  isOfferProduct: false,
  inStock: false,
  createdAt: ""          // ISO string
};

export default Product;