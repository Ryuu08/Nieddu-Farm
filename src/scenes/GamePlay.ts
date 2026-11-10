import Player, { PlayerMovementKeys } from "../entities/Player";

export default class GamePlay extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private movementKeys!: PlayerMovementKeys;

  constructor() {
    super({
      key: "GamePlay",
    });
  }

  create(): void {
    this.player = new Player(this, 320, 420, "player-test", 0);
    this.player.setScale(1.5);
    this.player.setBodySize(45, 50).setOffset(18, 12);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.movementKeys = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    this.scene.launch("Hud");
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.scene.isActive("Hud")) {
        this.scene.stop("Hud");
      }
    });
  }

  update(): void {
    this.player.move(this.cursors, this.movementKeys);
  }
}
