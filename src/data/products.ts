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

const burgerCustomizations = [
  {
    name: "Preparation Notes",
    required: true,
    type: "select" as const,
    options: [
      { name: "Regular (Medium Spicy)", price: 0 },
      { name: "Mild / No Spice", price: 0 },
      { name: "Extra Spicy", price: 0 }
    ]
  },
  {
    name: "Burger Upgrades",
    required: false,
    type: "multiple" as const,
    options: [
      { name: "Extra Cheddar Cheese Slice", price: 20 },
      { name: "Double Patty (Extra Meat)", price: 60 },
      { name: "Add Crispy Bacon (Chicken)", price: 40 },
      { name: "Add Fried Egg", price: 20 }
    ]
  }
];

const pizzaCustomizations = [
  {
    name: "Crust Type",
    required: true,
    type: "select" as const,
    options: [
      { name: "Classic Thin Crust", price: 0 },
      { name: "Hand-Tossed Pan Crust", price: 20 },
      { name: "Cheese Burst Crust", price: 50 }
    ]
  },
  {
    name: "Extra Toppings",
    required: false,
    type: "multiple" as const,
    options: [
      { name: "Extra Mozzarella Cheese", price: 30 },
      { name: "Black Olives & Jalapenos", price: 20 },
      { name: "Smoked Chicken Shreds", price: 40 },
      { name: "Fresh Mushrooms", price: 20 }
    ]
  }
];

const momoCustomizations = [
  {
    name: "Preparation Style",
    required: true,
    type: "select" as const,
    options: [
      { name: "Classic Steamed", price: 0 },
      { name: "Crispy Kothey (Half Fried)", price: 30 },
      { name: "Traditional Jhol (Spicy Soup)", price: 40 },
      { name: "Hot Chilli (C-Momo Sauce)", price: 50 }
    ]
  },
  {
    name: "Extra Chutney",
    required: false,
    type: "multiple" as const,
    options: [
      { name: "Fiery Tomato Chutney", price: 15 },
      { name: "Yellow Sesame Jhol Soup", price: 25 }
    ]
  }
];

const pastaCustomizations = [
  {
    name: "Cheese & Spice Options",
    required: false,
    type: "multiple" as const,
    options: [
      { name: "Extra Parmesan Cheese", price: 25 },
      { name: "Extra Garlic Bread (2 pcs)", price: 20 },
      { name: "Make it Extra Spicy", price: 0 }
    ]
  }
];

