import Phaser from "phaser";

export interface PlayerMovementKeys {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private readonly speed = 200;

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

    if (leftPressed) {
      body.setVelocityX(-this.speed);
    } else if (rightPressed) {
      body.setVelocityX(this.speed);
    }

    if (upPressed) {
      body.setVelocityY(-this.speed);
    } else if (downPressed) {
      body.setVelocityY(this.speed);
    }

    if (body.velocity.length() > 0) {
      body.velocity.normalize().scale(this.speed);
    }
  }
}
