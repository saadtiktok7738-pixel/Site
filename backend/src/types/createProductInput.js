const CreateProductInput = {
  name: "",
  description: "",
  price: 0,
  originalPrice: null,   // optional
  discountPrice: null,   // optional
  imageUrl: "",
  images: [],            // array of image URLs
  category: "",
  section: "",
  colors: null,          // optional array of colors
  stock: null,           // optional
  isHotSelling: false,   // optional
  isNewArrival: false,   // optional
  isOfferProduct: false, // optional
  inStock: false
};

export default CreateProductInput;