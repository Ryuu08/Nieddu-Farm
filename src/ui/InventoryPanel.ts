import { PlayerInventory } from "../types/Inventory";

export function formatInventory(
  inventory: PlayerInventory,
  currencyLabel = "Coins",
): string {
  return [
    `${currencyLabel}: ${inventory.coins}`,
    `Materials - Latte: ${inventory.milk} | Lana: ${inventory.wool} | Formaggio: ${inventory.cheese} | Coperte: ${inventory.blankets}`,
  ].join("  |  ");
}