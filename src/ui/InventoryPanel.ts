import { PlayerInventory } from "../types/Inventory";

export function formatInventory(inventory: PlayerInventory): string {
  return `Monete: ${inventory.coins} | Latte: ${inventory.milk} | Lana: ${inventory.wool}`;
}
