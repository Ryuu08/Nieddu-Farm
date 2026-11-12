export default class Victory extends Phaser.Scene {
  constructor() {
    super({ key: "Victory" });
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#263b2b");
    this.add.text(640, 280, "YOU WIN!", {
      color: "#ffe66d",
      fontFamily: "Arial",
      fontSize: "64px",
      fontStyle: "bold",
    }).setOrigin(0.5);
    this.add.text(640, 380, "You found the legendary black sheep.", {
      color: "#ffffff",
      fontFamily: "Arial",
      fontSize: "24px",
    }).setOrigin(0.5);
    this.add.text(640, 470, "Press ENTER to return to the title screen", {
      color: "#d8e6f3",
      fontFamily: "Arial",
      fontSize: "22px",
    }).setOrigin(0.5);

    this.input.keyboard?.once("keydown-ENTER", () => {
      this.scene.start("Intro");
    });
  }
}