const bakeryCustomizations = [
  {
    name: "Serving Method",
    required: true,
    type: "select" as const,
    options: [
      { name: "Serve Heated (Warm)", price: 0 },
      { name: "Serve Normal (Cold)", price: 0 }
    ]
  },
  {
    name: "Toppings",
    required: false,
    type: "multiple" as const,
    options: [
      { name: "Scoop of Vanilla Ice Cream", price: 30 },
      { name: "Extra Chocolate Drizzle", price: 10 }
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
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
    image: "",
    available: true,
    preparationTime: 1
  },

  // CATEGORY: SNACKS
  {
    id: "snack-01",
    name: "Veg Momo",
    description: "Traditional Nepali dumplings stuffed with finely minced seasoned cabbage, carrots, paneer, and onions. Served with sesame tomato chutney.",
    price: 140,
    category: "snacks",
    image: "",
    available: true,
    customizations: momoCustomizations,
    preparationTime: 12
  },
  {
    id: "snack-02",
    name: "Chicken Momo",
    description: "Minced chicken breast seasoned with spring onion, ginger-garlic paste, and traditional spices, wrapped in thin dough. Hand-folded.",
    price: 160,
    category: "snacks",
    image: "",
    available: true,
    featured: true,
    customizations: momoCustomizations,
    preparationTime: 12
  },
  {
    id: "snack-03",
    name: "French Fries",
    description: "Crispy golden potato fries, lightly salted and served hot with tomato ketchup and garlic mayonnaise.",
    price: 150,
    category: "snacks",
    image: "",
    available: true,
    preparationTime: 8
  },
  {
    id: "snack-04",
    name: "Potato Wedges",
    description: "Seasoned potato wedges baked until crispy and golden. Served with sour cream dip.",
    price: 160,
    category: "snacks",
    image: "",
    available: true,
    preparationTime: 10
  },
  {
    id: "snack-05",
    name: "Chicken Sausage",
    description: "Grilled chicken sausage served with mustard and bread rolls. A protein-rich snack.",
    price: 180,
    category: "snacks",
    image: "",
    available: true,
    preparationTime: 8
  },
  {
    id: "snack-06",
    name: "Chicken Nuggets",
    description: "Breaded, juicy chicken breast pieces fried until crispy. Served with sweet chilli sauce and honey mustard.",
    price: 220,
    category: "snacks",
    image: "",
    available: true,
    preparationTime: 9
  },

  // CATEGORY: SANDWICHES
  {
    id: "sand-01",
    name: "Veg Sandwich",
    description: "Fresh vegetables including cucumber, tomato, onion, and lettuce with cheese and mayonnaise in toasted bread.",
    price: 130,
    category: "sandwich",
    image: "",
    available: true,
    preparationTime: 6
  },
  {
    id: "sand-02",
    name: "Chicken Sandwich",
    description: "Grilled chicken breast with fresh vegetables, cheese, and special sauce in toasted bread.",
    price: 170,
    category: "sandwich",
    image: "",
    available: true,
    featured: true,
    preparationTime: 8
  },
  {
    id: "sand-03",
    name: "Cheese Sandwich",
    description: "Melted cheddar and mozzarella cheese between toasted bread slices. Simple and delicious.",
    price: 160,
    category: "sandwich",
    image: "",
    available: true,
    preparationTime: 5
  },
  {
    id: "sand-04",
    name: "Egg Sandwich",
    description: "Scrambled eggs with fresh vegetables and mayonnaise in toasted bread. A protein-packed breakfast option.",
    price: 140,
    category: "sandwich",
    image: "",
    available: true,
    preparationTime: 6
  },

  // CATEGORY: BURGERS
  {
    id: "burg-01",
    name: "Chicken Burger",
    description: "Crispy chicken patty with lettuce, tomato, cheese, and special sauce in a toasted bun.",
    price: 200,
    category: "burger",
    image: "",
    available: true,
    customizations: burgerCustomizations,
    preparationTime: 12
  },
  {
    id: "burg-02",
    name: "Veg Burger",
    description: "Crispy vegetable patty with fresh vegetables, cheese, and house sauce in a toasted bun.",
    price: 160,
    category: "burger",
    image: "",
    available: true,
    customizations: burgerCustomizations,
    preparationTime: 10
  },
  {
    id: "burg-03",
    name: "Cheese Burger",
    description: "Juicy beef or chicken patty with melted cheddar cheese, lettuce, tomato, and special sauce.",
    price: 220,
    category: "burger",
    image: "",
    available: true,
    featured: true,
    customizations: burgerCustomizations,
    preparationTime: 12
  },

  // CATEGORY: PIZZA
  {
    id: "piz-01",
    name: "Veg Pizza",
    description: "Classic pizza topped with bell peppers, onions, mushrooms, olives, and mozzarella cheese on tomato sauce base.",
    price: 320,
    category: "pizza",
    image: "",
    available: true,
    customizations: pizzaCustomizations,
    preparationTime: 15
  },
  {
    id: "piz-02",
    name: "Chicken Pizza",
    description: "Pizza topped with grilled chicken, bell peppers, onions, and mozzarella cheese on tomato sauce base.",
    price: 380,
    category: "pizza",
    image: "",
    available: true,
    featured: true,
    customizations: pizzaCustomizations,
    preparationTime: 16
  },

  // CATEGORY: NOODLES
  {
    id: "nood-01",
    name: "Veg Chowmein",
    description: "Wok-tossed noodles with shredded cabbage, carrots, bell peppers, spring onions, and soy sauce.",
    price: 140,
    category: "noodles",
    image: "",
    available: true,
    preparationTime: 10
  },
  {
    id: "nood-02",
    name: "Chicken Chowmein",
    description: "Stir-fried noodles with chicken, vegetables, and savory sauce. A flavorful and satisfying meal.",
    price: 180,
    category: "noodles",
    image: "",
    available: true,
    featured: true,
    preparationTime: 12
  },

  // CATEGORY: PASTA
  {
    id: "past-01",
    name: "White Sauce Pasta",
    description: "Penne pasta in rich creamy white sauce with mushrooms, bell peppers, and parmesan cheese.",
    price: 250,
    category: "pasta",
    image: "",
    available: true,
    customizations: pastaCustomizations,
    preparationTime: 12
  },
  {
    id: "past-02",
    name: "Red Sauce Pasta",
    description: "Penne pasta in zesty tomato sauce with garlic, herbs, and vegetables. A classic Italian favorite.",
    price: 240,
    category: "pasta",
    image: "",
    available: true,
    customizations: pastaCustomizations,
    preparationTime: 12
  },

  // CATEGORY: BAKERY & DESSERTS
  {
    id: "bak-01",
    name: "Chocolate Cake",
    description: "Rich and moist chocolate cake layered with chocolate ganache. A chocolate lover's dream.",
    price: 120,
    category: "bakery",
    image: "",
    available: true,
    customizations: bakeryCustomizations,
    preparationTime: 2
  },
  {
    id: "bak-02",
    name: "Vanilla Cake",
    description: "Light and fluffy vanilla sponge cake with creamy vanilla frosting. Simple and elegant.",
    price: 100,
    category: "bakery",
    image: "",
    available: true,
    customizations: bakeryCustomizations,
    preparationTime: 2
  },
  {
    id: "bak-03",
    name: "Brownie",
    description: "Rich, dense, and chewy chocolate brownie. Served warm and fudgy.",
    price: 100,
    category: "bakery",
    image: "",
    available: true,
    customizations: bakeryCustomizations,
    preparationTime: 3
  },
  {
    id: "bak-04",
    name: "Donut",
    description: "Soft and fluffy glazed donut. A sweet treat perfect with coffee.",
    price: 80,
    category: "bakery",
    image: "",
    available: true,
    customizations: bakeryCustomizations,
    preparationTime: 2
  },
  {
    id: "bak-05",
    name: "Chocolate Cookie",
    description: "Soft-baked chocolate chip cookie with melted chocolate chunks. Warm and comforting.",
    price: 50,
    category: "bakery",
    image: "",
    available: true,
    preparationTime: 1
  },
  {
    id: "bak-06",
    name: "Muffin",
    description: "Freshly baked muffin available in various flavors. A perfect breakfast or snack item.",
    price: 70,
    category: "bakery",
    image: "",
    available: true,
    customizations: bakeryCustomizations,
    preparationTime: 2
  },

  // CATEGORY: BREAKFAST
  {
    id: "break-01",
    name: "Boiled Egg",
    description: "Perfectly boiled eggs served with salt and pepper. A protein-rich healthy breakfast option.",
    price: 40,
    category: "breakfast",
    image: "",
    available: true,
    preparationTime: 5
  },
  {
    id: "break-02",
    name: "Omelette",
    description: "Fluffy omelette made with fresh eggs, onions, tomatoes, and herbs. Served with toast.",
    price: 100,
    category: "breakfast",
    image: "",
    available: true,
    featured: true,
    preparationTime: 8
  },
  {
    id: "break-03",
    name: "Toast with Butter",
    description: "Crispy toasted bread slices topped with creamy butter. Simple and satisfying.",
    price: 80,
    category: "breakfast",
    image: "",
    available: true,
    preparationTime: 3
  },
  {
    id: "break-04",
    name: "Toast with Jam",
    description: "Crispy toasted bread slices topped with fruit jam. A sweet breakfast classic.",
    price: 90,
    category: "breakfast",
    image: "",
    available: true,
    preparationTime: 3
  }
];

export const CATEGORY_MAP: Record<string, string> = {
  "all": "All Items",
  "tea": "Tea",
  "coffee": "Coffee",
  "cold-drinks": "Cold Drinks",
  "snacks": "Snacks",
  "sandwich": "Sandwiches",
  "burger": "Burgers",
  "pizza": "Pizza",
  "noodles": "Noodles",
  "pasta": "Pasta",
  "bakery": "Bakery & Desserts",
  "breakfast": "Breakfast"
};
