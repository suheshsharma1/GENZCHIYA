export interface CustomizationOption {
  name: string;
  price: number;
  available?: boolean;
}

export interface ProductCustomization {
  name: string; // e.g., "Sugar Level", "Milk Type", "Toppings"
  required: boolean;
  type: 'select' | 'multiple'; // select one, or select multiple
  options: CustomizationOption[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  featured?: boolean;
  customizations?: ProductCustomization[];
  preparationTime: number; // in minutes
}

export interface SelectedCustomization {
  name: string; // customization name (e.g. "Milk Type")
  selections: {
    name: string;
    price: number;
  }[];
}

export interface CartItem {
  id: string; // unique ID generated for this specific cart configuration (product_id + serialised selections)
  product: Product;
  quantity: number;
  selectedCustomizations: SelectedCustomization[];
  notes?: string;
}

export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'served' | 'completed' | 'rejected';

export type PaymentMethod = 'khalti' | 'esewa' | 'cash';

export interface PaymentDetails {
  method: PaymentMethod;
  status: 'pending' | 'success' | 'failed';
  transactionId?: string;
  mobileNumber?: string;
  paidAt?: string;
}

export interface Order {
  id: string;
  tableNumber: string;
  customerName: string;
  customerPhone?: string;
  items: CartItem[];
  subtotal: number;
  tax: number; // 13% VAT
  serviceCharge: number; // 10% Service Charge
  discount: number;
  total: number;
  status: OrderStatus;
  payment: PaymentDetails;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  estimatedTime?: number; // preparation timer in minutes
  elapsedPrepTime?: number; // elapsed cooking time in seconds (for dashboard cooking timers)
  isPriority?: boolean;
  rejectionReason?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  description: string;
}

export interface SalesReport {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueByPaymentMethod: {
    khalti: number;
    esewa: number;
    cash: number;
  };
  revenueByCategory: Record<string, number>;
  ordersByHour: Record<number, number>;
  popularItems: {
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }[];
}
