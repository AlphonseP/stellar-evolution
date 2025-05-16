// src/js/managers/resource-manager.js
import { GameConfig } from '../config/game-config';

export class ResourceManager {
  constructor() {
    this.resources = {
      hydrogen: {
        amount: 0,
        unlocked: false,
        perSecond: 0,
        name: 'Hydrogen',
        description: 'The most basic element in the universe'
      },
      helium: {
        amount: 0,
        unlocked: false,
        perSecond: 0,
        name: 'Helium',
        description: 'Formed through hydrogen fusion'
      },
      carbon: {
        amount: 0,
        unlocked: false,
        perSecond: 0,
        name: 'Carbon',
        description: 'Essential element for life'
      },
      oxygen: {
        amount: 0,
        unlocked: false,
        perSecond: 0,
        name: 'Oxygen',
        description: 'Created in larger stars'
      },
      silicon: {
        amount: 0,
        unlocked: false,
        perSecond: 0,
        name: 'Silicon',
        description: 'Forms the basis of rocky planets'
      },
      iron: {
        amount: 0,
        unlocked: false,
        perSecond: 0,
        name: 'Iron',
        description: 'Created in supernova events'
      }
    };
  }
  
  getResource(type) {
    return this.resources[type];
  }
  
  getAllResources() {
    return Object.entries(this.resources)
      .filter(([_, resource]) => resource.unlocked)
      .map(([id, resource]) => ({
        id,
        ...resource
      }));
  }
  
  addResource(type, amount) {
    if (this.resources[type] && this.resources[type].unlocked) {
      this.resources[type].amount += amount;
      return true;
    }
    return false;
  }
  
  useResource(type, amount) {
    if (this.resources[type] && this.resources[type].unlocked && this.resources[type].amount >= amount) {
      this.resources[type].amount -= amount;
      return true;
    }
    return false;
  }
  
  hasResource(type, amount) {
    return this.resources[type] && this.resources[type].unlocked && this.resources[type].amount >= amount;
  }
  
  unlockResource(type) {
    if (this.resources[type]) {
      this.resources[type].unlocked = true;
      return true;
    }
    return false;
  }
  
  updatePerSecond(type, amount) {
    if (this.resources[type]) {
      this.resources[type].perSecond = amount;
      return true;
    }
    return false;
  }
}