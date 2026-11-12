import { PlayerInventory } from "../types/Inventory";

export function formatInventory(
  inventory: PlayerInventory,
  currencyLabel = "Coins",
): string {
  return [
    `${currencyLabel}: ${inventory.coins}`,
    `Materials - Milk: ${inventory.milk} | Wool: ${inventory.wool} | Cheese: ${inventory.formaggio} | Blankets: ${inventory.coperte}`,
    `Sheep: ${inventory.sheep}`,
    `Tools - Bucket Lv.${inventory.milkBucketLevel} | Shears Lv.${inventory.shearsLevel}`,
  ].join("\n");
}
