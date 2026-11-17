export default class Victory extends Phaser.Scene {
  constructor() {
    super({ key: "Victory" });
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#263b2b");
    this.add.image(250, 380, "era-narrator-futuro").setDisplaySize(220, 220);
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
    this.add.text(640, 445, "Nel futuro, la tradizione sarda continua grazie alle tue scelte.", {
      color: "#f4d58d",
      fontFamily: "Arial",
      fontSize: "20px",
      wordWrap: { width: 650 },
      align: "center",
    }).setOrigin(0.5);
    this.add.text(640, 530, "Press ENTER to return to the title screen", {
      color: "#d8e6f3",
      fontFamily: "Arial",
      fontSize: "22px",
    }).setOrigin(0.5);

    this.input.keyboard?.once("keydown-ENTER", () => {
      this.scene.start("Intro");
    });
  }
}
