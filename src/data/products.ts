import { Product } from '../types';

// Customization presets
const teaCustomizations = [
  {
    name: "Sugar Level",
    required: true,
    type: "select" as const,
    options: [
      { name: "Regular Sugar", price: 0 },
      { name: "Less Sugar", price: 0 },
      { name: "No Sugar", price: 0 },
      { name: "Extra Sugar", price: 10 }
    ]
  },
  {
    name: "Milk Preference",
    required: true,
    type: "select" as const,
    options: [
      { name: "Whole Milk", price: 0 },
      { name: "Oat Milk", price: 20 },
      { name: "Soy Milk", price: 15 },
      { name: "Black / No Milk", price: 0 }
    ]
  }
];

const coffeeCustomizations = [
  {
    name: "Sugar Level",
    required: true,
    type: "select" as const,
    options: [
      { name: "Regular Sugar", price: 0 },
      { name: "Less Sugar", price: 0 },
      { name: "No Sugar", price: 0 }
    ]
  },
  {
    name: "Milk Preference",
    required: true,
    type: "select" as const,
    options: [
      { name: "Whole Milk", price: 0 },
      { name: "Oat Milk", price: 20 },
      { name: "Soy Milk", price: 15 },
      { name: "Almond Milk", price: 20 },
      { name: "Black / No Milk", price: 0 }
    ]
  },
  {
    name: "Add-ons",
    required: false,
    type: "multiple" as const,
    options: [
      { name: "Extra Espresso Shot", price: 30 },
      { name: "Whipped Cream", price: 20 },
      { name: "Vanilla Syrup", price: 15 },
      { name: "Caramel Drizzle", price: 15 }
    ]
  }
];

const coldDrinkCustomizations = [
  {
    name: "Ice Level",
    required: true,
    type: "select" as const,
    options: [
      { name: "Regular Ice", price: 0 },
      { name: "Less Ice", price: 0 },
      { name: "No Ice", price: 0 }
    ]
  },
  {
    name: "Add-ons",
    required: false,
    type: "multiple" as const,
    options: [
      { name: "Tapioca Pearls (Boba)", price: 30 },
      { name: "Whipped Cream", price: 20 },
      { name: "Mango Popping Boba", price: 30 }
    ]
  }
];

