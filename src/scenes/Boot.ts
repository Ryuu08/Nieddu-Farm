// Import a reference to GameData to use the global values.
import { GameData } from "../GameData";

// Create the Boot scene.
export default class Boot extends Phaser.Scene {


  private _text: Phaser.GameObjects.Text;
  // The constructor calls the Phaser.Scene constructor through super.

  constructor() {
    // The key identifies this scene.
    super({
      key: "Boot",
    });

  }

  // The init method is called when the scene starts.
  // No initialization is required here.
  init() {

  }
  // The preload method runs after init and loads assets needed by the next scene.
  preload() {


    // Set the scene background color.
    this.cameras.main.setBackgroundColor("#000000");
    // Preload the logo image.
    this.load.image("logo", "assets/images/phaser.png");

  }

  // The create method runs after preload.
  create() {


    // Stop the current scene.
    this.scene.stop("Boot");
    // Start the Preloader scene.
    this.scene.start("Preloader");

  }

  update(time: number, delta: number): void {

    //this._text.angle += 1;

  }




}
