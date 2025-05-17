# Stellar Evolution: Cosmic Clicker

## Project Overview
Stellar Evolution is a browser-based incremental/clicker game where players start with a small cloud of cosmic dust and evolve it into stars, solar systems, galaxies, and eventually reshape the universe through clicking and strategic resource management.

## Core Concept
Players begin by clicking to condense cosmic dust into a protostar. As the star evolves, it generates different elements through nuclear fusion (passive income). These elements can be spent to upgrade the star or create planets. The game features multiple progression layers from stellar to universal scale.

## Game Structure

### Files Organization
- **index.html**: Main HTML structure
- **css/style.css**: Game styling
- **js/main.js**: Entry point that initializes the game
- **js/game.js**: Core game controller handling the game loop, rendering, and event handling
- **js/resources.js**: Resource management system
- **js/evolution.js**: Handles different celestial evolution states and their visual representation

### Core Mechanics
1. **Clicking Mechanism**: Players click on celestial objects to generate resources
2. **Resource Generation**: Both active (clicking) and passive generation of elements
3. **Evolution System**: Progression through different celestial states (cosmic dust → protostar → etc.)
4. **Visual Feedback**: Beautiful animations for clicks, evolution, and celestial objects
5. **Save/Load System**: Game state persistence using localStorage

## Current Implementation Status
The game currently implements:
- Basic game loop and rendering system
- Background star field with twinkling effect
- Resource system with hydrogen and helium
- Evolution from cosmic dust to protostar
- Click animations and evolution notifications
- Save/load functionality

## Development Roadmap

### Phase 1: Core Mechanics Foundation ✓
- [x] Basic clicking mechanic with initial dust cloud visual
- [x] Simple resource generation (basic elements)
- [x] First evolution stage: protostar formation
- [x] UI framework with resource counters
- [x] Save/load functionality

### Phase 2: Star Evolution System
- [x] Star evolution paths (red dwarf, yellow star, blue giant)
- [x] Passive resource generation based on star type
- [x] Visual feedback for star evolution stages
- [x] Basic upgrade system for stars
- [ ] First death cycle (supernova/black hole) with resource boost

### Phase 3-8
*See roadmap.txt for detailed future phases*

## Key Game Mechanics to Implement
1. **Cosmic Harmony**: A rhythm-based clicking system where clicking in harmony with cosmic bodies generates resonance
2. **Multiple Resource Types**: Different elements generated through stellar fusion
3. **Upgrade Paths**: Various ways to evolve celestial bodies
4. **Prestige System**: "Big Crunch" mechanism for restarting with permanent bonuses
5. **Collections**: Discoverable cosmic phenomena to catalog

## Technical Architecture

### Game Loop
The game uses requestAnimationFrame for smooth animation:
1. **Update**: Update resource generation, check for evolution, update animations
2. **Render**: Draw background, celestial objects, and animations

### State Management
- Game state is stored across multiple modules
- Save/load functionality using localStorage

### Event Handling
- Click events on canvas for resource generation
- UI button interactions

## Getting Started

1. Clone the repository
2. Open index.html in a browser
3. Click on the cosmic dust to start generating hydrogen
4. Once you reach 50 hydrogen, you'll evolve to a protostar

## Future Improvements and Considerations
- Optimize performance for complex animations
- Add mobile support with touch events
- Implement proper resource balancing
- Add more engaging visual feedback
- Create tutorials and help system