export const products: Product[] = [
  // CATEGORY: TEA
  {
    id: "tea-01",
    name: "Milk Tea",
    description: "Classic milk tea brewed with premium black tea leaves and fresh whole milk. A comforting and creamy beverage perfect for any time of day.",
    price: 30,
    category: "tea",
    image: "/images/products/Milk Tea.jpg",
    available: true,
    featured: true,
    customizations: teaCustomizations,
    preparationTime: 5
  },
  {
    id: "tea-02",
    name: "Black Tea",
    description: "Strong and robust black tea served hot. Pure and simple, perfect for tea lovers who appreciate the authentic taste.",
    price: 25,
    category: "tea",
    image: "/images/products/Black Tea.jpg",
    available: true,
    customizations: teaCustomizations,
    preparationTime: 3
  },
  {
    id: "tea-03",
    name: "Green Tea",
    description: "Premium green tea leaves offering a delicate vegetal flavor and clean finish. Rich in antioxidants and perfect for health-conscious customers.",
    price: 50,
    category: "tea",
    image: "/images/products/Green Tea.jpg",
    available: true,
    customizations: teaCustomizations,
    preparationTime: 4
  },
  {
    id: "tea-04",
    name: "Lemon Tea",
    description: "Refreshing black tea infused with fresh lemon juice and a hint of honey. A zesty and revitalizing drink.",
    price: 40,
    category: "tea",
    image: "/images/products/Lemon Tea.jpg",
    available: true,
    customizations: teaCustomizations,
    preparationTime: 4
  },
  {
    id: "tea-05",
    name: "Ginger Tea",
    description: "Zesty freshly-grated ginger steeped in hot water with a touch of honey. Excellent for soothing the throat and boosting immunity.",
    price: 40,
    category: "tea",
    image: "/images/products/Ginger Tea.jpg",
    available: true,
    customizations: teaCustomizations,
    preparationTime: 5
  },
  {
    id: "tea-06",
    name: "Masala Tea",
    description: "Rich black tea infused with premium crushed cardamom, cloves, cinnamon, black pepper, and fresh ginger, boiled to perfection with milk.",
    price: 50,
    category: "tea",
    image: "/images/products/Masala Tea.jpg",
    available: true,
    featured: true,
    customizations: teaCustomizations,
    preparationTime: 6
  },
  {
    id: "tea-07",
    name: "Honey Lemon Tea",
    description: "Fresh lemon juice combined with organic wild honey and hot water. A soothing and healthy beverage perfect for cold weather.",
    price: 80,
    category: "tea",
    image: "/images/products/Honey Lemon Tea.jpg",
    available: true,
    customizations: teaCustomizations,
    preparationTime: 3
  },

  // CATEGORY: COFFEE
  {
    id: "coffee-01",
    name: "Black Coffee",
    description: "Pure black coffee made from premium roasted beans. Strong, bold, and perfect for coffee purists.",
    price: 80,
    category: "coffee",
    image: "/images/products/Black Coffee.jpg",
    available: true,
    customizations: coffeeCustomizations,
    preparationTime: 3
  },
  {
    id: "coffee-02",
    name: "Milk Coffee",
    description: "Smooth coffee balanced with steamed milk. A classic comforting beverage with the perfect coffee-to-milk ratio.",
    price: 120,
    category: "coffee",
    image: "/images/products/Milk Coffee.jpg",
    available: true,
    customizations: coffeeCustomizations,
    preparationTime: 4
  },
  {
    id: "coffee-03",
    name: "Cappuccino",
    description: "Espresso combined with equal parts steamed milk and rich thick milk foam, finished with a dust of cocoa powder.",
    price: 180,
    category: "coffee",
    image: "/images/products/Cappuccin.jpg",
    available: true,
    customizations: coffeeCustomizations,
    preparationTime: 5
  },
  {
    id: "coffee-04",
    name: "Latte",
    description: "A double shot of espresso balanced with steamed milk and covered with a velvety light layer of micro-foam.",
    price: 190,
    category: "coffee",
    image: "/images/products/Latt.jpg",
    available: true,
    featured: true,
    customizations: coffeeCustomizations,
    preparationTime: 5
  },
  {
    id: "coffee-05",
    name: "Mocha",
    description: "Espresso shots combined with house dark chocolate sauce and steamed milk, capped with whipped cream and cocoa shavings.",
    price: 220,
    category: "coffee",
    image: "/images/products/Cappuccin.jpg",
    available: true,
    customizations: coffeeCustomizations,
    preparationTime: 6
  },
  {
    id: "coffee-06",
    name: "Cold Coffee",
    description: "Chilled coffee poured over ice with a splash of milk. A refreshing cold coffee beverage perfect for hot days.",
    price: 180,
    category: "coffee",
    image: "/images/products/Cold Coffee.jpg",
    available: true,
    customizations: coldDrinkCustomizations,
    preparationTime: 4
  },

  // CATEGORY: COLD DRINKS
  {
    id: "cold-01",
    name: "Iced Tea",
    description: "Refreshing black tea brewed and served over ice with a slice of lemon. A perfect cooling beverage.",
    price: 90,
    category: "cold-drinks",
    image: "/images/products/Lemon Tea.jpg",
    available: true,
    customizations: coldDrinkCustomizations,
    preparationTime: 3
  },
  {
    id: "cold-02",
    name: "Lemon Soda",
    description: "Fresh lemon juice mixed with sparkling soda and ice. A zesty, carbonated refresher.",
    price: 90,
    category: "cold-drinks",
    image: "/images/products/Lemon Soda.jpg",
    available: true,
    customizations: coldDrinkCustomizations,
    preparationTime: 2
  },
  {
    id: "cold-03",
    name: "Fresh Lime",
    description: "Freshly squeezed lime juice with soda water and ice. Simple, refreshing, and perfectly balanced.",
    price: 80,
    category: "cold-drinks",
    image: "/images/products/Fresh Lime.jpg",
    available: true,
    customizations: coldDrinkCustomizations,
    preparationTime: 2
  },
  {
    id: "cold-04",
    name: "Mango Juice",
    description: "Fresh mango juice made from ripe Alphonso mangoes. Sweet, tropical, and naturally refreshing.",
    price: 120,
    category: "cold-drinks",
    image: "/images/products/Mango Juice.jpg",
    available: true,
    featured: true,
    customizations: coldDrinkCustomizations,
    preparationTime: 3
  },
  {
    id: "cold-05",
    name: "Orange Juice",
    description: "Freshly squeezed orange juice packed with Vitamin C. A healthy and delicious morning choice.",
    price: 90,
    category: "cold-drinks",
    image: "/images/products/Orange Juice.jpg",
    available: true,
    customizations: coldDrinkCustomizations,
    preparationTime: 3
  },
  {
    id: "cold-06",
    name: "Mineral Water",
    description: "Premium mineral water, chilled and served. Pure hydration.",
    price: 30,
    category: "cold-drinks",
    image: "/images/products/Mineral Water.jpg",
    available: true,
    preparationTime: 1
  }
];

export const CATEGORY_MAP: Record<string, string> = {
  "all": "All Items",
  "tea": "Tea",
  "coffee": "Coffee",
  "cold-drinks": "Cold Drinks"
};
