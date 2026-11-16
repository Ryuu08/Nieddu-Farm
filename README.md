# Nieddu Farm

A 2D farming and pastoral game created for a game jam in Salerno, Italy.  
The competition requires participants to use the Phaser engine and follow the theme **"Evolution/Revolution."**

The game is inspired by Sardinian rural culture and traditions. It is currently being developed as an MVP, with the goal of creating a small, playable farming loop before adding more advanced content such as historical eras and multiple maps.

## Technology

- [Phaser 3.90](https://phaser.io/)
    
- TypeScript
    
- Webpack
    
- Arcade Physics
    

## Getting started

### Requirements

The only requirement is **Node.js**, which includes npm.

No additional software or global packages are required.

### Installing Node.js

Download and install the LTS version of Node.js from:

[https://nodejs.org/](https://nodejs.org/)

**Windows**

1. Open the official Node.js website.
    
2. Download the Windows Installer (`.msi`) for the LTS version.
    
3. Run the installer and follow the installation steps.
    
4. Make sure the option to install npm is enabled (included by default).
    
5. Restart your terminal.
    

**macOS**

1. Open the official Node.js website.
    
2. Download the macOS Installer (`.pkg`) for the LTS version.
    
3. Run the installer and follow the installation steps.
    
4. Restart your terminal.
    

### Verify installation

Open a terminal (PowerShell or Command Prompt on Windows, Terminal on macOS) and run:

```
node -v
npm -v
```

If both commands return a version number, Node.js and npm are correctly installed.

### Installation

Clone or download the repository, then open a terminal inside the project folder (the directory containing `package.json`).

Install the project dependencies:

```
npm install
```

### Development

To start the development server:

```
npm start
```

The game will be available at:

[http://localhost:9000](http://localhost:9000)

Open this address in your browser to play.

### Production build

To generate the production build:

```
npm run build
```

The generated files are placed in the `dist/` directory.

To play the production version, open the generated `index.html` using a local web server. Alternatively, deploy the contents of `dist/` to a static web hosting service.

## Current MVP loop

The first playable version focuses on this core loop:

```
Move around the farm
→ interact with a sheep
→ wait for milk and wool production
→ collect the products
→ check the inventory
→ sell the products
→ earn coins
→ purchase an upgrade
→ verify that the upgrade changes the gameplay
```

## Project structure

The gameplay code is organized by responsibility:

```
src/
├── entities/   # Player, sheep, and other world entities
├── systems/    # Production, inventory, and economy logic
├── data/       # Game content and balancing configuration
├── types/      # Shared TypeScript types and contracts
├── ui/         # Reusable interface helpers and panels
├── scenes/     # Phaser scenes and scene-specific coordination
└── assets/     # Images, maps, sounds, and fonts
```

The project is being migrated gradually from the original Phaser starter structure. Existing scenes and `src/GameData.ts` remain in place while the new entities and systems are introduced. This approach keeps the current Phaser entry point working and avoids moving all gameplay logic at once.

Features planned for a later stage include:

- Additional historical eras;
    
- Multiple farm maps;
    
- Black sheep and other animal variants;
    
- Cheese and blanket production;
    
- Save data;
    
- Offline progression;
    
- More advanced historical content.
    

## Project status

The repository currently contains the Phaser starter project and the first organized gameplay entities, systems, data definitions, and shared types. The main gameplay loop is still under development.

## Temporary test assets

The `src/assets/test-assets/` directory contains a small set of assets copied from the previous prototype. They are used only to test the current gameplay structure and are not the final art direction. They will be replaced with original project assets later.

The music and sound files are registered in `src/GameData.ts` and can be controlled through `src/AudioManager.ts`. They are part of the current project audio setup; the temporary label applies only to the copied visual assets.