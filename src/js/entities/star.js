// src/js/entities/star.js
import { Container, Graphics } from 'pixi.js';
import { GameConfig } from '../config/game-config';

export class Star {
  constructor(game, config) {
    this.game = game;
    this.config = config;
    this.container = new Container();
    this.starSprite = null;
    this.glow = null;
    this.energy = 0;
    
    this.init();
  }
  
  init() {
    // Create star glow
    this.glow = new Graphics();
    this.glow.beginFill(this.config.color, 0.3);
    this.glow.drawCircle(0, 0, 100);
    this.glow.endFill();
    this.container.addChild(this.glow);
    
    // Create star graphic
    this.starSprite = new Graphics();
    this.starSprite.beginFill(this.config.color);
    this.starSprite.drawCircle(0, 0, 50);
    this.starSprite.endFill();
    
    // Add some detail to the star
    this.addStarDetails(this.starSprite, this.config.color);
    
    this.starSprite.scale.set(this.config.size);
    this.container.addChild(this.starSprite);
    
    // Position the star in the center of the screen
    this.container.x = window.innerWidth / 2;
    this.container.y = window.innerHeight / 2;
  }
  
  addStarDetails(star, baseColor) {
    // Add a brighter center to the star
    star.beginFill(0xffffff, 0.7);
    star.drawCircle(0, 0, 20);
    star.endFill();
    
    // Add some flares
    const numFlares = 5 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < numFlares; i++) {
      const angle = (i / numFlares) * Math.PI * 2;
      const length = 30 + Math.random() * 30;
      
      star.beginFill(baseColor, 0.6);
      star.moveTo(0, 0);
      star.lineTo(
        Math.cos(angle) * length,
        Math.sin(angle) * length
      );
      star.lineTo(
        Math.cos(angle + 0.1) * (length * 0.7),
        Math.sin(angle + 0.1) * (length * 0.7)
      );
      star.endFill();
    }
  }
  
  update(deltaTime) {
    // Make the star pulsate slightly
    const pulseFactor = 1 + Math.sin(this.game.gameTime * 0.05) * 0.05;
    this.starSprite.scale.set(this.config.size * pulseFactor);
    
    // Make the glow pulsate more dramatically
    const glowPulseFactor = 1 + Math.sin(this.game.gameTime * 0.03) * 0.2;
    this.glow.scale.set(glowPulseFactor);
  }
  
  generateResources() {
    // Different star types generate different resources
    let productionRates;
    
    switch (this.config.name) {
      case 'Protostar':
        productionRates = GameConfig.PROTOSTAR_PRODUCTION;
        break;
      case 'Red Dwarf':
        productionRates = GameConfig.RED_DWARF_PRODUCTION;
        break;
      case 'Yellow Star':
        productionRates = GameConfig.YELLOW_STAR_PRODUCTION;
        break;
      case 'Blue Giant':
        productionRates = GameConfig.BLUE_GIANT_PRODUCTION;
        break;
      default:
        productionRates = GameConfig.PROTOSTAR_PRODUCTION;
    }
    
    // Add resources based on production rates
    for (const [resourceType, amount] of Object.entries(productionRates)) {
      this.game.resources.addResource(resourceType, amount);
    }
  }
  
  evolve(newType) {
    // Get the new star configuration
    const newConfig = GameConfig.STAR_TYPES[newType];
    
    if (!newConfig) {
      console.error(`Unknown star type: ${newType}`);
      return false;
    }
    
    // Update the star's configuration
    this.config = newConfig;
    
    // Update the star's appearance
    this.container.removeChild(this.starSprite);
    
    // Create a new star graphic with the new color
    this.starSprite = new Graphics();
    this.starSprite.beginFill(this.config.color);
    this.starSprite.drawCircle(0, 0, 50);
    this.starSprite.endFill();
    
    // Add details to the new star
    this.addStarDetails(this.starSprite, this.config.color);
    
    this.starSprite.scale.set(this.config.size);
    this.container.addChild(this.starSprite);
    
    // Update the glow color
    this.container.removeChild(this.glow);
    this.glow = new Graphics();
    this.glow.beginFill(this.config.color, 0.3);
    this.glow.drawCircle(0, 0, 100);
    this.glow.endFill();
    this.container.addChildAt(this.glow, 0);
    
    return true;
  }
}