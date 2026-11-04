export let GameData: gameData = {
  globals: {
    gameWidth: 1280,
    gameHeight: 800,
    bgColor: "#ffffff",
    debug: false
  },

  preloader: {
    bgColor: "ffffff",
    image: "logo",
    imageX: 1280 / 2,
    imageY: 800 / 2,
    loadingText: "Caricamento...",
    loadingTextFont: "roboto",
    loadingTextComplete: "Tappa/clicca per iniziare!!",
    loadingTextY: 700,
    loadingBarColor: 0xff0000,
    loadingBarY: 630,
  },

  spritesheets: [
    // Temporary assets copied from the old prototype for gameplay testing.
    { name: "player-test", path: "assets/test-assets/characters/player-old.png", width: 30, height: 48, frames: 48 },
    { name: "sheep-test", path: "assets/test-assets/animals/sheep-old.png", width: 64, height: 64, frames: 16 },
  ],
  images: [
    // Temporary assets copied from the old prototype for gameplay testing.
    { name: "phaser", path: "assets/images/logo-phaser.png" },
    { name: "freedoom", path: "assets/images/freedoom.png" },
    { name: "thelucasart", path: "assets/images/thelucasart.png" },
    { name: "intro-bg", path: "assets/images/intro-bg.jpg" },
    { name: "bg-1", path: "assets/images/bg/1.png" },
    { name: "bg-2", path: "assets/images/bg/2.png" },
    { name: "bg-3", path: "assets/images/bg/3.png" },
    { name: "bg-4", path: "assets/images/bg/4.png" },
    { name: "bg-5", path: "assets/images/bg/5.png" },
    { name: "bg-6", path: "assets/images/bg/6.png" },
    { name: "bg-7", path: "assets/images/bg/7.png" },
    { name: "farm-test", path: "assets/test-assets/backgrounds/farm-old.png" },
    { name: "bucket-test", path: "assets/test-assets/tools/bucket-old.png" },
    { name: "shears-test", path: "assets/test-assets/tools/shears-old.png" },
    { name: "nuraghe-test", path: "assets/test-assets/decorations/nuraghe-old.png" },
    { name: "bg_mainmenu", path: "assets/test-assets/intro/background-old.png" },
    { name: "intro-logo-test", path: "assets/test-assets/intro/logo-old.png" },
  ],
  atlas: [],
  sounds: [
    { name: "intro_music", paths: ["assets/audio/intro.mp3"] },
    { name: "farm_music", paths: ["assets/audio/farm-music.mp3"] },
    { name: "farm_music_2", paths: ["assets/audio/farm-music-2.mp3"] },
    { name: "farm_music_3", paths: ["assets/audio/farm-music-3.mp3"] },
    { name: "store", paths: ["assets/audio/store.mp3"] },
  ],

  videos: [

    // { name: "video", path: "/assets/video/video.mp4" },

  ],
  audios: [

    /*{
    name: "sfx",
    jsonpath: "assets/sounds/sfx.json",
    paths: ["assets/sounds/sfx.ogg", "assets/sounds/sfx.m4a"],
    instances: 10,
  }*/
  ],

  scripts: [],
  fonts: [
    {key:"ralewayRegular", path:"assets/fonts/raleway.regular.ttf",type:"truetype"},
    {key:"Early_GameBoy", path:"assets/test-assets/fonts/Early_GameBoy.ttf",type:"truetype"},
  ],
  webfonts: [{ key: 'Nosifer' }, { key: 'Roboto' }, { key: 'Press+Start+2P' }, { key: 'Rubik+Doodle+Shadow' }, { key: 'Rubik+Glitch' }],
  bitmapfonts: [],
  audioSettings: {
    music: [
      { name: "intro_music", volume: 1 },
      { name: "farm_music", volume: 1 },
      { name: "farm_music_2", volume: 1 },
      { name: "farm_music_3", volume: 1 },
    ],
    sfx: [
      { name: "store", volume: 1 },
    ],
    voices: [],
  },
};
