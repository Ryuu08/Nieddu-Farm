
export interface PlayerInventory {
    coins: number;
    milk: number;
    wool: number;
    cheese: number;
    blankets: number;
    sheep: number;
    blackSheep: number;
    milkBucketLevel: number;
    shearsLevel: number;
}

export type SellableProduct = "milk" | "wool";
