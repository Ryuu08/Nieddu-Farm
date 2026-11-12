import { formatInventory } from "../ui/InventoryPanel";

export default class Hud extends Phaser.Scene {
  private inventoryText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: "Hud",
    });
  }


  create(): void {
    this.inventoryText = this.add.text(24, 20, "", {
      color: "#ffffff",
      backgroundColor: "#31512a",
      padding: { left: 12, right: 12, top: 8, bottom: 8 },
      fontFamily: "Arial",
      fontSize: "20px",
    }).setScrollFactor(0).setDepth(10);

    this.statusText = this.add.text(24, 76, "", {
      color: "#ffffff",
      backgroundColor: "#76513a",
      padding: { left: 12, right: 12, top: 8, bottom: 8 },
      fontFamily: "Arial",
      fontSize: "18px",
    }).setScrollFactor(0).setDepth(10);
    this.updateDisplay();
  }

  update(): void {
    this.updateDisplay();
  }

  private updateDisplay(): void {
    const inventory = this.registry.get("playerInventory");
    const currencyLabel = this.registry.get("currencyLabel") ?? "Coins";
    const productionStatus = this.registry.get("productionStatus") ?? "";
    const hudMessage = this.registry.get("hudMessage") ?? "";

    if (inventory) {
      this.inventoryText.setText(formatInventory(inventory, currencyLabel));
    }
    this.statusText.setText(`${productionStatus} | ${hudMessage}`);
  }
}
