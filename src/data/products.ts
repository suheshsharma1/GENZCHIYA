import { Product } from '../types';

export const products: Product[] = [
  // ===================== TEA =====================
  {
    id: "tea-01",
    name: "Milk Tea",
    description: "Classic milk tea brewed with premium black tea leaves and fresh whole milk. A comforting and creamy beverage perfect for any time of day.",
    price: 30,
    category: "tea",
    image: "/images/products/Milk Tea.jpg",
    available: true,
    featured: true,
    customizations: [
      {
        name: "Sugar Level",
        required: true,
        type: "select",
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
        type: "select",
        options: [
          { name: "Whole Milk", price: 0 },
          { name: "Oat Milk", price: 20 },
          { name: "Soy Milk", price: 15 }
        ]
      },
      {
        name: "Tea Strength",
        required: false,
        type: "select",
        options: [
          { name: "Regular Brew", price: 0 },
          { name: "Strong Brew", price: 5 }
        ]
      }
    ],
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
    customizations: [
      {
        name: "Sugar Level",
        required: true,
        type: "select",
        options: [
          { name: "Regular Sugar", price: 0 },
          { name: "No Sugar", price: 0 }
        ]
      },
      {
        name: "Tea Strength",
        required: true,
        type: "select",
        options: [
          { name: "Regular Brew", price: 0 },
          { name: "Strong Brew", price: 5 }
        ]
      }
    ],
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
    customizations: [
      {
        name: "Sweetness Level",
        required: true,
        type: "select",
        options: [
          { name: "No Sugar", price: 0 },
          { name: "Honey Instead", price: 10 }
        ]
      },
      {
        name: "Add-ons",
        required: false,
        type: "multiple",
        options: [
          { name: "Lemon Slice", price: 5 },
          { name: "Mint Leaves", price: 5 }
        ]
      }
    ],
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
    customizations: [
      {
        name: "Sugar Level",
        required: true,
        type: "select",
        options: [
          { name: "Regular Sugar", price: 0 },
          { name: "No Sugar", price: 0 },
          { name: "Honey Instead", price: 10 }
        ]
      },
      {
        name: "Lemon Intensity",
        required: false,
        type: "select",
        options: [
          { name: "Regular Lemon", price: 0 },
          { name: "Extra Lemon", price: 5 }
        ]
      }
    ],
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
    customizations: [
      {
        name: "Sugar Level",
        required: true,
        type: "select",
        options: [
          { name: "Regular Sugar", price: 0 },
          { name: "No Sugar", price: 0 },
          { name: "Honey Instead", price: 10 }
        ]
      },
      {
        name: "Ginger Intensity",
        required: false,
        type: "select",
        options: [
          { name: "Regular Ginger", price: 0 },
          { name: "Extra Ginger", price: 10 }
        ]
      }
    ],
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
    customizations: [
      {
        name: "Sugar Level",
        required: true,
        type: "select",
        options: [
          { name: "Regular Sugar", price: 0 },
          { name: "Less Sugar", price: 0 },
          { name: "No Sugar", price: 0 }
        ]
      },
      {
        name: "Milk Preference",
        required: true,
        type: "select",
        options: [
          { name: "Whole Milk", price: 0 },
          { name: "Oat Milk", price: 20 }
        ]
      },
      {
        name: "Spice Level",
        required: false,
        type: "select",
        options: [
          { name: "Regular Spice", price: 0 },
          { name: "Extra Masala", price: 10 }
        ]
      }
    ],
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
    customizations: [
      {
        name: "Honey Level",
        required: true,
        type: "select",
        options: [
          { name: "Regular Honey", price: 0 },
          { name: "Extra Honey", price: 15 }
        ]
      },
      {
        name: "Lemon Intensity",
        required: false,
        type: "select",
        options: [
          { name: "Regular Lemon", price: 0 },
          { name: "Extra Lemon", price: 5 }
        ]
      }
    ],
    preparationTime: 3
  },
  {
    id: "tea-08",
    name: "Matka Tea",
    description: "Traditional desi chai slow-cooked in an authentic earthen clay matka pot. The clay imparts a rich, smoky, earthy flavour unlike any other. Infused with cardamom, cinnamon & fresh ginger — a nostalgic cup that connects you to Nepali chai culture.",
    price: 60,
    category: "tea",
    image: "/images/products/Matka Tea.png",
    available: true,
    featured: true,
    customizations: [
      {
        name: "Sugar Level",
        required: true,
        type: "select",
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
        type: "select",
        options: [
          { name: "Whole Milk (Classic)", price: 0 },
          { name: "Buffalo Milk (Richer)", price: 20 },
          { name: "Oat Milk", price: 20 },
          { name: "Black / No Milk", price: 0 }
        ]
      },
      {
        name: "Matka Add-ons",
        required: false,
        type: "multiple",
        options: [
          { name: "Extra Cardamom", price: 10 },
          { name: "Saffron Touch", price: 30 },
          { name: "Tulsi Leaves", price: 10 },
          { name: "Ginger Boost", price: 10 }
        ]
      }
    ],
    preparationTime: 8
  },

  // ===================== COFFEE =====================
  {
    id: "coffee-01",
    name: "Black Coffee",
    description: "Pure black coffee made from premium roasted beans. Strong, bold, and perfect for coffee purists.",
    price: 80,
    category: "coffee",
    image: "/images/products/Black Coffee.jpg",
    available: true,
    customizations: [
      {
        name: "Sugar Level",
        required: true,
        type: "select",
        options: [
          { name: "Regular Sugar", price: 0 },
          { name: "No Sugar", price: 0 }
        ]
      },
      {
        name: "Add-ons",
        required: false,
        type: "multiple",
        options: [
          { name: "Extra Espresso Shot", price: 30 }
        ]
      }
    ],
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
    customizations: [
      {
        name: "Sugar Level",
        required: true,
        type: "select",
        options: [
          { name: "Regular Sugar", price: 0 },
          { name: "Less Sugar", price: 0 },
          { name: "No Sugar", price: 0 }
        ]
      },
      {
        name: "Milk Preference",
        required: true,
        type: "select",
        options: [
          { name: "Whole Milk", price: 0 },
          { name: "Oat Milk", price: 20 },
          { name: "Soy Milk", price: 15 }
        ]
      }
    ],
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
    customizations: [
      {
        name: "Sugar Level",
        required: true,
        type: "select",
        options: [
          { name: "Regular Sugar", price: 0 },
          { name: "No Sugar", price: 0 }
        ]
      },
      {
        name: "Milk Preference",
        required: true,
        type: "select",
        options: [
          { name: "Whole Milk", price: 0 },
          { name: "Oat Milk", price: 20 },
          { name: "Almond Milk", price: 20 }
        ]
      },
      {
        name: "Foam Level",
        required: false,
        type: "select",
        options: [
          { name: "Regular Foam", price: 0 },
          { name: "Extra Foam", price: 10 }
        ]
      }
    ],
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
    customizations: [
      {
        name: "Sugar Level",
        required: true,
        type: "select",
        options: [
          { name: "Regular Sugar", price: 0 },
          { name: "No Sugar", price: 0 }
        ]
      },
      {
        name: "Milk Preference",
        required: true,
        type: "select",
        options: [
          { name: "Whole Milk", price: 0 },
          { name: "Oat Milk", price: 20 },
          { name: "Soy Milk", price: 15 },
          { name: "Almond Milk", price: 20 }
        ]
      },
      {
        name: "Flavor Syrup",
        required: false,
        type: "multiple",
        options: [
          { name: "Vanilla Syrup", price: 15 },
          { name: "Caramel Drizzle", price: 15 },
          { name: "Hazelnut Syrup", price: 15 }
        ]
      }
    ],
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
    customizations: [
      {
        name: "Sugar Level",
        required: true,
        type: "select",
        options: [
          { name: "Regular Sugar", price: 0 },
          { name: "No Sugar", price: 0 }
        ]
      },
      {
        name: "Milk Preference",
        required: true,
        type: "select",
        options: [
          { name: "Whole Milk", price: 0 },
          { name: "Oat Milk", price: 20 }
        ]
      },
      {
        name: "Chocolate Intensity",
        required: false,
        type: "select",
        options: [
          { name: "Regular Chocolate", price: 0 },
          { name: "Extra Dark Chocolate", price: 20 }
        ]
      },
      {
        name: "Add-ons",
        required: false,
        type: "multiple",
        options: [
          { name: "Whipped Cream", price: 20 },
          { name: "Cocoa Shavings", price: 10 }
        ]
      }
    ],
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
    customizations: [
      {
        name: "Ice Level",
        required: true,
        type: "select",
        options: [
          { name: "Regular Ice", price: 0 },
          { name: "Less Ice", price: 0 },
          { name: "No Ice", price: 0 }
        ]
      },
      {
        name: "Milk Preference",
        required: true,
        type: "select",
        options: [
          { name: "Whole Milk", price: 0 },
          { name: "Oat Milk", price: 20 }
        ]
      },
      {
        name: "Add-ons",
        required: false,
        type: "multiple",
        options: [
          { name: "Whipped Cream", price: 20 },
          { name: "Extra Espresso Shot", price: 30 }
        ]
      }
    ],
    preparationTime: 4
  },

  // ===================== COLD DRINKS =====================
  {
    id: "cold-01",
    name: "Iced Tea",
    description: "Refreshing black tea brewed and served over ice with a slice of lemon. A perfect cooling beverage.",
    price: 90,
    category: "cold-drinks",
    image: "/images/products/Lemon Tea.jpg",
    available: true,
    customizations: [
      {
        name: "Ice Level",
        required: true,
        type: "select",
        options: [
          { name: "Regular Ice", price: 0 },
          { name: "Less Ice", price: 0 },
          { name: "No Ice", price: 0 }
        ]
      },
      {
        name: "Sweetness Level",
        required: false,
        type: "select",
        options: [
          { name: "Regular Sweet", price: 0 },
          { name: "Less Sweet", price: 0 },
          { name: "Unsweetened", price: 0 }
        ]
      },
      {
        name: "Add-ons",
        required: false,
        type: "multiple",
        options: [
          { name: "Tapioca Pearls (Boba)", price: 30 },
          { name: "Mango Popping Boba", price: 30 }
        ]
      }
    ],
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
    customizations: [
      {
        name: "Ice Level",
        required: true,
        type: "select",
        options: [
          { name: "Regular Ice", price: 0 },
          { name: "Less Ice", price: 0 },
          { name: "No Ice", price: 0 }
        ]
      },
      {
        name: "Sweet or Salty",
        required: true,
        type: "select",
        options: [
          { name: "Sweet", price: 0 },
          { name: "Salty", price: 0 },
          { name: "Sweet & Salty Mix", price: 0 }
        ]
      }
    ],
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
    customizations: [
      {
        name: "Ice Level",
        required: true,
        type: "select",
        options: [
          { name: "Regular Ice", price: 0 },
          { name: "Less Ice", price: 0 },
          { name: "No Ice", price: 0 }
        ]
      },
      {
        name: "Sweet or Salty",
        required: true,
        type: "select",
        options: [
          { name: "Sweet", price: 0 },
          { name: "Salty", price: 0 }
        ]
      }
    ],
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
    customizations: [
      {
        name: "Ice Level",
        required: true,
        type: "select",
        options: [
          { name: "Regular Ice", price: 0 },
          { name: "No Ice", price: 0 }
        ]
      },
      {
        name: "Pulp Level",
        required: false,
        type: "select",
        options: [
          { name: "Regular Pulp", price: 0 },
          { name: "Extra Pulp", price: 10 },
          { name: "No Pulp", price: 0 }
        ]
      }
    ],
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
    customizations: [
      {
        name: "Ice Level",
        required: true,
        type: "select",
        options: [
          { name: "Regular Ice", price: 0 },
          { name: "No Ice", price: 0 }
        ]
      },
      {
        name: "Pulp Level",
        required: false,
        type: "select",
        options: [
          { name: "Regular Pulp", price: 0 },
          { name: "No Pulp", price: 0 }
        ]
      }
    ],
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
    // Bottled item — intentionally no customizations
    preparationTime: 1
  },
  {
    id: "cold-13",
    name: "Coca-Cola",
    description: "Chilled Coca-Cola served cold.",
    price: 80,
    category: "cold-drinks",
    image: "/images/products/Coca-Cola.jpg",
    available: true,
    customizations: [
      {
        name: "Ice Level",
        required: true,
        type: "select",
        options: [
          { name: "Regular Ice", price: 0 },
          { name: "Less Ice", price: 0 },
          { name: "No Ice", price: 0 }
        ]
      }
    ],
    preparationTime: 1
  },
  {
    id: "cold-14",
    name: "Pepsi",
    description: "Refreshing Pepsi served chilled.",
    price: 80,
    category: "cold-drinks",
    image: "/images/products/Pepsi.jpg",
    available: true,
    customizations: [
      {
        name: "Ice Level",
        required: true,
        type: "select",
        options: [
          { name: "Regular Ice", price: 0 },
          { name: "Less Ice", price: 0 },
          { name: "No Ice", price: 0 }
        ]
      }
    ],
    preparationTime: 1
  },
  {
    id: "cold-15",
    name: "Fanta",
    description: "Orange-flavoured Fanta served cold.",
    price: 80,
    category: "cold-drinks",
    image: "/images/products/fantas.jpg",
    available: true,
    customizations: [
      {
        name: "Ice Level",
        required: true,
        type: "select",
        options: [
          { name: "Regular Ice", price: 0 },
          { name: "Less Ice", price: 0 },
          { name: "No Ice", price: 0 }
        ]
      }
    ],
    preparationTime: 1
  },
  {
    id: "cold-16",
    name: "Sprite",
    description: "Crisp lemon-lime Sprite served chilled.",
    price: 80,
    category: "cold-drinks",
    image: "/images/products/Sprite-.jpg",
    available: true,
    customizations: [
      {
        name: "Ice Level",
        required: true,
        type: "select",
        options: [
          { name: "Regular Ice", price: 0 },
          { name: "Less Ice", price: 0 },
          { name: "No Ice", price: 0 }
        ]
      }
    ],
    preparationTime: 1
  },
  {
    id: "cold-17",
    name: "Mountain Dew",
    description: "Ice-cold Mountain Dew with a citrus flavour.",
    price: 90,
    category: "cold-drinks",
    image: "/images/products/Mountain Dew.jpg",
    available: true,
    customizations: [
      {
        name: "Ice Level",
        required: true,
        type: "select",
        options: [
          { name: "Regular Ice", price: 0 },
          { name: "Less Ice", price: 0 },
          { name: "No Ice", price: 0 }
        ]
      }
    ],
    preparationTime: 1
  }
];

export const CATEGORY_MAP: Record<string, string> = {
  "all": "All Items",
  "tea": "Tea",
  "coffee": "Coffee",
  "cold-drinks": "Cold Drinks"
};