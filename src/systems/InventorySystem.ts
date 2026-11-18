import { PlayerInventory, SellableProduct } from "../types/Inventory";

export function createDefaultInventory(): PlayerInventory {
    return {
        coins: 0,
        milk: 0,
        wool: 0,
        cheese: 0,
        blankets: 0,
        sheep: 2,
        blackSheep: 0,
        milkBucketLevel: 0,
        shearsLevel: 0,
    };
}

export class InventorySystem {
    constructor(private readonly inventory: PlayerInventory) {}

    public add(product: SellableProduct, quantity: number): void {
        if (quantity < 0) {
            throw new Error("Inventory quantity cannot be negative.");
        }

        this.inventory[product] += quantity;
    }

    public remove(product: SellableProduct, quantity: number): boolean {
        if (quantity < 0 || this.inventory[product] < quantity) {
            return false;
        }

        this.inventory[product] -= quantity;
        return true;
    }
}