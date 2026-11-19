import GamePlay from "./GamePlay";

export default class Pause extends Phaser.Scene {
  private escapeKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: "Pause" });
  }

  create(): void {
    const { centerX, centerY, width, height } = this.cameras.main;
    this.cameras.main.setBackgroundColor("rgba(0, 0, 0, 0)");
    this.add.rectangle(centerX, centerY, width, height, 0x000000, 0.45);

    this.add.text(centerX, centerY - 20, "Game Paused", {
      fontSize: "48px",
      fontFamily: "Early_GameBoy",
      color: "#ffffff",
    }).setOrigin(0.5);

    const resume = this.createButton(centerX, centerY + 40, "Resume");
    resume.on("pointerdown", () => this.resumeGame());

    const settings = this.createButton(centerX, centerY + 80, "Settings");
    settings.on("pointerdown", () => this.openSettings());

    const backToMenu = this.createButton(centerX, centerY + 120, "Back to Menu");
    backToMenu.on("pointerdown", () => this.returnToMenu());

    this.escapeKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.escapeKey.once("down", () => this.resumeGame());
  }

  private createButton(x: number, y: number, label: string): Phaser.GameObjects.Text {
    const button = this.add.text(x, y, label, {
      fontSize: "24px",
      fontFamily: "Early_GameBoy",
      color: "#ffffff",
    }).setOrigin(0.5);
    button.setInteractive({ useHandCursor: true });
    button.on("pointerover", () => button.setColor("#4fa4c1"));
    button.on("pointerout", () => button.setColor("#ffffff"));
    return button;
  }

  private resumeGame(): void {
    this.scene.stop("Pause");
    this.scene.resume("GamePlay");
  }

  private openSettings(): void {
    this.scene.launch("Setting", { fromPause: true });
    this.scene.sleep("Pause");
    this.scene.bringToTop("Setting");
  }

  private returnToMenu(): void {
    const gameplay = this.scene.get("GamePlay") as GamePlay;

  gameplay.eraResetToDefault();
  gameplay.inventoryResetToDefault();
    this.scene.stop("Pause");
    this.scene.stop("Hud");
    this.scene.stop("GamePlay");
    this.scene.start("Intro");
  }
}
