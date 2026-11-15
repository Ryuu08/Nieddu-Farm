import Player, { PlayerMovementKeys } from "../entities/Player";
import Sheep from "../entities/Sheep";
import { ERAS } from "../data/EraData";
import { createDefaultInventory, InventorySystem } from "../systems/InventorySystem";
import { ProductionSystem } from "../systems/ProductionSystem";
import { GameData } from "../GameData";

export default class GamePlay extends Phaser.Scene {
  // Core actors and input objects used by the gameplay scene.
  private player!: Player;
  private sheepGroup!: Phaser.Physics.Arcade.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private movementKeys!: PlayerMovementKeys;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private shearKey!: Phaser.Input.Keyboard.Key;
  private storeKey!: Phaser.Input.Keyboard.Key;
  private laboratoryKey!: Phaser.Input.Keyboard.Key;
  private eraKey!: Phaser.Input.Keyboard.Key;
  private continueEraKey!: Phaser.Input.Keyboard.Key;
  private escapeKey!: Phaser.Input.Keyboard.Key;

  // Current era state and the visual/audio objects that represent it.
  private eraIndex = 0;
  private farmBackground!: Phaser.GameObjects.Image;
  private nightOverlay!: Phaser.GameObjects.Rectangle;
  private eraMusic!: Phaser.Sound.BaseSound;
  private readonly eraMusicKeys = ["farm_music", "farm_music_2", "farm_music_3"] as const;
  private readonly eraDecorationKeys = [
    "era-decoration-nuragica",
    "era-decoration-romana",
    "era-decoration-giudicati",
    "era-decoration-moderna",
    "era-decoration-futuro",
  ] as const;
  private readonly eraLaboratoryKeys = [
    "old-lab-nuraghe",
    "old-lab-romano",
    "old-lab-giudicati",
    "old-lab-moderno",
    "old-lab-futuro",
  ] as const;
  private readonly eraSignKeys = [
    "era-sign-0",
    "era-sign-1",
    "era-sign-2",
    "era-sign-3",
    "era-sign-4",
  ] as const;

  // Static groups hold the era objects that can block the player or sheep.
  private decorationGroup!: Phaser.Physics.Arcade.StaticGroup;
  private signGroup!: Phaser.Physics.Arcade.StaticGroup;
  private currentDecoration?: Phaser.GameObjects.Image;
  private currentLaboratory?: Phaser.GameObjects.Image;
  private currentSign?: Phaser.GameObjects.Image;

  // Transition and sheep AI state.
  private isEraTransitioning = false;
  private sheepMoveTimer = 0;
  private readonly eraNarratorKeys = [
    "era-narrator-nuragica",
    "era-narrator-romana",
    "era-narrator-giudicati",
    "era-narrator-moderna",
    "era-narrator-futuro",
  ] as const;
  private eraTransitionLayer?: Phaser.GameObjects.Container;
  private readonly eraHistory = [
    "I nuraghi furono costruiti durante l'eta del Bronzo e dell'eta del Ferro. Ancora oggi sono uno dei simboli piu riconoscibili della Sardegna.",
    "Roma conquisto la Sardegna nel 238 a.C. L'isola divenne una provincia importante per il grano e per le rotte del Mediterraneo.",
    "Nel Medioevo la Sardegna era divisa in quattro giudicati: Cagliari, Arborea, Torres e Gallura, ciascuno con le proprie istituzioni.",
    "La pastorizia e la lavorazione del latte hanno attraversato i secoli e sono ancora parte importante della cultura e dell'economia sarda.",
    "Questa era immagina una Sardegna del futuro: tradizione, tecnologia e rispetto del territorio possono crescere insieme.",
  ] as const;
  private readonly eraTransitions = [
    "Dalle comunita nuragiche alle nuove rotte del Mediterraneo, la Sardegna entra nell'epoca romana.",
    "Dopo Roma, l'isola sviluppa nuove forme di autonomia che porteranno alla nascita dei giudicati.",
    "Con il passare dei secoli, le tradizioni dei giudicati si trasformano nella cultura pastorale che conosciamo ancora oggi.",
    "La tradizione non scompare: nel futuro puo incontrare la tecnologia e diventare una nuova risorsa per l'isola.",
    "Questa e una visione del futuro: la storia della Sardegna continua nelle scelte di chi la vive.",
  ] as const;

