import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, CartItem, SelectedCustomization, OrderStatus, PaymentMethod, Coupon, SalesReport } from '../types';
import { products as initialProducts } from '../data/products';
import { coupons } from '../data/coupons';

interface AppContextType {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  activeTable: string;
  activeCoupon: Coupon | null;
  favorites: string[];
  userRole: 'customer' | 'cashier' | 'kitchen' | null;
  setUserRole: (role: 'customer' | 'cashier' | 'kitchen' | null) => void;
  currentTrackingOrder: Order | null;
  setTable: (table: string) => void;
  addToCart: (product: Product, quantity: number, customizations: SelectedCustomization[], notes?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  placeOrder: (customerName: string, paymentMethod: PaymentMethod, customerPhone?: string, notes?: string) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, extra?: { rejectionReason?: string; estTime?: number; isPriority?: boolean }) => void;
  toggleProductAvailability: (productId: string) => void;
  updateProductPrice: (productId: string, newPrice: number) => void;
  updateProductImage: (productId: string, newImage: string) => void;
  addProduct: (newProduct: Omit<Product, 'id' | 'available'>) => void;
  deleteProduct: (productId: string) => void;
  toggleFavorite: (productId: string) => void;
  loginStaff: (role: 'cashier' | 'kitchen') => boolean;
  logoutStaff: () => void;
  getSalesReport: () => SalesReport;
  resetAllData: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
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
  const mockOrders: Order[] = [];
  const paymentMethods: PaymentMethod[] = ['khalti', 'esewa', 'cash'];
  const customerNames = ['Aarav Sharma', 'Sita Thapa', 'Rahul Karki', 'Pooja Shrestha', 'Amit Giri', 'Neha Joshi', 'Kshitiz Adhikari', 'Samikshya Bhatta', 'Niranjan Sen', 'Prerna Dahal'];
  
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
    const name = customerNames[Math.floor(Math.random() * customerNames.length)];
    const table = String(1 + Math.floor(Math.random() * 25));

    const dateStr = orderDate.toISOString();

