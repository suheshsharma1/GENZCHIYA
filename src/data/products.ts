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

export const products: Product[] = [];


export const CATEGORY_MAP: Record<string, string> = {
  "all": "All Items",
  "tea": "Tea",
  "coffee": "Coffee",
  "cold-drinks": "Cold Drinks"
};
