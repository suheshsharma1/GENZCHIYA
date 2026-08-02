import { CartItem } from '../types';

export interface PricingBreakdown {
  subtotal: number;
  offerDiscount: number;
  couponDiscount: number;
  total: number;
  offerDetails: Array<{
    itemId: string;
    name: string;
    freeUnits: number;
    discount: number;
  }>;
}

export const isSaturday = (): boolean => new Date().getDay() === 6;

export const isTeaProduct = (category?: string, id?: string, name?: string): boolean => {
  const cat = (category || '').toLowerCase();
  const prodName = (name || '').toLowerCase();
  const prodId = (id || '').toLowerCase();
  return (
    cat === 'tea' ||
    cat === 'mattai' ||
    prodId.startsWith('tea-') ||
    prodName.includes('tea') ||
    prodName.includes('chiya') ||
    prodName.includes('chai')
  );
};

const getItemUnitPrice = (item: CartItem): number => {
  const customCost = item.selectedCustomizations.reduce((cSum, cust) =>
    cSum + cust.selections.reduce((sSum, sel) => sSum + sel.price, 0), 0
  );
  return item.product.price + customCost;
};

export const calculateCartPricing = (cart: CartItem[], couponDiscount = 0): PricingBreakdown => {
  const subtotal = cart.reduce((sum, item) => {
    return sum + getItemUnitPrice(item) * item.quantity;
  }, 0);

  const saturday = isSaturday();
  const offerDetails: PricingBreakdown['offerDetails'] = [];

  cart.forEach((item) => {
    const isTea = isTeaProduct(item.product.category, item.product.id, item.product.name);

    if (saturday && isTea) {
      // 30% Auto discount on Saturday for Tea items
      const itemTotalPrice = getItemUnitPrice(item) * item.quantity;
      const discount = Math.round(itemTotalPrice * 0.3);
      if (discount > 0) {
        offerDetails.push({
          itemId: item.id,
          name: `${item.product.name} (30% Saturday Special)`,
          freeUnits: 0,
          discount,
        });
      }
    } else {
      // Regular Buy 5 Get 1 Free offer
      const freeUnits = Math.floor(item.quantity / 5);
      if (freeUnits > 0) {
        const discount = freeUnits * getItemUnitPrice(item);
        offerDetails.push({
          itemId: item.id,
          name: `${item.product.name} (Buy 5 Get 1 Free)`,
          freeUnits,
          discount,
        });
      }
    }
  });

  const offerDiscount = offerDetails.reduce((sum, detail) => sum + detail.discount, 0);
  const total = Math.max(0, subtotal - offerDiscount - couponDiscount);

  return {
    subtotal,
    offerDiscount,
    couponDiscount,
    total,
    offerDetails,
  };
};
