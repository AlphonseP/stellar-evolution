// src/js/managers/upgrade-manager.js
import { GameConfig } from '../config/game-config';

export class UpgradeManager {
  constructor(resourceManager) {
    this.resourceManager = resourceManager;
    
    this.upgrades = {
      fusion: {
        id: 'fusion',
        name: 'Hydrogen Fusion',
        description: 'Begin fusing hydrogen into helium',
        cost: { hydrogen: 10 },
        unlocked: false,
        purchased: false,
        effect: () => {
          this.resourceManager.unlockResource('helium');
          this.resourceManager.updatePerSecond('helium', 0.1);
        }
      },
      coreCompression: {
        id: 'coreCompression',
        name: 'Core Compression',
        description: 'Increase star core density for more efficient fusion',
        cost: { hydrogen: 50, helium: 20 },
        unlocked: false,
        purchased: false,
        effect: () => {
          // Double helium production
          const current = this.resourceManager.getResource('helium').perSecond;
          this.resourceManager.updatePerSecond('helium', current * 2);
        }
      },
      carbonCycle: {
        id: 'carbonCycle',
        name: 'Carbon-Nitrogen-Oxygen Cycle',
        description: 'Begin producing heavier elements',
        cost: { hydrogen: 100, helium: 50 },
        unlocked: false,
        purchased: false,
        effect: () => {
          this.resourceManager.unlockResource('carbon');
          this.resourceManager.unlockResource('oxygen');
          this.resourceManager.updatePerSecond('carbon', 0.05);
          this.resourceManager.updatePerSecond('oxygen', 0.05);
        }
      }
    };
  }
  
  getUpgrade(id) {
    return this.upgrades[id];
  }
  
  getAllUpgrades() {
    return Object.values(this.upgrades).filter(upgrade => upgrade.unlocked);
  }
  
  unlockUpgrade(id) {
    if (this.upgrades[id]) {
      this.upgrades[id].unlocked = true;
      return true;
    }
    return false;
  }
  
  purchaseUpgrade(id) {
    const upgrade = this.upgrades[id];
    
    if (!upgrade || upgrade.purchased || !upgrade.unlocked) {
      return false;
    }
    
    // Check if player has enough resources
    for (const [resourceType, amount] of Object.entries(upgrade.cost)) {
      if (!this.resourceManager.hasResource(resourceType, amount)) {
        return false;
      }
    }
    
    // Deduct resources
    for (const [resourceType, amount] of Object.entries(upgrade.cost)) {
      this.resourceManager.useResource(resourceType, amount);
    }
    
    // Mark as purchased and apply effect
    upgrade.purchased = true;
    upgrade.effect();
    
    return true;
  }
}