    mockOrders.push({
      id: `CS-${1000 + i}`,
      tableNumber: table,
      customerName: name,
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

const resolveProductImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const baseUrl = import.meta.env.BASE_URL || '/';
  const formattedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${formattedBaseUrl}${cleanPath}`;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('gc_products');
    const CURRENT_MENU_VERSION = 'v5-nepal-cafe-prices-2026';
    const savedVersion = localStorage.getItem('gc_menu_version');
    
    const resolveImages = (prods: Product[]): Product[] => {
      return prods.map(p => ({
        ...p,
        image: resolveProductImageUrl(p.image)
      }));
    };
    
    // Clear old data if menu version changed, but preserve cashier's custom products and images
    if (saved && savedVersion !== CURRENT_MENU_VERSION) {
      try {
        const oldProducts: Product[] = JSON.parse(saved);
        const customProducts = oldProducts.filter(p => p.id.startsWith('prod-'));
        
        const updatedInitialProducts = initialProducts.map(initProd => {
          const oldProd = oldProducts.find(p => p.id === initProd.id);
          // If the image was changed from the default, preserve the cashier's custom image
          if (oldProd && oldProd.image !== initProd.image && !oldProd.image.includes(initProd.image.replace(/^\//, ''))) {
            return { ...initProd, image: oldProd.image };
          }
          return initProd;
        });

        const mergedProducts = [...customProducts, ...updatedInitialProducts];

        localStorage.removeItem('gc_products');
        localStorage.removeItem('gc_orders');
        localStorage.removeItem('gc_cart');
        localStorage.removeItem('gc_favorites');
        localStorage.setItem('gc_menu_version', CURRENT_MENU_VERSION);
        return resolveImages(mergedProducts);
      } catch (err) {
        console.error('Failed to merge old products on version upgrade', err);
        localStorage.setItem('gc_menu_version', CURRENT_MENU_VERSION);
        return resolveImages(initialProducts);
      }
    }
    
    if (!saved) {
      localStorage.setItem('gc_menu_version', CURRENT_MENU_VERSION);
    }
    
    return saved ? resolveImages(JSON.parse(saved)) : resolveImages(initialProducts);
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('gc_orders');
    if (saved) return JSON.parse(saved);
    // Otherwise generate clean mock orders
    const mocks = generateMockOrders(initialProducts);
    localStorage.setItem('gc_orders', JSON.stringify(mocks));
    return mocks;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('gc_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTable, setActiveTable] = useState<string>(() => {
    return localStorage.getItem('gc_active_table') || '';
  });

  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(() => {
    const saved = localStorage.getItem('gc_active_coupon');
    return saved ? JSON.parse(saved) : null;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('gc_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [userRole, setUserRole] = useState<'customer' | 'cashier' | 'kitchen' | null>(() => {
    return (localStorage.getItem('gc_user_role') as any) || 'customer';
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
    return saved ? JSON.parse(saved) : null;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('gc_products', JSON.stringify(products));
  }, [products]);

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
    localStorage.setItem('gc_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('gc_active_table', activeTable);
  }, [activeTable]);

  useEffect(() => {
    localStorage.setItem('gc_active_coupon', JSON.stringify(activeCoupon));
  }, [activeCoupon]);

  useEffect(() => {
    localStorage.setItem('gc_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('gc_user_role', userRole || '');
  }, [userRole]);

  // Sync state across tabs/windows in real-time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'gc_orders' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setOrders(parsed);
        } catch (err) {
          console.error('Failed to parse gc_orders from storage', err);
        }
      }
      if (e.key === 'gc_products' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setProducts(parsed);
        } catch (err) {
          console.error('Failed to parse gc_products from storage', err);
        }
      }
      if (e.key === 'gc_tracking_order') {
        try {
          setCurrentTrackingOrder(e.newValue ? JSON.parse(e.newValue) : null);
        } catch (err) {
          console.error('Failed to parse gc_tracking_order from storage', err);
        }
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
  };

  const addToCart = (product: Product, quantity: number, customizations: SelectedCustomization[], notes?: string) => {
    const cartItemId = generateCartItemId(product.id, customizations);
    
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

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = coupons.find(c => c.code === cleanCode);
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

    setActiveCoupon(coupon);
    return { success: true, message: `Coupon applied successfully! Saved Rs. ${calculateDiscount(subtotal, coupon)}.` };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
  };

  const calculateDiscount = (subtotal: number, coupon: Coupon | null): number => {
    if (!coupon) return 0;
    if (coupon.discountType === 'percentage') {
      return Math.round((subtotal * coupon.value) / 100);
    }
    return coupon.value;
  };

  const placeOrder = (customerName: string, paymentMethod: PaymentMethod, customerPhone?: string, notes?: string) => {
    const subtotal = cart.reduce((sum, item) => {
      const customCost = item.selectedCustomizations.reduce((cSum, cust) => 
        cSum + cust.selections.reduce((sSum, sel) => sSum + sel.price, 0), 0
      );
      return sum + (item.product.price + customCost) * item.quantity;
    }, 0);

    const serviceCharge = 0; // Math.round(subtotal * 0.10);
    const tax = 0; // Math.round((subtotal + serviceCharge) * 0.13);
    const discount = calculateDiscount(subtotal, activeCoupon);
    const total = subtotal - discount;

    const newOrder: Order = {
      id: `CS-${1000 + orders.length + 1}`,
      tableNumber: activeTable || 'Takeaway',
      customerName: customerName || 'Valued Customer',
      customerPhone,
      items: [...cart],
      subtotal,
      serviceCharge,
      tax,
      discount,
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
    clearCart();
    
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string, 
    status: OrderStatus, 
    extra?: { rejectionReason?: string; estTime?: number; isPriority?: boolean }
  ) => {
    setOrders(prevOrders => prevOrders.map(order => {
      if (order.id === orderId) {
        const nextOrder = {
          ...order,
          status,
          updatedAt: new Date().toISOString(),
          rejectionReason: extra?.rejectionReason ?? order.rejectionReason,
          estimatedTime: extra?.estTime ?? order.estimatedTime,
          isPriority: extra?.isPriority ?? order.isPriority
        };

        if (status === 'preparing' && !order.elapsedPrepTime) {
          nextOrder.elapsedPrepTime = 0;
        }

        // If the order has been completed or served, mark cash payments as successful
        if ((status === 'served' || status === 'completed') && order.payment.method === 'cash') {
          nextOrder.payment.status = 'success';
          nextOrder.payment.paidAt = new Date().toISOString();
        }

        return nextOrder;
      }
      return order;
    }));
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
      image: resolveProductImageUrl(newProduct.image)
    };
    setProducts(prevProducts => [productWithId, ...prevProducts]);
  };

  const updateProductImage = (productId: string, newImage: string) => {
    setProducts(prevProducts => prevProducts.map(p => 
      p.id === productId ? { ...p, image: resolveProductImageUrl(newImage) } : p
    ));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const loginStaff = (role: 'cashier' | 'kitchen') => {
    setUserRole(role);
    return true;
  };

  const logoutStaff = () => {
    setUserRole('customer');
  };

  const getSalesReport = (): SalesReport => {
    const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'served');
    
    let totalRevenue = 0;
    let totalOrders = completedOrders.length;
    let revenueByPaymentMethod = { khalti: 0, esewa: 0, cash: 0 };
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

  const resetAllData = () => {
    localStorage.removeItem('gc_products');
    localStorage.removeItem('gc_orders');
    localStorage.removeItem('gc_cart');
    localStorage.removeItem('gc_active_coupon');
    localStorage.removeItem('gc_favorites');
    localStorage.removeItem('gc_tracking_order');
    setProducts(initialProducts);
    const mocks = generateMockOrders(initialProducts);
    setOrders(mocks);
    setCart([]);
    setActiveCoupon(null);
    setFavorites([]);
    setCurrentTrackingOrder(null);
  };

  return (
    <AppContext.Provider value={{
      products,
      orders,
      cart,
      activeTable,
      activeCoupon,
      favorites,
      userRole,
      setUserRole,
      currentTrackingOrder,
      setTable,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
      placeOrder,
      updateOrderStatus,
      toggleProductAvailability,
      updateProductPrice,
      updateProductImage,
      addProduct,
      deleteProduct,
      toggleFavorite,
      loginStaff,
      logoutStaff,
      getSalesReport,
      resetAllData,
      isDarkMode,
      toggleTheme
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
