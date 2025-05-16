// src/js/ui/user-interface.js
export class UserInterface {
  constructor(game) {
    this.game = game;
    this.resourcesElement = document.getElementById('resources');
    this.upgradesElement = document.getElementById('upgrades');
    
    this.init();
  }
  
  init() {
    // Initial UI rendering
    this.update();
    
    // Set up click handler for upgrades
    this.upgradesElement.addEventListener('click', (event) => {
      if (event.target.classList.contains('upgrade-button')) {
        const upgradeId = event.target.dataset.upgradeId;
        this.purchaseUpgrade(upgradeId);
      }
    });
  }
  
  update() {
    this.updateResources();
    this.updateUpgrades();
  }
  
  updateResources() {
    const resources = this.game.resources.getAllResources();
    
    if (resources.length === 0) {
    this.resourcesElement.innerHTML = '<p>⚡ Click on the glowing cosmic dust in the center of the screen! ⚡</p>';
          return;
    }
    
    let html = '<h3>Resources</h3>';
    
    for (const resource of resources) {
      html += `
        <div class="resource">
          <span class="resource-name">${resource.name}:</span>
          <span class="resource-amount">${resource.amount.toFixed(1)}</span>
          <span class="resource-per-second">(+${resource.perSecond.toFixed(1)}/s)</span>
        </div>
      `;
    }
    
    this.resourcesElement.innerHTML = html;
  }
  
  updateUpgrades() {
    const upgrades = this.game.upgrades.getAllUpgrades();
    
    if (upgrades.length === 0) {
      this.upgradesElement.innerHTML = '';
      return;
    }
    
    let html = '<h3>Upgrades</h3>';
    
    for (const upgrade of upgrades) {
      if (upgrade.purchased) continue;
      
      let canAfford = true;
      let costText = '';
      
      for (const [resourceType, amount] of Object.entries(upgrade.cost)) {
        const resource = this.game.resources.getResource(resourceType);
        
        if (!resource.unlocked || resource.amount < amount) {
          canAfford = false;
        }
        
        costText += `${amount} ${resource.name}, `;
      }
      
      // Remove trailing comma and space
      costText = costText.slice(0, -2);
      
      html += `
        <div class="upgrade ${canAfford ? 'can-afford' : 'cannot-afford'}">
          <h4>${upgrade.name}</h4>
          <p>${upgrade.description}</p>
          <p>Cost: ${costText}</p>
          <button 
            class="upgrade-button" 
            data-upgrade-id="${upgrade.id}"
            ${canAfford ? '' : 'disabled'}
          >
            Purchase
          </button>
        </div>
      `;
    }
    
    this.upgradesElement.innerHTML = html;
  }
  
  purchaseUpgrade(upgradeId) {
    const success = this.game.upgrades.purchaseUpgrade(upgradeId);
    
    if (success) {
      this.showNotification(`Upgrade purchased: ${this.game.upgrades.getUpgrade(upgradeId).name}`);
      this.update();
    }
  }
  
  showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      
      // Remove from DOM after animation completes
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  }
}