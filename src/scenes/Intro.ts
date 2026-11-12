export default class Intro extends Phaser.Scene {

  private _bg!: Phaser.GameObjects.Image;
  private _image1!: Phaser.GameObjects.Image;
  private _title!: Phaser.GameObjects.Text;

  private _playButton!: Phaser.GameObjects.Text;
  private _creditsButton!: Phaser.GameObjects.Text;
  private _settingsButton!: Phaser.GameObjects.Text;
  private _storeButton!: Phaser.GameObjects.Text;

  private _music!: Phaser.Sound.BaseSound;

  // Text dimensions.
  private readonly TITLE_SIZE = 48;
  private readonly BUTTON_SIZE = 30;

  // Colors for UI consistency.
  private readonly TITLE_COLOR = "#4fa4c1";
  private readonly BUTTON_COLOR = "#ffffff";

  // Font.
  private readonly UI_FONT = "Early_GameBoy";



  constructor() {
    super({
      key: "Intro",
    });

  }

  preload() {
    // Wait until the pixel font is ready before create().
    const fontPromises = [
      document.fonts.load(`${this.TITLE_SIZE}px ${this.UI_FONT}`),
      document.fonts.load(`${this.BUTTON_SIZE}px ${this.UI_FONT}`),
    ];

    const fontReady = new Promise<void>((resolve) => {
      Promise.all(fontPromises)
          .then(() => resolve())
          .catch(() => resolve());
    });

    // Pause Phaser until the fonts are ready.
    this.load.addFile(
        new (class extends Phaser.Loader.File {
          constructor(loader: Phaser.Loader.LoaderPlugin) {
            super(loader, { type: "localfont", key: "localfonts" });
          }
          load() {
            fontReady.then(() => this.loader.nextFile(this, true));
          }
        })(this.load)
    );

  }
  create() {

    // Clean up leftover scenes when returning to the menu.
    this.scene.stop("Hud");
    this.scene.stop("Pause");
    this.scene.stop("Setting");
    this.scene.stop("GamePlay");
    this.scene.stop("Store");

    this.createBackground();
    this.createLogo();
    this.createTitle();
    this.createButtons();

    // Start the intro music in a loop using the `intro_music` key.
    const introKey = "intro_music";
    if (this.cache.audio.exists(introKey)) {
      this._music = (this.sound.get(introKey) as Phaser.Sound.BaseSound) ?? this.sound.add(introKey, { loop: true, volume: 1 });

      const tryPlay = () => {
        try {
          const ctx = (this.sound as any).context;
          if (ctx && ctx.state === "suspended") {
            ctx.resume().then(() => {
              if (this._music && !this._music.isPlaying) this._music.play();
            }).catch(() => {
              if (this._music && !this._music.isPlaying) this._music.play();
            });
          } else {
            if (this._music && !this._music.isPlaying) this._music.play();
          }
        } catch (e) {
          if (this._music && !this._music.isPlaying) this._music.play();
        }
      };

      tryPlay();

      // Ensure audio context resumes on first user interaction so music can play.
      this.input.once("pointerdown", () => {
        try {
          const ctx = (this.sound as any).context;
          if (ctx && ctx.state === "suspended") ctx.resume();
        } catch (e) {
          // ignore
        }
        if (this._music && !this._music.isPlaying) this._music.play();
      });
    }

    // In case another scene starts GamePlay without using the Play button,
    // stop the intro music when this scene is shutdown or put to sleep.
    this.events.on('shutdown', () => {
      try {
        if (this._music && this._music.isPlaying) this._music.stop();
      } catch (e) {}
    });
    this.events.on('sleep', () => {
      try {
        if (this._music && this._music.isPlaying) this._music.stop();
      } catch (e) {}
    });

    
    

  }

  update(time: number, delta: number): void {}
  private createBackground(): void {
    this._bg = this.add.image(0, 0, "bg_mainmenu");
    this._bg.setOrigin(0, 0);
    this._bg.setDisplaySize(this.game.canvas.width, this.game.canvas.height);

    const overlay = this.add.rectangle(
        0,
        0,
        this.game.canvas.width,
        this.game.canvas.height,
        0x000000,
        0.2
    );
    overlay.setOrigin(0, 0);
  }

  private createLogo(): void {
    this._image1 = this.add.image(1192, 82, "intro-logo-test");
    this._image1.setOrigin(0.5);
    this._image1.setScale(0.15);
  }

  private createTitle(): void {
    this._title = this.add.text(
        this.game.canvas.width / 2,
        this.game.canvas.height / 2 - 20,
        "Nieddu Farm",
        {
          fontSize: `${this.TITLE_SIZE}px`,
          color: this.TITLE_COLOR,
          fontFamily: this.UI_FONT,
        }
    );
    this._title.setStroke("#000000", 8);
    this._title.setOrigin(0.5);
  }

  private createButtons(): void {
    this._playButton = this.createMenuButton("Play", this.game.canvas.height / 2 + 180, () => {
      try {
        if (this._music && this._music.isPlaying) {
          this._music.stop();
        }
      } catch (e) {
        // ignore
      }
      this.scene.start("GamePlay");
    });

    this._settingsButton = this.createMenuButton("Settings", this.game.canvas.height / 2 + 255, () => {
      this.scene.start("Setting", { fromPause: false });
    });

    this._creditsButton = this.createMenuButton("Credits", this.game.canvas.height / 2 + 330, () => {
      this.scene.start("Credits");
    });
  }

  private createMenuButton(label: string, y: number, onClick: () => void): Phaser.GameObjects.Text {
    const normalColor = this.BUTTON_COLOR;
    const selectedColor = this.TITLE_COLOR;

    const button = this.add.text(this.game.canvas.width / 2, y, label, {
      fontSize: `${this.BUTTON_SIZE}px`,
      color: normalColor,
      fontFamily: this.UI_FONT,
    });

    button.setStroke("#000000", 6);
    button.setOrigin(0.5);
    button.setInteractive({ useHandCursor: true });

    button.on("pointerover", () => {
      button.setScale(1.15);
      button.setColor(selectedColor);
    });

    button.on("pointerout", () => {
      button.setScale(1);
      button.setColor(normalColor);
    });

    button.on("pointerdown", () => {
      button.setColor(selectedColor);
      onClick();
    });

    return button;
  }
}
