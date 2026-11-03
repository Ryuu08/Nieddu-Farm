import { SellableProduct } from "../types/Inventory";

export interface ProductPrice {
  product: SellableProduct;
  coins: number;
}

export interface UpgradeData {
  id: "milkBucket" | "shears";
  name: string;
  cost: number;
  productionTimeMultiplier: number;
}

export const PRODUCT_PRICES: ProductPrice[] = [
  { product: "milk", coins: 3 },
  { product: "wool", coins: 5 },
];

export const UPGRADES: UpgradeData[] = [
  {
    id: "milkBucket",
    name: "Secchio migliorato",
    cost: 15,
    productionTimeMultiplier: 0.8,
  },
  {
    id: "shears",
    name: "Cesoie migliorate",
    cost: 20,
    productionTimeMultiplier: 0.8,
  },
];
