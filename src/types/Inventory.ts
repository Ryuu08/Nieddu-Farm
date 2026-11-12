export interface PlayerInventory {
  coins: number;
  milk: number;
  wool: number;
  sheep: number;
  milkBucketLevel: number;
  shearsLevel: number;
  latte: number;
  lana: number;
  formaggio: number;
  coperte: number;
  lvlCesoie: number;
  lvlSecchi: number;
}

export type SellableProduct = "milk" | "wool";
