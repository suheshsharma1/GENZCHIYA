import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, Order, CartItem, SelectedCustomization, OrderStatus, PaymentMethod, Coupon, SalesReport, Review, PricingBreakdown, ContactMessage } from '../types';
import { products as initialProducts } from '../data/products';
import { coupons } from '../data/coupons';
import { calculateCartPricing } from '../utils/pricing';

interface AppContextType {
  products: Product[];
  categories: string[];
  orders: Order[];
  orderHistory: Order[];
  reviews: Review[];
  messages: ContactMessage[];
  cart: CartItem[];
  activeTable: string;
  totalTables: number;
  setTotalTables: (count: number) => void;
  currentOrderId: string | null;
  activeCoupon: Coupon | null;
  couponsList: Coupon[];
  teaGroupCount: number;
  celebrationActive: boolean;
  celebrationMessage: string;
  celebrateFreeTea: () => void;
  dismissCelebration: () => void;
  favorites: string[];
  userRole: 'customer' | 'cashier' | 'kitchen' | null;
  setUserRole: (role: 'customer' | 'cashier' | 'kitchen' | null) => void;
  currentTrackingOrder: Order | null;
  setTable: (table: string) => void;
  switchTable: (table: string) => void;
  startNewSession: () => void;
  getTableStatus: (tableNum: string) => 'available' | 'occupied';
  getTableOrderId: (tableNum: string) => string | null;
  getTableOccupiedAt: (tableNum: string) => string | null;
  getTableOrder: (tableNum: string) => Order | null;
  lockTable: (tableNum: string, orderId?: string) => void;
  unlockTable: (tableNum: string) => void;
  markTableAvailable: (tableNum: string) => void;
  freeTable: (tableNum: string) => void;
  resetAllTableStatuses: () => void;
  addToCart: (product: Product, quantity: number, customizations: SelectedCustomization[], notes?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (newCoupon: Coupon) => boolean;
  deleteCoupon: (code: string) => void;
  calculateCartPricing: (cart: CartItem[], couponDiscount?: number) => PricingBreakdown;
  placeOrder: (tableNumber: string, paymentMethod: PaymentMethod, customerPhone?: string, notes?: string) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, extra?: { rejectionReason?: string; estTime?: number; isPriority?: boolean }) => void;
  markCashAsPaid: (orderId: string) => void;
  toggleProductAvailability: (productId: string) => void;
  updateProductPrice: (productId: string, price: number) => void;
  updateProductImage: (productId: string, image: string) => void;
   addProduct: (product: Omit<Product, 'id' | 'available'>) => void;
  addCategory: (name: string) => boolean;
  renameCategory: (oldName: string, newName: string) => boolean;
  deleteCategory: (name: string) => void;
  moveProductsToCategory: (productIds: string[], targetCategory: string) => void;
  updateProduct: (productId: string, updates: { name: string; price: number; category: string; description: string; preparationTime: number; image: string }) => void;
  deleteProduct: (productId: string) => void;
  deleteProducts: (productIds: string[]) => void;
  toggleFavorite: (productId: string) => void;
  getSalesReport: () => SalesReport;
  resetAllData: () => void;
  clearPaymentHistory: () => void;
  injectDemoOrder: (type: 'matka' | 'bogo' | 'rush') => Order;
  logoutStaff: () => void;
  loginStaff: (role: 'cashier' | 'kitchen') => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setOrderHistory: (history: Order[]) => void;
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) => Review;
  updateReview: (reviewId: string, updates: { rating?: number; comment?: string }) => void;
  deleteReview: (reviewId: string) => void;
  addContactMessage: (message: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) => void;
  markMessageAsRead: (messageId: string) => void;
  deleteMessage: (messageId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to generate a unique cart item ID based on product ID and selected customizations
const generateCartItemId = (productId: string, customizations: SelectedCustomization[]): string => {
  const sortedCustomizations = [...customizations].sort((a, b) => a.name.localeCompare(b.name));
  const serialized = sortedCustomizations.map(c => `${c.name}:${c.selections.map(s => s.name).sort().join(',')}`).join('|');
  return `${productId}_${serialized}`;
};

// Generates 20 high-quality historical mock orders for rich graphs
  const generateMockOrders = (productsList: Product[]): Order[] => {
    if (!productsList || productsList.length === 0) return [];
    const mockOrders: Order[] = [];
    const paymentMethods: PaymentMethod[] = ['khalti', 'cash'];
  
  // Set date ranges over the last 30 days
  const now = new Date();
  
  for (let i = 1; i <= 20; i++) {
    const daysAgo = Math.floor(Math.random() * 29);
    const orderDate = new Date();
    orderDate.setDate(now.getDate() - daysAgo);
    orderDate.setHours(9 + Math.floor(Math.random() * 11), Math.floor(Math.random() * 60)); // Between 9 AM and 8 PM

    // Select 1 to 4 random products
    const itemCount = 1 + Math.floor(Math.random() * 3);
    const cartItems: CartItem[] = [];
    let subtotal = 0;

    for (let j = 0; j < itemCount; j++) {
      const randProd = productsList[Math.floor(Math.random() * productsList.length)];
      const qty = 1 + Math.floor(Math.random() * 2);
      
      // Basic customization simulation
      const selectedCustomizations: SelectedCustomization[] = [];
      let customizationCost = 0;
      
      if (randProd.customizations) {
        randProd.customizations.forEach(cust => {
          if (cust.options.length > 0) {
            const opt = cust.options[Math.floor(Math.random() * cust.options.length)];
            selectedCustomizations.push({
              name: cust.name,
              selections: [{ name: opt.name, price: opt.price }]
            });
            customizationCost += opt.price;
          }
        });
      }

      const itemPrice = randProd.price + customizationCost;
      cartItems.push({
        id: `${randProd.id}_mock_${j}`,
        product: randProd,
        quantity: qty,
        selectedCustomizations
      });
      subtotal += itemPrice * qty;
    }

    // Apply VAT (13%) and Service Charge (10%)
    const serviceCharge = 0; // Math.round(subtotal * 0.10);
    const tax = 0; // Math.round((subtotal + serviceCharge) * 0.13);
    
    // Random discount
    let discount = 0;
    if (Math.random() > 0.6) {
      discount = Math.random() > 0.5 ? 50 : Math.round(subtotal * 0.10);
    }
    
    const total = subtotal - discount;
    const pMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const table = String(1 + Math.floor(Math.random() * 25));

    const dateStr = orderDate.toISOString();

    mockOrders.push({
      id: `CS-${1000 + i}`,
      tableNumber: table,
      customerPhone: '9841' + Math.floor(100000 + Math.random() * 900000),
      items: cartItems,
      subtotal,
      serviceCharge,
      tax,
      discount,
      total,
      status: 'completed',
      payment: {
        method: pMethod,
        status: 'success',
        transactionId: pMethod !== 'cash' ? `TXN-${Math.floor(Math.random() * 900000000)}` : undefined,
        mobileNumber: pMethod === 'khalti' ? '9841555666' : undefined,
        paidAt: dateStr
      },
      createdAt: dateStr,
      updatedAt: dateStr
    });
  }

  // Sort orders chronologically
  return mockOrders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};



export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('gc_products');
    const CURRENT_MENU_VERSION = 'v12-cold-drinks-2026';
    const savedVersion = localStorage.getItem('gc_menu_version');

    const loadProducts = (prods: Product[]): Product[] => {
      return prods.map(p => {
        // Always refresh image from the source product data so external/relative paths stay current
        const match = initialProducts.find(ip => ip.id === p.id);
        if (match) {
          return { ...p, image: match.image };
        }
        return p;
      });
    };

    if (saved && savedVersion !== CURRENT_MENU_VERSION) {
      try {
        const oldProducts: Product[] = JSON.parse(saved);
        const customProducts = oldProducts.filter(p => p.id.startsWith('prod-'));
        const mergedProducts = [...customProducts, ...initialProducts];

        localStorage.removeItem('gc_products');
        localStorage.removeItem('gc_categories');
        localStorage.removeItem('gc_orders');
        localStorage.removeItem('gc_cart');
        localStorage.removeItem('gc_favorites');
        localStorage.setItem('gc_menu_version', CURRENT_MENU_VERSION);
        return loadProducts(mergedProducts);
      } catch (err) {
        console.error('Failed to merge old products on version upgrade', err);
        localStorage.setItem('gc_menu_version', CURRENT_MENU_VERSION);
        return initialProducts;
      }
    }

    if (!saved) {
      localStorage.setItem('gc_menu_version', CURRENT_MENU_VERSION);
    }

    try {
      const parsed = saved ? JSON.parse(saved) : initialProducts;
      return loadProducts(parsed);
    } catch (e) {
      return initialProducts;
    }
  });

  // Authoritative, ordered category list (persisted so custom categories survive
  // even when empty, and deleted categories stay deleted after refresh).
  const [categories, setCategories] = useState<string[]>(() => {
    const deriveFromProducts = (list: Product[]): string[] => {
      const seen = new Set<string>();
      const out: string[] = [];
      list.forEach(p => {
        if (p.category && !seen.has(p.category)) {
          seen.add(p.category);
          out.push(p.category);
        }
      });
      return out;
    };

    const stored = localStorage.getItem('gc_categories');
    if (stored) {
      try {
        const saved: string[] = JSON.parse(stored);
        if (Array.isArray(saved)) {
          // Merge persisted order with any categories present in current products
          const merged = [...saved.filter(c => typeof c === 'string')];
          deriveFromProducts(initialProducts).forEach(c => {
            if (!merged.includes(c)) merged.push(c);
          });
          return merged;
        }
      } catch (err) {
        console.error('Failed to parse gc_categories from storage', err);
      }
    }
    return deriveFromProducts(initialProducts);
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('gc_orders');
    const updateOrderImages = (parsedOrders: Order[]): Order[] => {
      return parsedOrders.map(order => ({
        ...order,
        items: order.items.map(item => {
          const match = initialProducts.find(ip => ip.id === item.product.id);
          if (match && !item.product.image) {
            return { ...item, product: { ...item.product, image: match.image } };
          }
          return item;
        })
      }));
    };

    if (saved) {
      try {
        const parsed: Order[] = JSON.parse(saved);
        const activeOnly = parsed.filter(o => !['completed', 'served', 'Completed', 'Served'].includes(o.status));
        return updateOrderImages(activeOnly);
      } catch (err) {
        console.error('Failed to parse gc_orders from storage', err);
      }
    }
    return [];
  });

  const [orderHistory, setOrderHistory] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orderHistory') || localStorage.getItem('gc_order_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (err) {
        console.error('Failed to parse gc_order_history from storage', err);
      }
    }
    const mocks = generateMockOrders(initialProducts);
    localStorage.setItem('orderHistory', JSON.stringify(mocks));
    localStorage.setItem('gc_order_history', JSON.stringify(mocks));
    return mocks;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('gc_cart');
    if (saved) {
      try {
        const parsed: CartItem[] = JSON.parse(saved);
        return parsed.map(item => {
          const match = initialProducts.find(ip => ip.id === item.product.id);
          if (match && !item.product.image) {
            return { ...item, product: { ...item.product, image: match.image } };
          }
          return item;
        });
      } catch (err) {
        console.error('Failed to parse gc_cart from storage', err);
      }
    }
    return [];
  });

  const [activeTable, setActiveTable] = useState<string>(() => {
    return localStorage.getItem('gc_active_table') || '';
  });

  const [totalTables, setTotalTablesState] = useState<number>(() => {
    const saved = localStorage.getItem('gc_total_tables');
    return saved ? parseInt(saved, 10) || 20 : 20;
  });

