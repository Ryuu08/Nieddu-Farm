export default class Pause extends Phaser.Scene {
  constructor() {
    super({ key: "Pause" });
  }

  create(): void {
    const { centerX, centerY, width, height } = this.cameras.main;

    this.cameras.main.setBackgroundColor("rgba(0, 0, 0, 0)");
    this.add.rectangle(centerX, centerY, width, height, 0x000000, 0.55);

    this.add.text(centerX, centerY - 100, "GAME PAUSED", {
      color: "#ffffff",
      fontFamily: "Arial",
      fontSize: "52px",
      fontStyle: "bold",
    }).setOrigin(0.5);

    const resume = this.add.text(centerX, centerY, "RESUME", {
      color: "#ffe66d",
      fontFamily: "Arial",
      fontSize: "28px",
      fontStyle: "bold",
    }).setOrigin(0.5);
    resume.setInteractive({ useHandCursor: true });
    resume.on("pointerdown", () => this.resumeGame());

    const backToMenu = this.add.text(centerX, centerY + 70, "BACK TO MENU", {
      color: "#ffffff",
      fontFamily: "Arial",
      fontSize: "24px",
    }).setOrigin(0.5);
    backToMenu.setInteractive({ useHandCursor: true });
    backToMenu.on("pointerdown", () => this.returnToMenu());

    this.input.keyboard?.once("keydown-ESC", () => this.resumeGame());
  }

  private resumeGame(): void {
    this.scene.stop("Pause");
    this.scene.resume("GamePlay");
  }

  private returnToMenu(): void {
    this.scene.stop("Pause");
    this.scene.stop("Hud");
    this.scene.stop("GamePlay");
    this.scene.start("Intro");
  }
}
