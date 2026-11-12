import { PlayerInventory } from "../types/Inventory";

export function formatInventory(
  inventory: PlayerInventory,
  currencyLabel = "Coins",
): string {
  return `${currencyLabel}: ${inventory.coins} | Milk: ${inventory.milk} | Wool: ${inventory.wool}`;
}
