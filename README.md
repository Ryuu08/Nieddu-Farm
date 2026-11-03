# Nieddu Farm

A 2D farming and pastoral game created for a game jam in Salerno, Italy.
The competition requires participants to use the Phaser engine and follow the
theme **"Evolution/Revolution."**

The game is inspired by Sardinian rural culture and traditions. It is currently
being developed as an MVP, with the goal of creating a small, playable farming
loop before adding more advanced content such as historical eras and multiple
maps.

## Technology

- [Phaser 3.90](https://phaser.io/)
- TypeScript
- Webpack
- Arcade Physics

## Getting started

### Requirements

- Node.js 12 or later
- npm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm start
```

The game will be available at `http://localhost:9000`.

### Production build

Create a production build:

```bash
npm run build
```

The generated files are placed in the `dist/` directory.

## Current MVP loop

The first playable version focuses on this core loop:

```text
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

```text
src/
├── entities/   # Player, sheep, and other world entities
├── systems/    # Production, inventory, and economy logic
├── data/       # Game content and balancing configuration
├── types/      # Shared TypeScript types and contracts
├── ui/         # Reusable interface helpers and panels
├── scenes/     # Phaser scenes and scene-specific coordination
└── assets/     # Images, maps, sounds, and fonts
```

The project is being migrated gradually from the original Phaser starter
structure. Existing scenes and `src/GameData.ts` remain in place while the new
entities and systems are introduced. This approach keeps the current Phaser
entry point working and avoids moving all gameplay logic at once.

## Development plan

The short-term goal is a 14-day MVP development cycle. The detailed daily
checklist is available in
[Piano-14-Giorni-MVP.md](./Piano-14-Giorni-MVP.md).

Features planned for a later stage include:

- additional historical eras;
- multiple farm maps;
- black sheep and other animal variants;
- cheese and blanket production;
- save data;
- offline progression;
- more advanced historical content.

## Project status

The repository currently contains the Phaser starter project and the first
organized gameplay entities, systems, data definitions, and shared types. The
main gameplay loop is still under development.
