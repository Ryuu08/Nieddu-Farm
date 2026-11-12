import Player, { PlayerMovementKeys } from "../entities/Player";
import Sheep from "../entities/Sheep";
import { ERAS } from "../data/EraData";
import { createDefaultInventory, InventorySystem } from "../systems/InventorySystem";
import { ProductionSystem } from "../systems/ProductionSystem";

export default class GamePlay extends Phaser.Scene {
  private player!: Player;
  private sheepGroup!: Phaser.Physics.Arcade.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private movementKeys!: PlayerMovementKeys;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private shearKey!: Phaser.Input.Keyboard.Key;
  private storeKey!: Phaser.Input.Keyboard.Key;
  private laboratoryKey!: Phaser.Input.Keyboard.Key;
  private eraKey!: Phaser.Input.Keyboard.Key;
  private escapeKey!: Phaser.Input.Keyboard.Key;
  private eraIndex = 0;
  private farmBackground!: Phaser.GameObjects.Image;
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

  create(): void {
    this.shearCooldownUntil = 0;
    this.createTemporaryFarm();

    this.player = new Player(this, 320, 420, "player-test", 0);
    this.player.setScale(1.5);
    this.player.setBodySize(45, 50).setOffset(18, 12);

    this.sheepGroup = this.physics.add.group();
    this.spawnSheep(560, 360);
    this.spawnSheep(640, 380);
    this.spawnSheep(720, 420);
    this.spawnSheep(680, 320);

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
    this.escapeKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.escapeKey.on("down", () => this.openPauseMenu());
    this.inventorySystem = new InventorySystem(this.inventory);

    this.syncHud("Move with WASD or arrows. Press E/F near a sheep. Press T to change era.");
    this.scene.launch("Hud");
    this.scene.bringToTop("Hud");
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.scene.isActive("Hud")) {
        this.scene.stop("Hud");
      }
    });
  }

  private openPauseMenu(): void {
    if (this.scene.isActive("Pause")) {
      return;
    }

    this.scene.pause("GamePlay");
    this.scene.launch("Pause");
    this.scene.bringToTop("Pause");
  }

  update(time: number, delta: number): void {
    // TODO: Replace this temporary movement bridge with the final player controller.
    this.player.move(this.cursors, this.movementKeys);
    this.updateSheepProduction(delta);
    this.updateDayNight(delta);

    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      this.collectProducts();
    }

    if (Phaser.Input.Keyboard.JustDown(this.shearKey)) {
      this.shearSheep(time);
    }

    if (Phaser.Input.Keyboard.JustDown(this.eraKey)) {
      this.changeEra();
    }

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
    // TODO: Replace this placeholder world with the final Unity-authored map.
    this.cameras.main.setBackgroundColor("#9bcf82");
    this.farmBackground = this.add.image(640, 400, ERAS[0].backgroundKey)
      .setDisplaySize(1120, 650)
      .setTint(0xb4d895);
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
    this.eraIndex = (this.eraIndex + 1) % ERAS.length;
    const era = ERAS[this.eraIndex];
    this.farmBackground.setTexture(era.backgroundKey);
    this.registry.set("eraIndex", this.eraIndex);
    this.syncHud(`Era changed: ${era.name}.`);
  }

  private collectProducts(): void {
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
    const sheep = new Sheep(this, x, y, "sheep-test", 0);
    sheep.setScale(0.8);
    sheep.setBodySize(42, 28).setOffset(11, 22);
    this.sheepGroup.add(sheep);
  }

  private getNearestSheep(): Sheep | undefined {
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
    this.sheepGroup.getChildren()
      .filter((child): child is Sheep => child instanceof Sheep)
      .forEach((sheep) => {
        this.productionSystem.update(sheep.milk, delta);
        this.productionSystem.update(sheep.wool, delta);
      });
  }

  private updateDayNight(delta: number): void {
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
      this.cameras.main.setBackgroundColor("#3d466b");
      this.removeRandomSheepAtNight();
      return;
    }

    this.cameras.main.setBackgroundColor("#9bcf82");
    this.dayNumber += 1;
    this.syncHud(`Day ${this.dayNumber} has started.`);
  }

  private removeRandomSheepAtNight(): void {
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
    this.scene.stop("Hud");
    this.scene.start("GameOver");
  }
}
