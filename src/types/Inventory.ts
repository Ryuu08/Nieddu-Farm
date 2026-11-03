export interface PlayerInventory {
  coins: number;
  milk: number;
  wool: number;
  sheep: number;
  milkBucketLevel: number;
  shearsLevel: number;
}

export type SellableProduct = "milk" | "wool";
