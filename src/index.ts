// Import Phaser.
import "phaser";
// Import the game scenes.
import Boot from "./scenes/Boot";
import Hud from "./scenes/Hud";
import Preloader from "./scenes/Preloader";
import GamePlay from "./scenes/GamePlay";
import GameOver from "./scenes/GameOver";
import Victory from "./scenes/Victory";
import Pause from "./scenes/Pause";
import Intro from "./scenes/Intro";
import Store from "./scenes/Store";
import Laboratory from "./scenes/Laboratory";
// Import GameData containing the global game values.
import { GameData } from "./GameData";

// Listen for the page load event.
// The event fires when the page and all its elements are available.
window.addEventListener("load", () => {


  // Create the game configuration object.
  // It is passed to the Phaser.Game constructor and contains the
  // renderer, canvas dimensions, scenes, and other settings.
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    backgroundColor: GameData.globals.bgColor,
    parent: "my-game",
    scale: {
      mode: Phaser.Scale.FIT,
      width: GameData.globals.gameWidth,
      height: GameData.globals.gameHeight,
    },

    scene: [
      Boot,
      Hud,
      Preloader,
      Intro,
      GamePlay,
      GameOver,
      Victory,
      Pause,
      Store,
      Laboratory
    ],
    physics: {
      default: "arcade",
      arcade: { debug: GameData.globals.debug, }
    },

    input: {
      activePointers: 2,
      keyboard: true,
    },
    render: {
      pixelArt: false,
      antialias: true,
    },
  };

  // Initialize the game with the configuration.
  const game = new Phaser.Game(config);

});