interface TableStatusEntry {
  status: 'available' | 'occupied';
  orderId: string | null;
  occupiedAt: string | null;
}

  const [tableStatuses, setTableStatuses] = useState<Record<string, TableStatusEntry>>(() => {
    const saved = localStorage.getItem('gc_table_statuses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  });

  const setTotalTables = (count: number) => {
    const validCount = Math.max(1, Math.min(100, count));
    setTotalTablesState(validCount);
    localStorage.setItem('gc_total_tables', validCount.toString());
  };

  useEffect(() => {
    localStorage.setItem('gc_table_statuses', JSON.stringify(tableStatuses));
  }, [tableStatuses]);

  const getTableStatus = (tableNum: string): 'available' | 'occupied' => {
    return tableStatuses[tableNum]?.status || 'available';
  };

  const getTableOrderId = (tableNum: string): string | null => {
    return tableStatuses[tableNum]?.orderId || null;
  };

  const getTableOccupiedAt = (tableNum: string): string | null => {
    return tableStatuses[tableNum]?.occupiedAt || null;
  };

  const getTableOrder = (tableNum: string): Order | null => {
    const orderId = tableStatuses[tableNum]?.orderId;
    if (!orderId) return null;
    return orders.find(o => o.id === orderId) || orderHistory.find(o => o.id === orderId) || null;
  };

  const lockTable = (tableNum: string, orderId?: string) => {
    setTableStatuses(prev => ({
      ...prev,
      [tableNum]: {
        status: 'occupied',
        orderId: orderId || null,
        occupiedAt: new Date().toISOString(),
      },
    }));
  };

  const unlockTable = (tableNum: string) => {
    setTableStatuses(prev => ({
      ...prev,
      [tableNum]: { status: 'available', orderId: null, occupiedAt: null },
    }));
  };

  const markTableAvailable = (tableNum: string) => {
    unlockTable(tableNum);
  };

  const freeTable = (tableNum: string) => {
    setTableStatuses(prev => ({
      ...prev,
      [tableNum]: { status: 'available', orderId: null, occupiedAt: null },
    }));
  };

  const resetAllTableStatuses = () => {
    setTableStatuses({});
  };

  const [currentOrderId, setCurrentOrderId] = useState<string | null>(() => {
    return localStorage.getItem('gc_current_order_id') || null;
  });

  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(() => {
    const saved = localStorage.getItem('gc_active_coupon');
    return saved ? JSON.parse(saved) : null;
  });

  const [couponsList, setCouponsList] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('gc_coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Failed to parse gc_coupons from storage', err);
      }
    }
    return coupons;
  });

   // Group-of-5 tea discount system
   const [teaGroupCount, setTeaGroupCount] = useState<number>(() => {
     const raw = localStorage.getItem('gc_tea_group_count');
     const saved = raw ? parseInt(raw, 10) : 0;
     return Number.isNaN(saved) ? 0 : saved;
   });
   const [prevGroup, setPrevGroup] = useState<number>(() => {
     const raw = localStorage.getItem('gc_prev_group');
     const saved = raw ? parseInt(raw, 10) : 0;
     return Number.isNaN(saved) ? 0 : saved;
   });
   const [celebrationActive, setCelebrationActive] = useState(false);
   const [celebrationMessage, setCelebrationMessage] = useState('');
   const toastTimeoutRef = useRef<number | null>(null);
   const celebrateFreeTea = () => {
     setCelebrationMessage('Congratulations! 🎉 You got 1 cup free — Pay only for 4 cups!');
     setCelebrationActive(true);
     if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
     toastTimeoutRef.current = window.setTimeout(() => setCelebrationActive(false), 4000);
   };
   const dismissCelebration = () => {
     setCelebrationActive(false);
   };

   // Persist prevGroup to localStorage
   useEffect(() => {
     try { localStorage.setItem('gc_prev_group', prevGroup.toString()); } catch { /* ignore */ }
   }, [prevGroup]);

   const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('gc_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [userRole, setUserRole] = useState<'customer' | 'cashier' | 'kitchen' | null>(() => {
    return (localStorage.getItem('gc_user_role') as any) || 'customer';
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('gc_reviews');
    if (saved) {
      try {
        const parsed: Review[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (err) {
        console.error('Failed to parse gc_reviews from storage', err);
      }
    }
    return [];
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('gc_messages');
    if (saved) {
      try {
        const parsed: ContactMessage[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (err) {
        console.error('Failed to parse gc_messages from storage', err);
      }
    }
    return [];
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('gc_theme') === 'dark';
  });

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('gc_theme', next ? 'dark' : 'light');
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const [currentTrackingOrder, setCurrentTrackingOrder] = useState<Order | null>(() => {
    const saved = localStorage.getItem('gc_tracking_order');
    if (saved) {
      try {
        const order: Order = JSON.parse(saved);
        return {
          ...order,
          items: order.items.map(item => {
            const match = initialProducts.find(ip => ip.id === item.product.id);
            if (match && !item.product.image) {
              return { ...item, product: { ...item.product, image: match.image } };
            }
            return item;
          })
        };
      } catch (err) {
        console.error('Failed to parse gc_tracking_order from storage', err);
      }
    }
    return null;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('gc_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('gc_active_table', activeTable);
  }, [activeTable]);

  useEffect(() => {
    if (currentOrderId) {
      localStorage.setItem('gc_current_order_id', currentOrderId);
    } else {
      localStorage.removeItem('gc_current_order_id');
    }
  }, [currentOrderId]);

  useEffect(() => {
    localStorage.setItem('gc_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('gc_orders', JSON.stringify(orders));
    
    // Update tracking order in real-time if active in session
    if (currentTrackingOrder) {
      const updated = orders.find(o => o.id === currentTrackingOrder.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(currentTrackingOrder)) {
        setCurrentTrackingOrder(updated);
        localStorage.setItem('gc_tracking_order', JSON.stringify(updated));
      }
    }
  }, [orders, currentTrackingOrder]);

  useEffect(() => {
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    localStorage.setItem('gc_order_history', JSON.stringify(orderHistory));
  }, [orderHistory]);

  useEffect(() => {
    localStorage.setItem('gc_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('gc_active_coupon', JSON.stringify(activeCoupon));
  }, [activeCoupon]);

   useEffect(() => {
     localStorage.setItem('gc_coupons', JSON.stringify(couponsList));
   }, [couponsList]);

   useEffect(() => {
     localStorage.setItem('gc_tea_group_count', teaGroupCount.toString());
   }, [teaGroupCount]);

  useEffect(() => {
    localStorage.setItem('gc_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('gc_user_role', userRole || '');
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('gc_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Sync state across tabs/windows in real-time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if ((e.key === 'orderHistory' || e.key === 'gc_order_history') && e.newValue) {
        try {
          const parsed: Order[] = JSON.parse(e.newValue);
          setOrderHistory(parsed);
        } catch (err) {
          console.error('Failed to parse orderHistory from storage', err);
        }
      }
      if (e.key === 'gc_orders' && e.newValue) {
        try {
          const parsed: Order[] = JSON.parse(e.newValue);
          const updated = parsed.map(order => ({
            ...order,
            items: order.items.map(item => {
              const match = initialProducts.find(ip => ip.id === item.product.id);
              if (match && !item.product.image) {
                return { ...item, product: { ...item.product, image: match.image } };
              }
              return item;
            })
          }));
          setOrders(updated);
        } catch (err) {
          console.error('Failed to parse gc_orders from storage', err);
        }
      }
      if (e.key === 'gc_products' && e.newValue) {
        try {
          const parsed: Product[] = JSON.parse(e.newValue);
          const updated = parsed.map(p => {
            const match = initialProducts.find(ip => ip.id === p.id);
            if (match && !p.image) {
              return { ...p, image: match.image };
            }
            return p;
          });
          setProducts(updated);
        } catch (err) {
          console.error('Failed to parse gc_products from storage', err);
        }
      }
      if (e.key === 'gc_tracking_order') {
        try {
          if (e.newValue) {
            const order: Order = JSON.parse(e.newValue);
            const updatedOrder = {
              ...order,
              items: order.items.map(item => {
                const match = initialProducts.find(ip => ip.id === item.product.id);
                if (match && !item.product.image) {
                  return { ...item, product: { ...item.product, image: match.image } };
                }
                return item;
              })
            };
            setCurrentTrackingOrder(updatedOrder);
          } else {
            setCurrentTrackingOrder(null);
          }
        } catch (err) {
          console.error('Failed to parse gc_tracking_order from storage', err);
        }
      }
      if (e.key === 'gc_current_order_id') {
        setCurrentOrderId(e.newValue || null);
      }
      if (e.key === 'gc_active_table' && e.newValue !== null) {
        setActiveTable(e.newValue);
      }
      if (e.key === 'gc_total_tables' && e.newValue) {
        setTotalTablesState(parseInt(e.newValue, 10) || 20);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Simulate preparation elapsed time update for kitchen dashboard cooking timers
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders => {
        let changed = false;
        const nextOrders = prevOrders.map(order => {
          if (order.status === 'preparing') {
            changed = true;
            // Increments elapsed cooking time by 1 second
            const elapsed = order.elapsedPrepTime || 0;
            return {
              ...order,
              elapsedPrepTime: elapsed + 1
            };
          }
          return order;
        });
        return changed ? nextOrders : prevOrders;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const setTable = (table: string) => {
    setActiveTable(table);
    if (table) {
      localStorage.setItem('gc_active_table', table);
    } else {
      localStorage.removeItem('gc_active_table');
    }
  };

  /**
   * switchTable — explicit user action to select or switch active table.
   * Updates state and localStorage immediately.
   */
  const switchTable = (table: string) => {
    setActiveTable(table);
    localStorage.setItem('gc_active_table', table);
  };

  /**
   * startNewSession — call this when the customer explicitly wants to
   * begin a new ordering session (e.g. after "Served" or tapping "New Order").
   * Clears the active order ID and table so the next QR scan / table entry
   * can set a fresh table without being blocked by the guard above.
   */
  const startNewSession = () => {
    setCurrentOrderId(null);
    setActiveTable('');
    localStorage.removeItem('gc_current_order_id');
    localStorage.removeItem('gc_active_table');
  };

   const addToCart = (product: Product, quantity: number, customizations: SelectedCustomization[], notes?: string) => {
    const cartItemId = generateCartItemId(product.id, customizations);
    const isTeaProduct = product.category.toLowerCase() === 'tea';
    setCart(prevCart => {
      const existingIdx = prevCart.findIndex(item => item.id === cartItemId);
      if (existingIdx > -1) {
        const newCart = [...prevCart];
        newCart[existingIdx] = {
          ...newCart[existingIdx],
          quantity: newCart[existingIdx].quantity + quantity,
          notes: notes || newCart[existingIdx].notes
        };
        return newCart;
      }
      return [...prevCart, {
        id: cartItemId,
        product,
        quantity,
        selectedCustomizations: customizations,
        notes
      }];
    });
    if (isTeaProduct) {
      setTeaGroupCount(prev => prev + quantity);
    }
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prevCart => prevCart.map(item => item.id === cartItemId ? { ...item, quantity } : item));
   };

   // Group-of-5 tea celebration: trigger when crossing a multiple-of-5 boundary
   useEffect(() => {
      const currentGroup = Math.floor(teaGroupCount / 5);
      if (currentGroup > prevGroup && teaGroupCount > 0) {
        setPrevGroup(currentGroup);
        celebrateFreeTea();
      }
    }, [teaGroupCount, prevGroup]);

    const clearCart = () => {
     setCart([]);
     setActiveCoupon(null);
     setTeaGroupCount(0);
     setPrevGroup(0);
   };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = couponsList.find(c => c.code === cleanCode);
    if (!coupon) {
      return { success: false, message: 'Invalid coupon code.' };
    }

    const subtotal = cart.reduce((sum, item) => {
      const customCost = item.selectedCustomizations.reduce((cSum, cust) => 
        cSum + cust.selections.reduce((sSum, sel) => sSum + sel.price, 0), 0
      );
      return sum + (item.product.price + customCost) * item.quantity;
    }, 0);

    if (subtotal < coupon.minOrder) {
      return { 
        success: false, 
        message: `Min order requirement for this coupon is Rs. ${coupon.minOrder}. Current subtotal is Rs. ${subtotal}.` 
      };
    }

    if (coupon.discountType === 'buyxgety') {
      const applicableItems = coupon.category 
        ? cart.filter(item => item.product.category === coupon.category)
        : cart;
      const totalQty = applicableItems.reduce((sum, item) => sum + item.quantity, 0);
      const buy = coupon.bogoBuy || 10;
      if (totalQty < buy) {
        return {
          success: false,
          message: `This offer requires at least ${buy} items in your cart. You currently have ${totalQty}.`
        };
      }
    }

     setActiveCoupon(coupon);
     return { success: true, message: `Coupon "${coupon.code}" applied!` };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
  };

  const addCoupon = (newCoupon: Coupon): boolean => {
    const cleanCode = newCoupon.code.trim().toUpperCase();
    if (!cleanCode) return false;
    if (couponsList.some(c => c.code === cleanCode)) {
      return false;
    }
    const formatted: Coupon = {
      ...newCoupon,
      code: cleanCode,
      description: newCoupon.description || `${newCoupon.discountType === 'percentage' ? `${newCoupon.value}%` : newCoupon.discountType === 'buyxgety' ? `Buy ${newCoupon.bogoBuy} Get ${newCoupon.bogoFree} Free` : `Rs. ${newCoupon.value}`} OFF on orders above Rs. ${newCoupon.minOrder}!`
    };
    setCouponsList(prev => [...prev, formatted]);
    return true;
  };

  const deleteCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    setCouponsList(prev => prev.filter(c => c.code !== cleanCode));
    if (activeCoupon && activeCoupon.code === cleanCode) {
      setActiveCoupon(null);
    }
   };

    const placeOrder = (tableNumber: string, paymentMethod: PaymentMethod, customerPhone?: string, notes?: string) => {
      const subtotal = cart.reduce((sum, item) => {
        const customCost = item.selectedCustomizations.reduce((cSum, cust) => 
          cSum + cust.selections.reduce((sSum, sel) => sSum + sel.price, 0), 0
        );
        return sum + (item.product.price + customCost) * item.quantity;
      }, 0);

      const serviceCharge = 0; // Math.round(subtotal * 0.10);
      const tax = 0; // Math.round(subtotal + serviceCharge) * 0.13);

<<<<<<< HEAD
      const couponDiscount = activeCoupon ? (() => {
        if (activeCoupon.discountType === 'percentage') {
          return Math.round((subtotal * activeCoupon.value) / 100);
        }
        return activeCoupon.value;
      })() : 0;
      const pricing = calculateCartPricing(cart, couponDiscount);
      const totalDiscount = pricing.offerDiscount + couponDiscount;
      const total = pricing.total;
=======
    const serviceCharge = 0; // Math.round(subtotal * 0.10);
    const tax = 0; // Math.round((subtotal + serviceCharge) * 0.13);
    const couponDiscount = calculateDiscount(subtotal, activeCoupon);
    const pricing = calculateCartPricing(cart, couponDiscount);
    const discount = pricing.offerDiscount + couponDiscount;
    const total = pricing.total;
>>>>>>> 3bfde6a83394ca5a5be3b9f0e32219f64800844d

       const newOrder: Order = {
        id: `CS-${1000 + orders.length + 1}`,
        tableNumber: activeTable,
       customerPhone,
       items: [...cart],
       subtotal,
       serviceCharge,
       tax,
       discount: totalDiscount,
       total,
      status: 'pending',
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'cash' ? 'pending' : 'success',
        transactionId: paymentMethod !== 'cash' ? `TXN-${Math.floor(100000000 + Math.random() * 900000000)}` : undefined,
        mobileNumber: paymentMethod === 'khalti' ? customerPhone || '9841000000' : undefined,
        paidAt: paymentMethod !== 'cash' ? new Date().toISOString() : undefined
      },
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOrders(prevOrders => [...prevOrders, newOrder]);
    setCurrentTrackingOrder(newOrder);
    localStorage.setItem('gc_tracking_order', JSON.stringify(newOrder));

    // Persist the current order ID and lock the active table for this session
    setCurrentOrderId(newOrder.id);
    localStorage.setItem('gc_current_order_id', newOrder.id);
    localStorage.setItem('gc_active_table', newOrder.tableNumber);
    lockTable(newOrder.tableNumber, newOrder.id);

    clearCart();
    
    return newOrder;
  };

  const injectDemoOrder = (type: 'matka' | 'bogo' | 'rush'): Order => {
    const matkaTea = products.find(p => p.name.toLowerCase().includes('matka')) || products[0];
    const coldCoffee = products.find(p => p.name.toLowerCase().includes('coffee')) || products[2] || products[0];
    const snackItem = products.find(p => p.category === 'cold-drinks' || p.name.toLowerCase().includes('snack')) || products[1] || products[0];

    const tableNum = String(Math.floor(Math.random() * 20) + 1);
    let items: CartItem[] = [];
    let paymentMethod: PaymentMethod = 'khalti';

    if (type === 'matka') {
      paymentMethod = 'khalti';
      items = [
        {
          id: `demo-${Date.now()}-1`,
          product: matkaTea,
          quantity: 2,
          selectedCustomizations: [
            { name: 'Sugar Level', selections: [{ name: 'Regular Sugar', price: 0 }] },
            { name: 'Milk Preference', selections: [{ name: 'Whole Milk (Classic)', price: 0 }] },
            { name: 'Matka Add-ons', selections: [{ name: 'Saffron Touch', price: 30 }] }
          ]
        }
      ];
    } else if (type === 'bogo') {
      paymentMethod = 'cash';
      items = [
        {
          id: `demo-${Date.now()}-2`,
          product: matkaTea,
          quantity: 2,
          selectedCustomizations: []
        },
        {
          id: `demo-${Date.now()}-3`,
          product: snackItem,
          quantity: 2,
          selectedCustomizations: []
        }
      ];
    } else {
      paymentMethod = 'khalti';
      items = [
        {
          id: `demo-${Date.now()}-4`,
          product: coldCoffee,
          quantity: 3,
          selectedCustomizations: []
        }
      ];
    }

    const subtotal = items.reduce((sum, i) => {
      const custCost = i.selectedCustomizations.reduce((cs, c) => cs + c.selections.reduce((ss, s) => ss + s.price, 0), 0);
      return sum + (i.product.price + custCost) * i.quantity;
    }, 0);

    const discount = type === 'bogo' ? 60 : 0;
    const total = Math.max(0, subtotal - discount);

    const newOrder: Order = {
      id: `CS-${1000 + orders.length + 1}`,
      tableNumber: tableNum,
      customerPhone: '9841000999',
      items,
      subtotal,
      serviceCharge: 0,
      tax: 0,
      discount,
      total,
      status: 'pending',
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'cash' ? 'pending' : 'success',
        transactionId: paymentMethod !== 'cash' ? `TXN-${Math.floor(100000000 + Math.random() * 900000000)}` : undefined,
        mobileNumber: paymentMethod === 'khalti' ? '9841000000' : undefined,
        paidAt: paymentMethod !== 'cash' ? new Date().toISOString() : undefined
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOrders(prevOrders => {
      const next = [newOrder, ...prevOrders];
      localStorage.setItem('gc_orders', JSON.stringify(next));
      return next;
    });

    return newOrder;
  };

  const orderContainsTea = (order: Order): boolean => {
    return order.items.some(item =>
      item.product.category.toLowerCase().includes('tea') ||
      item.product.name.toLowerCase().includes('tea') ||
      item.product.name.toLowerCase().includes('chiya') ||
      item.product.name.toLowerCase().includes('chai')
    );
  };

  const updateOrderStatus = (
    orderId: string, 
    status: OrderStatus, 
    extra?: { rejectionReason?: string; estTime?: number; isPriority?: boolean }
  ) => {
    const isCompletedOrServed = status === 'served' || status === 'completed';

    setOrders(prevOrders => {
      const targetOrder = prevOrders.find(o => o.id === orderId);

      if (!targetOrder) {
        // Order might already be in orderHistory; update its status if present
        if (isCompletedOrServed || status === 'rejected') {
          setOrderHistory(prevHistory => {
            const existing = prevHistory.find(h => h.id === orderId);
            if (existing) {
              const updatedHistory = prevHistory.map(h => h.id === orderId ? {
                ...h,
                status,
                updatedAt: new Date().toISOString(),
                completedAt: h.completedAt || new Date().toISOString()
              } : h);
              localStorage.setItem('orderHistory', JSON.stringify(updatedHistory));
              localStorage.setItem('gc_order_history', JSON.stringify(updatedHistory));
              return updatedHistory;
            }
            return prevHistory;
          });
        }
        return prevOrders;
      }

      const updatedOrder: Order = {
        ...targetOrder,
        status,
        updatedAt: new Date().toISOString(),
        rejectionReason: extra?.rejectionReason ?? targetOrder.rejectionReason,
        estimatedTime: extra?.estTime ?? targetOrder.estimatedTime,
        isPriority: extra?.isPriority ?? targetOrder.isPriority
      };

      if (status === 'preparing' && !targetOrder.elapsedPrepTime) {
        updatedOrder.elapsedPrepTime = 0;
      }

      // If the order has been completed or served, mark cash payments as successful
      if (isCompletedOrServed && updatedOrder.payment.method === 'cash') {
        updatedOrder.payment = {
          ...updatedOrder.payment,
          status: 'success',
          paidAt: updatedOrder.payment.paidAt || new Date().toISOString()
        };
      }

        // When completing/serving an order, move it to orderHistory and remove from active orders
        if (isCompletedOrServed) {

        const completedOrder: Order = {
          ...updatedOrder,
          completedAt: new Date().toISOString()
        };

        setOrderHistory(prevHistory => {
          const filtered = prevHistory.filter(o => o.id !== orderId);
          const newHistory = [completedOrder, ...filtered];
          localStorage.setItem('orderHistory', JSON.stringify(newHistory));
          localStorage.setItem('gc_order_history', JSON.stringify(newHistory));
          return newHistory;
        });

        // Clear the active order session when this was the customer's current order
        setCurrentOrderId(prev => {
          if (prev === orderId) {
            localStorage.removeItem('gc_current_order_id');
            localStorage.removeItem('gc_active_table');
            setActiveTable('');
            return null;
          }
          return prev;
        });

        return prevOrders.filter(o => o.id !== orderId);
      }

      return prevOrders.map(o => o.id === orderId ? updatedOrder : o);
    });
  };

  const markCashAsPaid = (orderId: string) => {
    const now = new Date().toISOString();
    let updatedOrder: Order | null = null;

    setOrders(prevOrders => {
      const target = prevOrders.find(o => o.id === orderId);
      if (target && target.payment.method === 'cash' && target.payment.status !== 'success') {
        updatedOrder = {
          ...target,
          payment: {
            ...target.payment,
            status: 'success' as const,
            paidAt: target.payment.paidAt || now
          },
          updatedAt: now
        };
        localStorage.setItem('gc_orders', JSON.stringify([...prevOrders.filter(o => o.id !== orderId), updatedOrder]));
        return prevOrders.map(o => o.id === orderId ? updatedOrder! : o);
      }
      return prevOrders;
    });

    setOrderHistory(prevHistory => {
      const target = prevHistory.find(o => o.id === orderId);
      if (target && target.payment.method === 'cash' && target.payment.status !== 'success') {
        const updated = {
          ...target,
          payment: {
            ...target.payment,
            status: 'success' as const,
            paidAt: target.payment.paidAt || now
          },
          updatedAt: now
        };
        localStorage.setItem('orderHistory', JSON.stringify(prevHistory.map(o => o.id === orderId ? updated : o)));
        localStorage.setItem('gc_order_history', JSON.stringify(prevHistory.map(o => o.id === orderId ? updated : o)));
        return prevHistory.map(o => o.id === orderId ? updated : o);
      }
      return prevHistory;
    });
  };

  const toggleProductAvailability = (productId: string) => {
    setProducts(prevProducts => prevProducts.map(p => 
      p.id === productId ? { ...p, available: !p.available } : p
    ));
  };

  const updateProductPrice = (productId: string, newPrice: number) => {
    setProducts(prevProducts => prevProducts.map(p => 
      p.id === productId ? { ...p, price: newPrice } : p
    ));
  };

  const addProduct = (newProduct: Omit<Product, 'id' | 'available'>) => {
    const id = `prod-${Date.now()}`;
    const productWithId: Product = {
      ...newProduct,
      id,
      available: true,
      image: newProduct.image || ''
    };
    setProducts(prevProducts => [productWithId, ...prevProducts]);
    // Ensure the product's category is registered in the category list
    if (newProduct.category && !categories.includes(newProduct.category)) {
      setCategories(prev => prev.includes(newProduct.category) ? prev : [...prev, newProduct.category]);
    }
  };

  const addCategory = (name: string): boolean => {
    const clean = name.trim().toLowerCase();
    if (!clean) return false;
    if (categories.includes(clean)) return false;
    setCategories(prev => [...prev, clean]);
    return true;
  };

  const renameCategory = (oldName: string, newName: string): boolean => {
    const newClean = newName.trim().toLowerCase();
    if (!newClean) return false;
    if (oldName !== newClean && categories.includes(newClean)) return false;
    // Update product references
    setProducts(prevProducts => prevProducts.map(p =>
      p.category === oldName ? { ...p, category: newClean } : p
    ));
    // Update category list preserving position
    setCategories(prev => prev.map(c => (c === oldName ? newClean : c)));
    return true;
  };

  const deleteCategory = (category: string) => {
    // Remove every product in the category from the menu (and customer menu)
    setProducts(prevProducts => prevProducts.filter(p => p.category !== category));
    // Remove the category from the persisted list so it stays deleted
    setCategories(prev => prev.filter(c => c !== category));
  };

  const moveProductsToCategory = (productIds: string[], category: string) => {
    const idSet = new Set(productIds);
    const target = category.trim().toLowerCase();
    if (target && !categories.includes(target)) {
      setCategories(prev => [...prev, target]);
    }
    setProducts(prevProducts => prevProducts.map(p =>
      idSet.has(p.id) ? { ...p, category: target } : p
    ));
  };

  const updateProductImage = (productId: string, newImage: string) => {
    setProducts(prevProducts => prevProducts.map(p => 
      p.id === productId ? { ...p, image: newImage || '' } : p
    ));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
  };

  const deleteProducts = (productIds: string[]) => {
    const idSet = new Set(productIds);
    setProducts(prevProducts => prevProducts.filter(p => !idSet.has(p.id)));
  };

  const updateProduct = (
    productId: string,
    updates: { name: string; price: number; category: string; description: string; preparationTime: number; image: string }
  ) => {
    setProducts(prevProducts => prevProducts.map(p =>
      p.id === productId
        ? {
            ...p,
            name: updates.name,
            price: updates.price,
            category: updates.category,
            description: updates.description,
            preparationTime: updates.preparationTime,
            image: updates.image || ''
          }
        : p
    ));
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const addReview = (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Review => {
    const newReview: Review = {
      ...review,
      id: `REV-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setReviews(prev => [newReview, ...prev]);
    return newReview;
  };

  const updateReview = (reviewId: string, updates: { rating?: number; comment?: string }) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r));
  };

  const deleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  const loginStaff = (role: 'cashier' | 'kitchen') => {
    setUserRole(role);
    return true;
  };

  const logoutStaff = () => {
    setUserRole('customer');
  };

  const getSalesReport = (): SalesReport => {
    const combined = [...orderHistory, ...orders.filter(o => ['completed', 'served', 'Completed', 'Served'].includes(o.status))];
    const uniqueMap = new Map<string, Order>();
    combined.forEach(o => uniqueMap.set(o.id, o));
    const completedOrders = Array.from(uniqueMap.values());
    
    let totalRevenue = 0;
    let totalOrders = completedOrders.length;
    let revenueByPaymentMethod = { khalti: 0, cash: 0 };
    let revenueByCategory: Record<string, number> = {};
    let ordersByHour: Record<number, number> = {};
    let itemSales: Record<string, { name: string; quantity: number; revenue: number }> = {};

    completedOrders.forEach(order => {
      totalRevenue += order.total;
      
      // Payment method
      const method = order.payment.method;
      revenueByPaymentMethod[method] = (revenueByPaymentMethod[method] || 0) + order.total;

      // Hour of day
      const hour = new Date(order.createdAt).getHours();
      ordersByHour[hour] = (ordersByHour[hour] || 0) + 1;

      // Items and categories
      order.items.forEach(item => {
        const cat = item.product.category;
        const customCost = item.selectedCustomizations.reduce((cSum, cust) => 
          cSum + cust.selections.reduce((sSum, sel) => sSum + sel.price, 0), 0
        );
        const itemRevenue = (item.product.price + customCost) * item.quantity;
        
        revenueByCategory[cat] = (revenueByCategory[cat] || 0) + itemRevenue;

        if (!itemSales[item.product.id]) {
          itemSales[item.product.id] = { name: item.product.name, quantity: 0, revenue: 0 };
        }
        itemSales[item.product.id].quantity += item.quantity;
        itemSales[item.product.id].revenue += itemRevenue;
      });
    });

    const popularItems = Object.entries(itemSales).map(([productId, data]) => ({
      productId,
      name: data.name,
      quantity: data.quantity,
      revenue: data.revenue
    })).sort((a, b) => b.quantity - a.quantity).slice(0, 10);

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
      revenueByPaymentMethod,
      revenueByCategory,
      ordersByHour,
      popularItems
    };
  };

  const clearPaymentHistory = () => {
    localStorage.setItem('gc_orders', JSON.stringify([]));
    localStorage.setItem('orderHistory', JSON.stringify([]));
    localStorage.setItem('gc_order_history', JSON.stringify([]));
    localStorage.removeItem('gc_tracking_order');
    setOrders([]);
    setOrderHistory([]);
    setCurrentTrackingOrder(null);
    setCurrentOrderId(null);
    setActiveTable('');
  };

  const resetAllData = () => {
    localStorage.removeItem('gc_products');
    localStorage.removeItem('gc_categories');
    localStorage.removeItem('gc_orders');
    localStorage.removeItem('orderHistory');
    localStorage.removeItem('gc_order_history');
    localStorage.removeItem('gc_cart');
    localStorage.removeItem('gc_active_coupon');
     localStorage.removeItem('gc_coupons');
     localStorage.removeItem('gc_tea_group_count');
     localStorage.removeItem('gc_profile_name');
     localStorage.removeItem('gc_favorites');
       localStorage.removeItem('gc_tracking_order');
       localStorage.removeItem('gc_current_order_id');
       localStorage.removeItem('gc_active_table');
       localStorage.removeItem('gc_table_statuses');
       setProducts(initialProducts);
     setCategories(Array.from(new Set(initialProducts.map(p => p.category))));
     setCouponsList(coupons);
     setActiveCoupon(null);
     setTeaGroupCount(0);
     setPrevGroup(0);
     setCelebrationActive(false);
     setTableStatuses({});
    const mocks = generateMockOrders(initialProducts);
    setOrders([]);
    setOrderHistory(mocks);
    localStorage.setItem('orderHistory', JSON.stringify(mocks));
    localStorage.setItem('gc_order_history', JSON.stringify(mocks));
    setCart([]);
    setFavorites([]);
    setCurrentTrackingOrder(null);
    setCurrentOrderId(null);
    setActiveTable('');
  };

  const addContactMessage = (message: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) => {
    const newMessage: ContactMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      read: false
    };
    setMessages(prev => {
      const updated = [newMessage, ...prev];
      localStorage.setItem('gc_messages', JSON.stringify(updated));
      return updated;
    });
  };

  const markMessageAsRead = (messageId: string) => {
    setMessages(prev => {
      const updated = prev.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      );
      localStorage.setItem('gc_messages', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev => {
      const updated = prev.filter(msg => msg.id !== messageId);
      localStorage.setItem('gc_messages', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AppContext.Provider value={{
      products,
      categories,
      orders,
      orderHistory,
      reviews,
      messages,
      cart,
      activeTable,
      totalTables,
      setTotalTables,
        currentOrderId,
        activeCoupon,
        couponsList,
        favorites,
      userRole,
      setUserRole,
      currentTrackingOrder,
      setTable,
      switchTable,
      startNewSession,
        getTableStatus,
        getTableOrderId,
        getTableOccupiedAt,
        getTableOrder,
        lockTable,
       unlockTable,
       markTableAvailable,
       freeTable,
       resetAllTableStatuses,
       addToCart,
      removeFromCart,
      updateCartQuantity,
       clearCart,
       applyCoupon,
       removeCoupon,
        addCoupon,
        deleteCoupon,
        calculateCartPricing,
        placeOrder,
      updateOrderStatus,
      markCashAsPaid,
      toggleProductAvailability,
      updateProductPrice,
      updateProductImage,
      addProduct,
      addCategory,
      renameCategory,
      deleteCategory,
      moveProductsToCategory,
      updateProduct,
      deleteProduct,
      deleteProducts,
      toggleFavorite,
      addReview,
      updateReview,
      deleteReview,
      addContactMessage,
      markMessageAsRead,
      deleteMessage,
      loginStaff,
      logoutStaff,
      getSalesReport,
      resetAllData,
      clearPaymentHistory,
      injectDemoOrder,
        isDarkMode,
        toggleTheme,
        setOrderHistory,
        teaGroupCount,
        celebrationActive,
        celebrationMessage,
        celebrateFreeTea,
        dismissCelebration,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
