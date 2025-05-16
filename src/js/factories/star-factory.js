// src/js/factories/star-factory.js
import { GameConfig } from '../config/game-config';
import { Star } from '../entities/star';

export class StarFactory {
  static createStar(type, game) {
    const starConfig = GameConfig.STAR_TYPES[type];
    
    if (!starConfig) {
      console.error(`Unknown star type: ${type}`);
      return null;
    }
    
    return new Star(game, starConfig);
  }
}