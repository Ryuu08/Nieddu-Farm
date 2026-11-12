import { PlayerInventory, SellableProduct } from "../types/Inventory";

export function createDefaultInventory(): PlayerInventory {
  return {
    coins: 0,
    milk: 0,
    wool: 0,
    sheep: 1,
    milkBucketLevel: 0,
    shearsLevel: 0,
    latte: 0,
    lana: 0,
    formaggio: 0,
    coperte: 0,
    lvlCesoie: 0,
    lvlSecchi: 0,
  };
}

export class InventorySystem {
  constructor(private readonly inventory: PlayerInventory) {}

  public add(product: SellableProduct, quantity: number): void {
    if (quantity < 0) {
      throw new Error("Inventory quantity cannot be negative.");
    }

    this.inventory[product] += quantity;
    if (product === "milk") {
      this.inventory.latte = this.inventory.milk;
    } else {
      this.inventory.lana = this.inventory.wool;
    }
  }

  public remove(product: SellableProduct, quantity: number): boolean {
    if (quantity < 0 || this.inventory[product] < quantity) {
      return false;
    }

    this.inventory[product] -= quantity;
    if (product === "milk") {
      this.inventory.latte = this.inventory.milk;
    } else {
      this.inventory.lana = this.inventory.wool;
    }
    return true;
  }
}
