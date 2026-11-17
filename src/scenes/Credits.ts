export default class Credits extends Phaser.Scene {
  constructor() {
    super({ key: "Credits" });
  }

  create(): void {
    const { width, height } = this.scale;
    this.add.image(0, 0, "old-main-menu")
      .setOrigin(0)
      .setDisplaySize(width, height);
    this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0);

    const panel = this.add.container(width / 2, height / 2);
    const panelBackground = this.add.rectangle(0, 0, width * 0.7, height * 0.8, 0xe8e8e8, 0.2);
    panelBackground.setStrokeStyle(4, 0xffffff, 0.5);
    panel.add(panelBackground);

    panel.add(this.add.text(0, -height * 0.3, "CREDITI", {
      fontSize: "60px",
      color: "#4fa4c1",
      fontFamily: "Early_GameBoy",
      stroke: "#000000",
      strokeThickness: 8,
    }).setOrigin(0.5));

    panel.add(this.add.text(0, 0, [
      "Sviluppo: Ryuu08",
      "Grafica: Tadin",
      "Musica: SanKimono",
      "",
      "Special Thanks:",
      "HackFarm Team",
    ], {
      fontSize: "32px",
      color: "#ffffff",
      fontFamily: "Early_GameBoy",
      align: "center",
      stroke: "#000000",
      strokeThickness: 4,
      lineSpacing: 20,
    }).setOrigin(0.5));

    const back = this.add.text(0, height * 0.3, "TORNA AL MENU", {
      fontSize: "40px",
      color: "#ffffff",
      fontFamily: "Early_GameBoy",
      backgroundColor: "#d11141",
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
    }).setOrigin(0.5);
    back.setInteractive({ useHandCursor: true });
    back.on("pointerdown", () => this.scene.start("Intro"));
    panel.add(back);
  }
}
