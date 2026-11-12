export default class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: "GameOver" });
  }

  create(): void {
    // TODO: Replace this placeholder screen with the final end-game flow.
    this.cameras.main.setBackgroundColor("#1b2430");
    this.add.text(640, 300, "GAME OVER", {
      color: "#ffffff",
      fontFamily: "Arial",
      fontSize: "56px",
      fontStyle: "bold",
    }).setOrigin(0.5);
    this.add.text(640, 390, "Press ENTER to return to the title screen", {
      color: "#d8e6f3",
      fontFamily: "Arial",
      fontSize: "22px",
    }).setOrigin(0.5);

    this.input.keyboard?.once("keydown-ENTER", () => {
      this.scene.start("Intro");
    });
  }
}
