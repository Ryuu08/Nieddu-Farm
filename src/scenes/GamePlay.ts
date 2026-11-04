import Player from "../entities/Player";
import Sheep from "../entities/Sheep";
import { createDefaultInventory, InventorySystem } from "../systems/InventorySystem";
import { ProductionSystem } from "../systems/ProductionSystem";

export default class GamePlay extends Phaser.Scene {
  private player!: Player;
  private sheep!: Sheep;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private productionSystem!: ProductionSystem;
  private inventorySystem!: InventorySystem;
  private inventory = createDefaultInventory();

  constructor() {
    super({
      key: "GamePlay",
    });
  }


  create(): void {
    this.createFarm();

    this.player = new Player(this, 320, 420, "player-test", 0);
    this.player.setScale(1.5);
    this.player.setBodySize(45, 50).setOffset(18, 12);
    this.createFarmBounds();

    this.sheep = new Sheep(this, 640, 380, "sheep-test", 0);
    this.sheep.setScale(0.8);
    this.sheep.setBodySize(42, 28).setOffset(11, 22);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.productionSystem = new ProductionSystem();
    this.inventorySystem = new InventorySystem(this.inventory);
    this.syncHud("Avvicinati alla pecora e premi E");
    this.scene.launch("Hud");
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.scene.isActive("Hud")) {
        this.scene.stop("Hud");
      }
    });
  }

  update(time: number, delta: number): void {
    this.player.move(this.cursors);
    this.productionSystem.update(this.sheep.milk, delta);
    this.productionSystem.update(this.sheep.wool, delta);
    this.syncHud();

    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      this.collectReadyProducts();
    }
  }

  private createFarm(): void {
    this.cameras.main.setBackgroundColor("#9bcf82");

    const ground = this.add.image(640, 400, "farm-test");
    ground.setDisplaySize(1120, 650);
    this.add.rectangle(640, 400, 1120, 650, 0x000000, 0)
      .setStrokeStyle(8, 0x557a45);

    const fence = this.add.rectangle(640, 400, 760, 420, 0x000000, 0);
    fence.setStrokeStyle(8, 0x76513a);

    const sign = this.add.text(640, 95, "NIEDDU FARM", {
      color: "#ffffff",
      fontFamily: "Arial",
      fontSize: "32px",
      fontStyle: "bold",
      stroke: "#31512a",
      strokeThickness: 8,
    }).setOrigin(0.5);
    sign.setDepth(2);
  }

  private createFarmBounds(): void {
    const walls = [
      this.add.rectangle(640, 190, 760, 16),
      this.add.rectangle(640, 610, 760, 16),
      this.add.rectangle(260, 400, 16, 420),
      this.add.rectangle(1020, 400, 16, 420),
    ];

    for (const wall of walls) {
      this.physics.add.existing(wall, true);
      this.physics.add.collider(this.player, wall);
    }
  }

  private syncHud(message?: string): void {
    const milkStatus = this.sheep.milk.ready
      ? "pronto"
      : `${Math.ceil((this.sheep.milk.durationMs - this.sheep.milk.elapsedMs) / 1000)}s`;
    const woolStatus = this.sheep.wool.ready
      ? "pronta"
      : `${Math.ceil((this.sheep.wool.durationMs - this.sheep.wool.elapsedMs) / 1000)}s`;

    this.registry.set("playerInventory", this.inventory);
    this.registry.set("productionStatus", `Latte: ${milkStatus} | Lana: ${woolStatus}`);
    if (message) {
      this.registry.set("hudMessage", message);
    }
  }

  private collectReadyProducts(): void {
    const distance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.sheep.x,
      this.sheep.y,
    );

    if (distance > 100) {
      this.syncHud("Sei troppo lontano dalla pecora.");
      return;
    }

    const collected: string[] = [];
    if (this.productionSystem.collect(this.sheep.milk)) {
      this.inventorySystem.add("milk", 1);
      collected.push("latte");
    }
    if (this.productionSystem.collect(this.sheep.wool)) {
      this.inventorySystem.add("wool", 1);
      collected.push("lana");
    }

    this.syncHud(
      collected.length > 0
        ? `Raccolto: ${collected.join(" e ")}.`
        : "Nessun prodotto pronto.",
    );
  }
}
