import Phaser from "phaser";
import { ProductionState } from "../types/Production";

export default class Sheep extends Phaser.Physics.Arcade.Sprite {
  public readonly milk: ProductionState = {
    resource: "milk",
    durationMs: 30_000,
    elapsedMs: 0,
    ready: false,
  };

  public readonly wool: ProductionState = {
    resource: "wool",
    durationMs: 45_000,
    elapsedMs: 0,
    ready: false,
  };

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}