  // Production, day/night, and inventory systems used by this scene.
  private shearCooldownUntil = 0;
  private timeOfDay = 0;
  private isNight = false;
  private dayNumber = 1;
  private nightCullWeights = { zero: 50, one: 30, two: 20 };
  private static readonly SHEAR_COOLDOWN_MS = 3_000;
  private static readonly DAY_DURATION_MS = 30_000;
  private static readonly NIGHT_DURATION_MS = 10_000;
  private readonly inventory = createDefaultInventory();
  private readonly productionSystem = new ProductionSystem();
  private inventorySystem!: InventorySystem;

  constructor() {
    super({ key: "GamePlay" });
  }

  /**
   * Builds the farm, connects physics colliders, and registers gameplay input.
   */
  create(): void {
    // Reset the temporary shearing cooldown every time the scene is created.
    this.shearCooldownUntil = 0;
    this.createLegacyAnimations();
    this.createTemporaryFarm();
    this.playMusicForEra(this.eraIndex);

    this.player = new Player(this, 320, 420, "player-legacy", 16);
    this.player.setScale(1.5);
    this.player.setBodySize(20, 35).setOffset(5, 10);

    // Sheep collide with the player and with one another.
    this.sheepGroup = this.physics.add.group();
    this.physics.add.collider(this.player, this.sheepGroup);
    this.physics.add.collider(this.sheepGroup, this.sheepGroup);
    this.decorationGroup = this.physics.add.staticGroup();
    this.signGroup = this.physics.add.staticGroup();
    this.physics.add.collider(this.player, this.decorationGroup);
    this.physics.add.collider(this.sheepGroup, this.decorationGroup);
    this.physics.add.collider(this.player, this.signGroup);
    this.physics.add.collider(this.sheepGroup, this.signGroup);
    // Create the visual and collision objects for the starting era.
    this.spawnEraWorldObjects(this.eraIndex);
    this.spawnSheep(560, 360);
    this.spawnSheep(640, 380);
    this.spawnSheep(720, 420);
    this.spawnSheep(680, 320);

    // Keyboard controls preserve the legacy WASD and arrow-key layout.
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.movementKeys = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.shearKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    this.storeKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.laboratoryKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.L);
    this.eraKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.T);
    this.continueEraKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.escapeKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.escapeKey.on("down", () => this.openPauseMenu());
    this.inventorySystem = new InventorySystem(this.inventory);

    this.syncHud("Move with WASD or arrows. Press E/F near a sheep. Press T to change era.");
    // HUD runs as an overlay scene and is stopped with gameplay.
    this.scene.launch("Hud");
    this.scene.bringToTop("Hud");
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.isEraTransitioning = false;
      this.eraTransitionLayer?.destroy();
      this.eraMusic?.stop();
      if (this.scene.isActive("Hud")) {
        this.scene.stop("Hud");
      }
    });
  }

  private openPauseMenu(): void {
    // Avoid launching multiple pause overlays from repeated ESC input.
    if (this.scene.isActive("Pause")) {
      return;
    }

    this.scene.pause("GamePlay");
    this.scene.launch("Pause");
    this.scene.bringToTop("Pause");
  }

  update(time: number, delta: number): void {
    // Update actors and simulation before processing one-frame input actions.
    this.player.move(this.cursors, this.movementKeys);
    this.updateSheepMovement(delta);
    this.updateSheepProduction(delta);
    this.updateDayNight(delta);

    // E collects milk from the nearest sheep in range.
    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      this.collectProducts();
    }

    // F collects wool when the player owns shears.
    if (Phaser.Input.Keyboard.JustDown(this.shearKey)) {
      this.shearSheep(time);
    }

    // T remains a development shortcut for advancing the era.
    if (Phaser.Input.Keyboard.JustDown(this.eraKey)) {
      this.changeEra();
    }

    // Store and laboratory are overlay scenes, so gameplay is paused underneath.
    if (Phaser.Input.Keyboard.JustDown(this.storeKey)) {
      this.scene.pause("GamePlay");
      this.scene.launch("Store");
    }

    if (Phaser.Input.Keyboard.JustDown(this.laboratoryKey)) {
      this.scene.pause("GamePlay");
      this.scene.launch("Laboratory");
    }

    this.syncHud();
  }

  private createTemporaryFarm(): void {
    // The legacy era image is currently used as the playable farm background.
    this.cameras.main.setBackgroundColor("#9bcf82");
    this.farmBackground = this.add.image(
      GameData.globals.gameWidth / 2,
      GameData.globals.gameHeight / 2,
      ERAS[0].backgroundKey,
    )
      .setDisplaySize(GameData.globals.gameWidth, GameData.globals.gameHeight)
      .setTint(0xb4d895);

    // Cover the complete game area with a subtle dark veil during the night.
    this.nightOverlay = this.add.rectangle(
      GameData.globals.gameWidth / 2,
      GameData.globals.gameHeight / 2,
      GameData.globals.gameWidth,
      GameData.globals.gameHeight,
      0x000000,
      0,
    );

    this.add.text(640, 95, "NIEDDU FARM", {
      color: "#ffffff",
      fontFamily: "Arial",
      fontSize: "32px",
      fontStyle: "bold",
      stroke: "#31512a",
      strokeThickness: 8,
    }).setOrigin(0.5);
  }

  private changeEra(): void {
    // Development shortcut: cycle through eras without using the Store.
    if (this.isEraTransitioning) {
      // Ignore input while the historical explanation is waiting for ENTER.
      return;
    }

    // Hide the HUD so the historical panel can use the whole screen.
    this.isEraTransitioning = true;
    this.syncHud("Changing era...");
    const camera = this.cameras.main;
    if (this.scene.isActive("Hud")) {
      this.scene.setVisible(false, "Hud");
    }

    // A solid overlay guarantees an immediate blackout before changing assets.
    this.eraTransitionLayer = this.add.container(0, 0).setDepth(1200);
    const blackout = this.add.rectangle(
      camera.width / 2,
      camera.height / 2,
      camera.width,
      camera.height,
      0x000000,
      1,
    );
    this.eraTransitionLayer.add(blackout);

    // Delay the era swap until the player has seen the blackout.
    this.time.delayedCall(700, () => {
        this.eraIndex = (this.eraIndex + 1) % ERAS.length;
        const era = ERAS[this.eraIndex];
        this.farmBackground.setTexture(era.backgroundKey);
        this.playMusicForEra(this.eraIndex);
        this.spawnEraWorldObjects(this.eraIndex);
        this.registry.set("eraIndex", this.eraIndex);
        this.syncHud(`Era changed: ${era.name}.`);
        const previousEra = ERAS[(this.eraIndex - 1 + ERAS.length) % ERAS.length];
        this.showEraHistory(
          previousEra.name,
          era.name,
          this.eraHistory[this.eraIndex],
          this.eraTransitions[this.eraIndex],
        );

        // The player controls the reading time of the historical explanation.
        this.continueEraKey.once("down", () => this.finishEraTransition(blackout));
    });
  }

  private finishEraTransition(blackout: Phaser.GameObjects.Rectangle): void {
    // Reveal the new era only after ENTER confirms that the explanation is finished.
    this.tweens.add({
      targets: blackout,
      alpha: 0,
      duration: 600,
      onComplete: () => {
        this.eraTransitionLayer?.destroy();
        this.eraTransitionLayer = undefined;
        if (this.scene.isActive("Hud")) {
          this.scene.setVisible(true, "Hud");
        }
        this.isEraTransitioning = false;
      },
    });
  }

  private showEraHistory(
    previousEraName: string,
    eraName: string,
    history: string,
    transition: string,
  ): void {
    // The narrator belongs to the era being left, while the text introduces the era reached.
    if (!this.eraTransitionLayer) {
      return;
    }

    const narratorEraIndex = (this.eraIndex - 1 + ERAS.length) % ERAS.length;
    const narrator = this.add.image(270, 350, this.eraNarratorKeys[narratorEraIndex])
      .setDisplaySize(190, 190);

    const title = this.add.text(640, 150, `${previousEraName}  ->  ${eraName}`, {
      color: "#f4d58d",
      fontFamily: "Early_GameBoy",
      fontSize: "26px",
      align: "center",
    }).setOrigin(0.5);

    const text = this.add.text(470, 265, history, {
      color: "#ffffff",
      fontFamily: "Arial",
      fontSize: "22px",
      lineSpacing: 8,
      wordWrap: { width: 580 },
      align: "left",
    }).setOrigin(0, 0.5);

    const bridge = this.add.text(470, 410, transition, {
      color: "#d8e6f3",
      fontFamily: "Arial",
      fontSize: "18px",
      lineSpacing: 6,
      wordWrap: { width: 580 },
      align: "left",
    }).setOrigin(0, 0.5);

    const prompt = this.add.text(640, 610, "Press ENTER to continue", {
      color: "#f4d58d",
      fontFamily: "Arial",
      fontSize: "20px",
      align: "center",
    }).setOrigin(0.5);

    this.eraTransitionLayer.add([narrator, title, text, bridge, prompt]);
  }

  private playMusicForEra(eraIndex: number): void {
    // Reuse a loaded sound when possible and stop the previous era track first.
    const musicKey = this.eraMusicKeys[eraIndex % this.eraMusicKeys.length];
    if (this.eraMusic?.key === musicKey && this.eraMusic.isPlaying) {
      return;
    }

    this.eraMusic?.stop();
    this.eraMusic = this.sound.get(musicKey)
      ?? this.sound.add(musicKey, { loop: true });

    const musicEnabled = this.registry.get("musicEnabled") as boolean | undefined;
    if ("setVolume" in this.eraMusic && typeof this.eraMusic.setVolume === "function") {
      this.eraMusic.setVolume(musicEnabled === false ? 0 : 1);
    }
    this.eraMusic.play();
  }

  private spawnEraWorldObjects(eraIndex: number): void {
    // Replace all era-specific world objects instead of stacking old eras together.
    this.currentDecoration?.destroy();
    this.currentLaboratory?.destroy();
    this.currentSign?.destroy();

    // Main historical decoration: its static body blocks movement except in the future era.
    const decoration = this.add.image(800, 340, this.eraDecorationKeys[eraIndex])
      .setOrigin(0.5)
      .setScale(eraIndex === 2 ? 1 : 0.3)
      .setDepth(5);
    this.decorationGroup.add(decoration);
    const decorationBody = decoration.body as Phaser.Physics.Arcade.StaticBody;
    if (eraIndex === 4) {
      decorationBody.enable = false;
    } else {
      const width = decoration.displayWidth * 0.6;
      const height = decoration.displayHeight * 0.6;
      decorationBody.setSize(width, height);
      decorationBody.setOffset(
        (decoration.displayWidth - width) / 2,
        (decoration.displayHeight - height) / 2 + 20,
      );
    }

    // The laboratory is visual here; the L key opens the existing Laboratory scene.
    const laboratory = this.add.image(294, 207, this.eraLaboratoryKeys[eraIndex])
      .setOrigin(0.5)
      .setScale(0.22)
      .setDepth(4);
    this.currentLaboratory = laboratory;

    // The sign marks the shop area and also participates in physics collisions.
    const sign = this.add.image(565, 108, this.eraSignKeys[eraIndex])
      .setOrigin(0.5)
      .setScale(0.1)
      .setDepth(50);
    this.signGroup.add(sign);
    const signBody = sign.body as Phaser.Physics.Arcade.StaticBody;
    const signWidth = sign.displayWidth * 0.6;
    const signHeight = sign.displayHeight * 0.6;
    signBody.setSize(signWidth, signHeight);
    signBody.setOffset(
      (sign.displayWidth - signWidth) / 2,
      (sign.displayHeight - signHeight) / 2 + 20,
    );

    this.currentDecoration = decoration;
    this.currentSign = sign;
  }

  private collectProducts(): void {
    // Milk collection uses the closest sheep to preserve the current gameplay flow.
    const sheep = this.getNearestSheep();
    if (!sheep) {
      return;
    }

    const distance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      sheep.x,
      sheep.y,
    );

    if (distance > 100) {
      this.syncHud("Move closer to the sheep.");
      return;
    }

    // A sheep can provide milk and wool independently.
    const collected: string[] = [];
    if (this.productionSystem.collect(sheep.milk)) {
      this.inventorySystem.add("milk", 1);
      collected.push("milk");
    }

    this.syncHud(
      collected.length > 0
        ? `Collected: ${collected.join(" and ")}.`
        : "No product is ready.",
    );
  }

  private syncHud(message?: string): void {
    // Registry values are the shared state consumed by HUD, Store, and Laboratory.
    this.syncInventoryFromRegistry();
    this.syncEraFromRegistry();
    const era = ERAS[this.eraIndex];
    const sheep = this.getNearestSheep();
    const milkStatus = sheep?.milk.ready
      ? "ready"
      : sheep
        ? `${Math.ceil((sheep.milk.durationMs - sheep.milk.elapsedMs) / 1000)}s`
        : "none";
    const woolStatus = sheep?.wool.ready
      ? "ready"
      : sheep
        ? `${Math.ceil((sheep.wool.durationMs - sheep.wool.elapsedMs) / 1000)}s`
        : "none";

    this.registry.set("playerInventory", this.inventory);
    this.registry.set("eraIndex", this.eraIndex);
    this.registry.set("sheepCount", this.sheepGroup.countActive(true));
    this.registry.set("currency", era.currency);
    this.registry.set("currencyLabel", `${era.currencyLabel} (${era.currencySymbol})`);
    this.registry.set("productionStatus", `Milk: ${milkStatus} | Wool: ${woolStatus}`);
    if (message) {
      this.registry.set("hudMessage", message);
    }

  }

  private syncEraFromRegistry(): void {
    // Store and Laboratory may update the era while gameplay is paused.
    const savedEraIndex = this.registry.get("eraIndex");
    if (
      typeof savedEraIndex === "number" &&
      Number.isInteger(savedEraIndex) &&
      savedEraIndex >= 0 &&
      savedEraIndex < ERAS.length
    ) {
      this.eraIndex = savedEraIndex;
      this.farmBackground.setTexture(ERAS[this.eraIndex].backgroundKey);
    }
  }

  private syncInventoryFromRegistry(): void {
    // Convert legacy inventory aliases back into the current typed inventory.
    const savedInventory = this.registry.get("playerInventory");
    if (!savedInventory || typeof savedInventory !== "object") {
      return;
    }

    const legacyInventory = savedInventory as {
      latte?: unknown;
      lana?: unknown;
      formaggio?: unknown;
      coperte?: unknown;
      lvlCesoie?: unknown;
      lvlSecchi?: unknown;
    };

    if (typeof legacyInventory.latte === "number") {
      this.inventory.milk = legacyInventory.latte;
    }
    if (typeof legacyInventory.lana === "number") {
      this.inventory.wool = legacyInventory.lana;
    }
    if (typeof legacyInventory.formaggio === "number") {
      this.inventory.formaggio = legacyInventory.formaggio;
    }
    if (typeof legacyInventory.coperte === "number") {
      this.inventory.coperte = legacyInventory.coperte;
    }
    if (typeof legacyInventory.lvlCesoie === "number") {
      this.inventory.shearsLevel = legacyInventory.lvlCesoie;
    }
    if (typeof legacyInventory.lvlSecchi === "number") {
      this.inventory.milkBucketLevel = legacyInventory.lvlSecchi;
    }

    this.inventory.latte = this.inventory.milk;
    this.inventory.lana = this.inventory.wool;
    this.inventory.lvlCesoie = this.inventory.shearsLevel;
    this.inventory.lvlSecchi = this.inventory.milkBucketLevel;
  }

  private shearSheep(time: number): void {
    // Shearing is gated by cooldown, distance, tool ownership, and wool readiness.
    if (time < this.shearCooldownUntil) {
      this.syncHud("Wait before shearing again.");
      return;
    }

    const sheep = this.getNearestSheep();
    if (!sheep) {
      this.syncHud("There are no sheep left.");
      return;
    }

    const distance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      sheep.x,
      sheep.y,
    );

    if (distance > 100) {
      this.syncHud("Move closer to the sheep.");
      return;
    }

    if (this.inventory.shearsLevel <= 0) {
      this.syncHud("You need shears.");
      return;
    }

    if (!this.productionSystem.collect(sheep.wool)) {
      this.syncHud("The sheep has no wool ready.");
      return;
    }

    this.inventorySystem.add("wool", 1);
    this.shearCooldownUntil = time + GamePlay.SHEAR_COOLDOWN_MS;
    this.syncHud("Sheep sheared. Wool collected.");
  }

  private spawnSheep(x: number, y: number): void {
    // Sheep owns its physics body; this method only applies scene-specific scale and placement.
    const sheep = new Sheep(this, x, y, "sheep-legacy", 12);
    sheep.setScale(0.8);
    sheep.setBodySize(42, 28).setOffset(11, 22);
    this.sheepGroup.add(sheep);
  }

  private createLegacyAnimations(): void {
    // Recreate the frame ranges used by the original player and sheep spritesheets.
    const animations = [
      ["player-walk-right", 0, 7],
      ["player-walk-left", 8, 15],
      ["player-walk-down", 16, 23],
      ["player-walk-up", 24, 31],
      ["player-idle-down", 32, 35],
      ["player-idle-right", 36, 39],
      ["player-idle-left", 40, 43],
      ["player-idle-up", 44, 47],
    ] as const;

    for (const [key, start, end] of animations) {
      if (!this.anims.exists(key)) {
        this.anims.create({
          key,
          frames: this.anims.generateFrameNumbers("player-legacy", { start, end }),
          frameRate: key.includes("walk") ? 10 : 6,
          repeat: -1,
        });
      }
    }

    if (!this.anims.exists("sheep-down")) {
      this.anims.create({
        key: "sheep-down",
        frames: this.anims.generateFrameNumbers("sheep-legacy", { start: 12, end: 15 }),
        frameRate: 6,
        repeat: -1,
      });
    }

    if (!this.anims.exists("sheep-up")) {
      this.anims.create({
        key: "sheep-up",
        frames: this.anims.generateFrameNumbers("sheep-legacy", { frames: [2, 5, 6] }),
        frameRate: 5,
        repeat: -1,
      });
    }

    if (!this.anims.exists("sheep-side")) {
      this.anims.create({
        key: "sheep-side",
        frames: this.anims.generateFrameNumbers("sheep-legacy", { frames: [0, 1, 0, 3] }),
        frameRate: 5,
        repeat: -1,
      });
    }
  }

  private updateSheepMovement(delta: number): void {
    // Sheep choose a new direction periodically instead of changing every frame.
    this.sheepMoveTimer -= delta;
    if (this.sheepMoveTimer <= 0) {
      this.sheepGroup.getChildren()
        .filter((child): child is Sheep => child instanceof Sheep)
        .forEach((sheep) => {
          const direction = Phaser.Math.Between(1, 5);
          const speed = 50;

          if (direction === 1) sheep.setVelocity(0, -speed);
          else if (direction === 2) sheep.setVelocity(0, speed);
          else if (direction === 3) sheep.setVelocity(-speed, 0);
          else if (direction === 4) sheep.setVelocity(speed, 0);
          else sheep.setVelocity(0, 0);
        });

      // Randomize the next decision interval to make the flock feel less mechanical.
      this.sheepMoveTimer = Phaser.Math.Between(2_000, 4_000);
    }

    this.sheepGroup.getChildren()
      .filter((child): child is Sheep => child instanceof Sheep)
      .forEach((sheep) => {
        const body = sheep.body as Phaser.Physics.Arcade.Body;
        const velocity = body.velocity;
        // Collisions can add impulse after setMaxVelocity, so clamp again every frame.
        if (velocity.length() > Sheep.MAX_SPEED) {
          velocity.normalize().scale(Sheep.MAX_SPEED);
          body.setVelocity(velocity.x, velocity.y);
        }
        const { x: velocityX, y: velocityY } = body.velocity;

        if (Math.abs(velocityX) > Math.abs(velocityY) && Math.abs(velocityX) > 5) {
          sheep.anims.play("sheep-side", true);
          sheep.setFlipX(velocityX < 0);
        } else if (Math.abs(velocityY) > 5) {
          sheep.setFlipX(false);
          sheep.anims.play(velocityY > 0 ? "sheep-down" : "sheep-up", true);
        } else {
          sheep.anims.stop();
          sheep.setFrame(12);
        }
      });
  }

  private getNearestSheep(): Sheep | undefined {
    // Interaction currently targets the closest active sheep.
    const sheep = this.sheepGroup.getChildren()
      .filter((child): child is Sheep => child instanceof Sheep);

    return sheep.reduce<Sheep | undefined>((nearest, candidate) => {
      if (!nearest) {
        return candidate;
      }

      const nearestDistance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        nearest.x,
        nearest.y,
      );
      const candidateDistance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        candidate.x,
        candidate.y,
      );
      return candidateDistance < nearestDistance ? candidate : nearest;
    }, undefined);
  }

  private updateSheepProduction(delta: number): void {
    // Each sheep advances milk and wool timers independently.
    this.sheepGroup.getChildren()
      .filter((child): child is Sheep => child instanceof Sheep)
      .forEach((sheep) => {
        this.productionSystem.update(sheep.milk, delta);
        this.productionSystem.update(sheep.wool, delta);
      });
  }

  private updateDayNight(delta: number): void {
    // The short day/night cycle is intentionally tuned for development playtests.
    this.timeOfDay += delta;
    const duration = this.isNight
      ? GamePlay.NIGHT_DURATION_MS
      : GamePlay.DAY_DURATION_MS;

    if (this.timeOfDay < duration) {
      return;
    }

    this.timeOfDay = 0;
    this.isNight = !this.isNight;

    if (this.isNight) {
      // Night removes a random number of sheep and can trigger Game Over.
      this.nightOverlay.setAlpha(0.3);
      this.removeRandomSheepAtNight();
      return;
    }

    this.nightOverlay.setAlpha(0);
    this.dayNumber += 1;
    this.syncHud(`Day ${this.dayNumber} has started.`);
  }

  private removeRandomSheepAtNight(): void {
    // Cull only active sheep and never remove more than currently exist.
    const sheep = this.sheepGroup.getChildren()
      .filter((child): child is Sheep => child instanceof Sheep);
    const amount = Math.min(this.rollNightCullCount(), sheep.length);

    Phaser.Utils.Array.Shuffle(sheep);
    sheep.slice(0, amount).forEach((candidate) => candidate.destroy());

    if (amount > 0) {
      this.syncHud(`${amount} sheep disappeared during the night.`);
    }

    if (this.sheepGroup.countActive(true) === 0) {
      this.goToGameOver();
    }
  }

  private rollNightCullCount(): 0 | 1 | 2 {
    // Weighted roll: most nights remove none or one sheep.
    const roll = Phaser.Math.Between(1, 100);
    if (roll <= this.nightCullWeights.zero) {
      return 0;
    }

    if (roll <= this.nightCullWeights.zero + this.nightCullWeights.one) {
      return 1;
    }

    return 2;
  }

  private goToGameOver(): void {
    // Stop the HUD before replacing gameplay with the final Game Over scene.
    this.scene.stop("Hud");
    this.scene.start("GameOver");
  }
}
