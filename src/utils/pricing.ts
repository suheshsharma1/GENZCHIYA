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

<<<<<<< HEAD
const isSaturday = (): boolean => new Date().getDay() === 6;

=======
>>>>>>> 3bfde6a83394ca5a5be3b9f0e32219f64800844d
const getItemUnitPrice = (item: CartItem): number => {
  const customCost = item.selectedCustomizations.reduce((cSum, cust) =>
    cSum + cust.selections.reduce((sSum, sel) => sSum + sel.price, 0), 0
  );
<<<<<<< HEAD
=======

>>>>>>> 3bfde6a83394ca5a5be3b9f0e32219f64800844d
  return item.product.price + customCost;
};

export const calculateCartPricing = (cart: CartItem[], couponDiscount = 0): PricingBreakdown => {
  const subtotal = cart.reduce((sum, item) => {
    return sum + getItemUnitPrice(item) * item.quantity;
  }, 0);

<<<<<<< HEAD
  const saturday = isSaturday();

  const offerDetails = cart
    .map((item) => {
      const isMattai = false;

      if (saturday && isMattai) {
        const freeUnits = Math.floor(item.quantity / 2);
        if (freeUnits <= 0) return null;
        const discount = freeUnits * getItemUnitPrice(item);
        return {
          itemId: item.id,
          name: item.product.name,
          freeUnits,
          discount,
        };
      }

      const freeUnits = Math.floor(item.quantity / 5);
      if (freeUnits <= 0) return null;
=======
  const offerDetails = cart
    .map((item) => {
      const freeUnits = Math.floor(item.quantity / 5);
      if (freeUnits <= 0) return null;

>>>>>>> 3bfde6a83394ca5a5be3b9f0e32219f64800844d
      const discount = freeUnits * getItemUnitPrice(item);
      return {
        itemId: item.id,
        name: item.product.name,
        freeUnits,
<<<<<<< HEAD
        discount,
=======
        discount
>>>>>>> 3bfde6a83394ca5a5be3b9f0e32219f64800844d
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const offerDiscount = offerDetails.reduce((sum, detail) => sum + detail.discount, 0);
  const total = Math.max(0, subtotal - offerDiscount - couponDiscount);

  return {
    subtotal,
    offerDiscount,
    couponDiscount,
    total,
<<<<<<< HEAD
    offerDetails,
  };
};
=======
    offerDetails
  };
};
>>>>>>> 3bfde6a83394ca5a5be3b9f0e32219f64800844d
