import { Coupon } from '../types';

export const coupons: Coupon[] = [
  {
    code: "SATURDAY30",
    discountType: "percentage",
    value: 30,
    minOrder: 300,
    description: "Saturday Special: 30% OFF on all Tea & Snacks above Rs. 300!"
  },
  {
    code: "SATURDAYBOGO",
    discountType: "percentage",
    value: 50,
    minOrder: 200,
    description: "Super Saturday BOGO Offer: Buy 1 Get 1 FREE (50% OFF)!"
  },
  {
    code: "GENZCHIYA10",
    discountType: "percentage",
    value: 10,
    minOrder: 300,
    description: "Get 10% OFF on all orders above Rs. 300!"
  },
  {
    code: "WELCOME20",
    discountType: "percentage",
    value: 20,
    minOrder: 500,
    description: "Special Welcome Offer: 20% OFF on orders above Rs. 500!"
  },
  {
    code: "CHAI50",
    discountType: "fixed",
    value: 50,
    minOrder: 250,
    description: "Flat Rs. 50 OFF on orders above Rs. 250!"
  },
  {
    code: "FESTIVE100",
    discountType: "fixed",
    value: 100,
    minOrder: 800,
    description: "Flat Rs. 100 OFF on orders above Rs. 800!"
  },
  {
    code: "CHIYA10FREE",
    discountType: "buyxgety",
    value: 0,
    minOrder: 0,
    description: "Buy 10 Teas, Get 1 Free!",
    category: "tea",
    bogoBuy: 10,
    bogoFree: 1
  }
];
