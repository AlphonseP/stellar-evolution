# Stellar Evolution: Specialization Paths Implementation Plan

## Three Core Specialization Paths

### 1. Fusion Specialist
**Core Concept**: Mastering the natural processes of stellar fusion for maximum efficiency.

**Gameplay Style**: 
- More idle/passive-oriented gameplay
- Rewards patience and strategic planning
- "Set it and forget it" approach

**Key Mechanics**:
- Enhanced passive resource generation rates (2-3x normal)
- Resource production continues at higher rates when inactive
- Unlocks "Fusion Cycles" - periodic automated resource bursts
- Lower click rewards but exceptional passive generation

**Thematic Upgrades**:
- "Core Optimization" - Reorganizes the star's core for 2x passive generation
- "Thermal Equilibrium" - Balances energy output for steady helium production
- "Nucleosynthesis Mastery" - Unlocks periodic resource pulses without input
- "Pressure Dynamics" - Higher density enables more efficient fusion processes

### 2. Stellar Engineer
**Core Concept**: Manipulating stellar matter through active intervention.

**Gameplay Style**:
- Active, engagement-focused gameplay
- Rewards interaction and timing
- Perfect for players who enjoy being hands-on

**Key Mechanics**:
- Enhanced click rewards (3-5x normal)
- Click combo system - consecutive clicks build multipliers
- Click pattern recognition - special patterns trigger bonuses
- Lower passive generation but exceptional active rewards

**Thematic Upgrades**:
- "Matter Compression" - Focused energy creates bigger rewards per click
- "Resonance Chain" - Each click within 1 second of previous adds to combo multiplier
- "Stellar Rhythm" - Clicking in specific patterns generates resource bursts
- "Catalytic Fusion" - Brief window after clicking where passive generation doubles

### 3. Cosmic Manipulator
**Core Concept**: Harnessing exotic stellar phenomena and cosmic forces.

**Gameplay Style**:
- Strategic gameplay with special abilities
- Balanced between active and passive play
- Focuses on timing of ability usage

**Key Mechanics**:
- Special activated abilities with cooldowns
- Resource conversion between hydrogen and helium
- Unique visual effects and star appearance
- Balanced passive and active generation with powerful temporary boosts

**Thematic Upgrades**:
- "Stellar Flare" - Trigger a massive resource burst (2-minute cooldown)
- "Cosmic Alignment" - Double all production for 30 seconds (5-minute cooldown)
- "Matter Transmutation" - Convert hydrogen to helium at favorable ratios
- "Gravity Well" - Collect ambient resources from nearby space (click activated)

## Implementation Tasks

### Phase 1: Core System Setup
- [ ] Create specialization object structure in a new file (specialization.js)
- [ ] Add specialization property to game state
- [ ] Implement specialization selection UI when evolving to Protostar
- [ ] Update save/load to remember specialization choice

### Phase 2: Base Mechanics
- [ ] Implement base passive/active modifiers for each path
- [ ] Create visual indicators for current specialization
- [ ] Add specialization-specific UI elements
- [ ] Update resource generation to consider specialization

### Phase 3: Special Abilities
- [ ] Implement Fusion Specialist's cycle system
- [ ] Create Stellar Engineer's combo system
- [ ] Add Cosmic Manipulator's cooldown abilities
- [ ] Design and implement UI for abilities

### Phase 4: Upgrade System Integration
- [ ] Create specialization-specific upgrade trees
- [ ] Implement unique upgrades for each path
- [ ] Ensure upgrades are balanced across specializations
- [ ] Integrate with existing upgrade system

### Phase 5: Visual Differentiation
- [ ] Update star rendering to reflect specialization
- [ ] Add special effects for abilities
- [ ] Create unique animation for each path
- [ ] Implement sound effects (if applicable)

### Phase 6: Integration with Star Evolution
- [ ] Enhance specialization benefits based on star type
- [ ] Create synergies between star types and specializations
- [ ] Balance progression across all evolution stages
- [ ] Create meaningful choices throughout gameplay

## Design Considerations
- Ensure each path feels viable and fun
- Balance passive vs active gameplay
- Create meaningful decision points
- Make specializations visually distinct
- Allow for future expansion of the system 