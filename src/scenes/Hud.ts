
import { formatInventory } from "../ui/InventoryPanel";

export default class Hud extends Phaser.Scene {
  private inventoryText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private controlsText!: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: "Hud",
    });
  }

  create(): void {
    this.inventoryText = this.add.text(640, 780, "", {
      color: "#ffffff",
      backgroundColor: "rgba(27, 105, 215, 0.5)",
      align: "center",
      padding: { left: 12, right: 12, top: 8, bottom: 8 },
      fontFamily: "Arial",
      fontSize: "20px",
    }) .setOrigin(0.5, 1) .setScrollFactor(0) .setDepth(10);

    this.statusText = this.add.text(24, 20, "", {
      color: "#e20303",
      backgroundColor: "rgba(27, 105, 215, 0.5)",
      padding: { left: 12, right: 12, top: 8, bottom: 8 },
      fontFamily: "Arial",
      fontSize: "18px",
    }).setScrollFactor(0) .setDepth(10) .setVisible(false);
    // Display controls at the beginning of the game.
    this.controlsText = this.add.text(24, 20,
  "CONTROLS\nWASD / Freccie - Muovi\nF/E - Raccogli latte / Lana, C/X - Store/Laboratorio", {
    color: "#ffffff",
    backgroundColor: "rgba(27, 105, 215, 0.5)",
    padding: { left: 12, right: 12, top: 8, bottom: 8 },
    fontFamily: "Arial",
    fontSize: "16px",
    lineSpacing: 4,
  }).setScrollFactor(0).setDepth(10).setOrigin(0, 0);
    
  }

  update(): void {
    this.updateDisplay();
  }

  private updateDisplay(): void {
    const inventory = this.registry.get("playerInventory") ?? {
      coins: 0,
      milk: 0,
      wool: 0,
      sheep: 0,
      milkBucketLevel: 0,
      shearsLevel: 0,
      latte: 0,
      lana: 0,
      formaggio: 0,
      coperte: 0,
      lvlCesoie: 0,
      lvlSecchi: 0,
    };
    const currencyLabel = this.registry.get("currencyLabel") ?? "Coins";
    const productionStatus = this.registry.get("productionStatus") ?? "";
    const hudMessage = this.registry.get("hudMessage") ?? "";

    if (inventory) {
      this.inventoryText.setText(formatInventory(inventory, currencyLabel));
    }

    this.statusText.setText(`${productionStatus} | ${hudMessage}`);
  }
  public showStatus(message: string): void {
    this.statusText.setText(message);
    this.statusText.setVisible(true);
}

  public hideStatus(): void {
    this.statusText.setVisible(false);
}
}
