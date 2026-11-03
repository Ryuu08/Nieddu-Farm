import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private readonly speed = 200;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
  }

  public move(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    if (cursors.left.isDown) {
      body.setVelocityX(-this.speed);
    } else if (cursors.right.isDown) {
      body.setVelocityX(this.speed);
    }

    if (cursors.up.isDown) {
      body.setVelocityY(-this.speed);
    } else if (cursors.down.isDown) {
      body.setVelocityY(this.speed);
    }

    body.velocity.normalize().scale(this.speed);
  }
}
