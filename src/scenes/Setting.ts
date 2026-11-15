import { AudioManager } from "../AudioManager";
import { GameData } from "../GameData";

export default class Setting extends Phaser.Scene {
  private openedFromPause = false;
  private audioManager!: AudioManager;
  private musicCheckbox!: Phaser.GameObjects.Rectangle;
  private sfxCheckbox!: Phaser.GameObjects.Rectangle;

  constructor() {
    super({ key: "Setting" });
  }

  create(data?: { fromPause?: boolean }): void {
    this.openedFromPause = data?.fromPause === true;
    this.audioManager = new AudioManager(this, GameData.audioSettings ?? {});

    const { width, height } = this.scale;
    this.add.image(0, 0, "old-main-menu")
      .setOrigin(0)
      .setDisplaySize(width, height);
    this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0);

    const panel = this.add.container(width / 2, height / 2);
    const panelBackground = this.add.rectangle(0, 0, width * 0.6, height * 0.7, 0xe8e8e8, 0.2);
    panelBackground.setStrokeStyle(4, 0xffffff, 0.5);
    panel.add(panelBackground);

    panel.add(this.add.text(0, -height * 0.25, "IMPOSTAZIONI", {
      fontSize: "50px",
      color: "#4fa4c1",
      fontFamily: "Early_GameBoy",
      stroke: "#000000",
      strokeThickness: 8,
    }).setOrigin(0.5));

    panel.add(this.add.text(-150, -50, "MUSICA", {
      fontSize: "32px",
      color: "#ffffff",
      fontFamily: "Early_GameBoy",
      stroke: "#000000",
      strokeThickness: 4,
    }).setOrigin(0, 0.5));
    this.musicCheckbox = this.createCheckbox(panel, 150, -50);

    panel.add(this.add.text(-150, 50, "EFFETTI", {
      fontSize: "32px",
      color: "#ffffff",
      fontFamily: "Early_GameBoy",
      stroke: "#000000",
      strokeThickness: 4,
    }).setOrigin(0, 0.5));
    this.sfxCheckbox = this.createCheckbox(panel, 150, 50);

    const back = this.add.text(0, height * 0.25, "TORNA AL MENU", {
      fontSize: "36px",
      color: "#ffffff",
      fontFamily: "Early_GameBoy",
      backgroundColor: "#d11141",
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
    }).setOrigin(0.5);
    back.setInteractive({ useHandCursor: true });
    back.on("pointerdown", () => this.goBack());
    panel.add(back);

    if (this.openedFromPause) {
      const close = this.add.text(width * 0.3 - 20, -height * 0.35 + 20, "X", {
        fontSize: "40px",
        color: "#ff0000",
        fontFamily: "Early_GameBoy",
        stroke: "#ffffff",
        strokeThickness: 4,
      }).setOrigin(1, 0);
      close.setInteractive({ useHandCursor: true });
      close.on("pointerdown", () => this.resumeGame());
      panel.add(close);
    }

    this.setupAudioControls();
  }

  private createCheckbox(
    panel: Phaser.GameObjects.Container,
    x: number,
    y: number,
  ): Phaser.GameObjects.Rectangle {
    const checkbox = this.add.rectangle(x, y, 40, 40, 0xffffff)
      .setStrokeStyle(3, 0x000000)
      .setInteractive({ useHandCursor: true });
    panel.add(checkbox);
    return checkbox;
  }

  private setupAudioControls(): void {
    const musicEnabled = this.registry.get("musicEnabled") !== false;
    const sfxEnabled = this.registry.get("sfxEnabled") !== false;
    this.registry.set("musicEnabled", musicEnabled);
    this.registry.set("sfxEnabled", sfxEnabled);
    this.updateCheckbox(this.musicCheckbox, musicEnabled);
    this.updateCheckbox(this.sfxCheckbox, sfxEnabled);

    this.musicCheckbox.on("pointerdown", () => {
      const enabled = this.registry.get("musicEnabled") !== true;
      this.registry.set("musicEnabled", enabled);
      this.updateCheckbox(this.musicCheckbox, enabled);
      this.audioManager.setCategoryVolume("music", enabled ? 1 : 0);
    });
    this.sfxCheckbox.on("pointerdown", () => {
      const enabled = this.registry.get("sfxEnabled") !== true;
      this.registry.set("sfxEnabled", enabled);
      this.updateCheckbox(this.sfxCheckbox, enabled);
      this.audioManager.setCategoryVolume("sfx", enabled ? 1 : 0);
    });
  }

  private updateCheckbox(checkbox: Phaser.GameObjects.Rectangle, enabled: boolean): void {
    checkbox.setFillStyle(enabled ? 0x00ff00 : 0xff0000);
  }

  private goBack(): void {
    if (this.openedFromPause) {
      this.scene.stop("Setting");
      this.scene.wake("Pause");
      return;
    }
    this.scene.start("Intro");
  }

  private resumeGame(): void {
    this.scene.stop("Setting");
    this.scene.stop("Pause");
    this.scene.resume("GamePlay");
  }
}
