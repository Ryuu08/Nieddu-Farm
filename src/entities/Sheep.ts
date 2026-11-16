import Phaser from "phaser";
import { ProductionState } from "../types/Production";

export default class Sheep extends Phaser.Physics.Arcade.Sprite {
  public static readonly MAX_SPEED = 50;
  public readonly milk: ProductionState = {
    resource: "milk",
    durationMs: 3_000,
    elapsedMs: 3_000,
    ready: true,
  };

  public readonly wool: ProductionState = {
    resource: "wool",
    durationMs: 3_000,
    elapsedMs: 3_000,
    ready: true,
  };

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
    this.setCircle(20, 10, 10);
    this.setDrag(40);
    this.setCollideWorldBounds(true);
    this.setBounce(0.5, 0.5);
    this.setMaxVelocity(Sheep.MAX_SPEED, Sheep.MAX_SPEED);
    this.anims.play("sheep-down", true);
  }
}
