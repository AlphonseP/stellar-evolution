// src/js/config/game-config.js
export const GameConfig = {
  // Thresholds
  PROTOSTAR_THRESHOLD: 50,
  RED_DWARF_THRESHOLD: 200,
  YELLOW_STAR_THRESHOLD: 500,
  BLUE_GIANT_THRESHOLD: 1000,
  
  // Production rates
  PROTOSTAR_PRODUCTION: {
    hydrogen: 0.5
  },
  RED_DWARF_PRODUCTION: {
    hydrogen: 1,
    helium: 0.2
  },
  YELLOW_STAR_PRODUCTION: {
    hydrogen: 2,
    helium: 0.5,
    carbon: 0.1
  },
  BLUE_GIANT_PRODUCTION: {
    hydrogen: 5,
    helium: 2,
    carbon: 0.5,
    oxygen: 0.2,
    silicon: 0.1
  },
  
  // Star properties
  STAR_TYPES: {
    protostar: {
      name: 'Protostar',
      color: 0xff9966, // Orange-ish
      size: 0.8
    },
    redDwarf: {
      name: 'Red Dwarf',
      color: 0xff6666, // Red
      size: 1.0
    },
    yellowStar: {
      name: 'Yellow Star',
      color: 0xffff66, // Yellow
      size: 1.2
    },
    blueGiant: {
      name: 'Blue Giant',
      color: 0x6699ff, // Blue
      size: 1.5
    }
  }
};