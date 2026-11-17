import Phaser from "phaser";

export interface PlayerMovementKeys {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private readonly speed = 200;
  private lastDirection: "up" | "down" | "left" | "right" = "down";

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
  }

  public move(
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    movementKeys?: PlayerMovementKeys,
  ): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    const leftPressed = cursors.left.isDown || movementKeys?.left.isDown === true;
    const rightPressed = cursors.right.isDown || movementKeys?.right.isDown === true;
    const upPressed = cursors.up.isDown || movementKeys?.up.isDown === true;
    const downPressed = cursors.down.isDown || movementKeys?.down.isDown === true;

    let velocityX = 0;
    let velocityY = 0;
    if (leftPressed) velocityX -= 1;
    if (rightPressed) velocityX += 1;
    if (upPressed) velocityY -= 1;
    if (downPressed) velocityY += 1;

    if (velocityX !== 0 || velocityY !== 0) {
      const length = Math.hypot(velocityX, velocityY);
      body.setVelocity(
        (velocityX / length) * this.speed,
        (velocityY / length) * this.speed,
      );

      if (Math.abs(body.velocity.x) >= Math.abs(body.velocity.y)) {
        this.lastDirection = body.velocity.x > 0 ? "right" : "left";
      } else {
        this.lastDirection = body.velocity.y > 0 ? "down" : "up";
      }
    }

    if (body.velocity.length() > 0) {
      this.anims.play(`player-walk-${this.lastDirection}`, true);
    } else {
      this.anims.play(`player-idle-${this.lastDirection}`, true);
    }
  }
}
