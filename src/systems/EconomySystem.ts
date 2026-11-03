import { PRODUCT_PRICES } from "../data/ItemData";
import { InventorySystem } from "./InventorySystem";
import { PlayerInventory, SellableProduct } from "../types/Inventory";

export class EconomySystem {
  private readonly inventorySystem: InventorySystem;

  constructor(private readonly inventory: PlayerInventory) {
    this.inventorySystem = new InventorySystem(inventory);
  }

  public sell(product: SellableProduct, quantity: number): number {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return 0;
    }

    const price = PRODUCT_PRICES.find((entry) => entry.product === product)?.coins;
    if (price === undefined || !this.inventorySystem.remove(product, quantity)) {
      return 0;
    }

    const earnings = price * quantity;
    this.inventory.coins += earnings;
    return earnings;
  }
}
