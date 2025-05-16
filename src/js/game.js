// src/js/game.js
import '../css/main.css';
import { Application, Graphics, Text, TextStyle, Container } from 'pixi.js';

class StellarEvolution {
  constructor() {
    this.app = null;
    
    // Game state
    this.energy = 0;
    this.maxEnergy = 10;
    this.gameState = 'dust';
    
    // Resources
    this.resources = {
      hydrogen: 0,
      helium: 0,
      carbon: 0
    };
    
    // Production rates
    this.production = {
      hydrogen: 0,
      helium: 0,
      carbon: 0
    };
    
    // Upgrade costs and status
    this.upgrades = {
      hydrogenFusion: { 
        purchased: false, 
        cost: { hydrogen: 10 },
        name: "Hydrogen Fusion",
        description: "Doubles hydrogen production"
      },
      heliumSynthesis: { 
        purchased: false, 
        cost: { hydrogen: 30, helium: 5 },
        name: "Helium Synthesis",
        description: "Doubles helium production"
      },
      carbonFormation: { 
        purchased: false, 
        cost: { hydrogen: 50, helium: 20 },
        name: "Carbon Formation",
        description: "Begin producing carbon"
      }
    };
    
    // Time tracking
    this.ticks = 0;
  }

  async init() {
    console.log('Initializing Stellar Evolution game...');
    
    // Create PIXI Application
    this.app = new Application();
    await this.app.init({
      backgroundColor: 0x000033,
      width: window.innerWidth,
      height: window.innerHeight
    });
    
    // Add the canvas to the page
    document.getElementById('game-canvas').appendChild(this.app.canvas);
    
    // Store center coordinates
    this.centerX = window.innerWidth / 2;
    this.centerY = window.innerHeight / 2;
    
    // Create game elements
    this.createTitle();
    this.createDust();
    this.createEnergyBar();
    this.createInstructions();
    
    // Add click handler
    this.app.canvas.addEventListener('click', this.handleClick.bind(this));
    
    // Start game loop
    this.app.ticker.add(() => this.update());
    
    console.log('Game initialized successfully!');
  }
  
  createTitle() {
    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      fontWeight: 'bold',
      fill: 0xFFFFFF,
      stroke: 0x000000,
      strokeThickness: 4
    });
    
    const title = new Text({
      text: 'STELLAR EVOLUTION',
      style: style
    });
    
    title.anchor.set(0.5, 0);
    title.x = this.centerX;
    title.y = 20;
    
    this.app.stage.addChild(title);
  }
  
  createDust() {
    // Create cosmic dust
    this.dust = new Graphics();
    this.dust.beginFill(0x3366CC, 0.7);
    this.dust.lineStyle(5, 0xFFFFFF);
    this.dust.drawCircle(this.centerX, this.centerY, 100);
    this.dust.endFill();
    
    // Set pivot point for rotation and scaling
    this.dust.pivot.x = this.centerX;
    this.dust.pivot.y = this.centerY;
    
    this.app.stage.addChild(this.dust);
    
    // Create text
    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 24,
      fontWeight: 'bold',
      fill: 0xFFFFFF,
      stroke: 0x000000,
      strokeThickness: 3
    });
    
    this.dustText = new Text({
      text: 'CLICK ME!',
      style: style
    });
    
    this.dustText.anchor.set(0.5);
    this.dustText.x = this.centerX;
    this.dustText.y = this.centerY;
    
    this.app.stage.addChild(this.dustText);
    
    // Create some particles for visual interest
    this.particles = [];
    for (let i = 0; i < 30; i++) {
      const particle = new Graphics();
      
      // Random color
      const colors = [0x6699FF, 0xFFFF99, 0xFF9999];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      particle.beginFill(color, 0.7);
      particle.drawCircle(0, 0, 2 + Math.random() * 3);
      particle.endFill();
      
      // Position randomly around center
      const angle = Math.random() * Math.PI * 2;
      const distance = 20 + Math.random() * 70;
      particle.x = this.centerX + Math.cos(angle) * distance;
      particle.y = this.centerY + Math.sin(angle) * distance;
      
      // Add velocity for animation
      particle.vx = (Math.random() - 0.5) * 0.3;
      particle.vy = (Math.random() - 0.5) * 0.3;
      
      this.app.stage.addChild(particle);
      this.particles.push(particle);
    }
  }
  
  createEnergyBar() {
    // Create background
    this.energyBg = new Graphics();
    this.energyBg.beginFill(0x222222);
    this.energyBg.lineStyle(2, 0xFFFFFF);
    this.energyBg.drawRoundedRect(50, 120, 200, 30, 10);
    this.energyBg.endFill();
    
    this.app.stage.addChild(this.energyBg);
    
    // Create fill bar
    this.energyFill = new Graphics();
    this.energyFill.beginFill(0x00FFFF);
    this.energyFill.drawRoundedRect(52, 122, 0, 26, 8);
    this.energyFill.endFill();
    
    this.app.stage.addChild(this.energyFill);
    
    // Create label
    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 18,
      fill: 0xFFFFFF
    });
    
    this.energyText = new Text({
      text: 'ENERGY: 0/' + this.maxEnergy,
      style: style
    });
    
    this.energyText.x = 50;
    this.energyText.y = 90;
    
    this.app.stage.addChild(this.energyText);
  }
  
  createInstructions() {
    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 20,
      fill: 0xFFFFFF,
      stroke: 0x000000,
      strokeThickness: 3
    });
    
    this.instructionsText = new Text({
      text: 'Click on the cosmic dust to gather energy\nand create a star!',
      style: style
    });
    
    this.instructionsText.anchor.set(0.5);
    this.instructionsText.x = this.centerX;
    this.instructionsText.y = window.innerHeight - 80;
    
    this.app.stage.addChild(this.instructionsText);
  }
  
  update() {
    this.ticks++;
    
    // Update energy bar
    const width = (this.energy / this.maxEnergy) * 196;
    this.energyFill.clear();
    this.energyFill.beginFill(0x00FFFF);
    this.energyFill.drawRoundedRect(52, 122, width, 26, 8);
    this.energyFill.endFill();
    
    this.energyText.text = 'ENERGY: ' + this.energy + '/' + this.maxEnergy;
    
    if (this.gameState === 'dust') {
      // Update cosmic dust
      if (this.dust) {
        const time = this.ticks * 0.05;
        const scale = 1 + Math.sin(time) * 0.1;
        this.dust.scale.set(scale);
      }
      
      // Update dust particles
      for (const particle of this.particles) {
        // Move particles
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Pull particles toward center based on energy
        const energyFactor = this.energy / this.maxEnergy;
        const dx = this.centerX - particle.x;
        const dy = this.centerY - particle.y;
        
        // Add force toward center
        particle.x += dx * 0.001 * energyFactor;
        particle.y += dy * 0.001 * energyFactor;
        
        // Keep particles within range
        const distance = Math.sqrt(Math.pow(particle.x - this.centerX, 2) + Math.pow(particle.y - this.centerY, 2));
        if (distance > 120) {
          // Move back toward center
          particle.x = this.centerX + (particle.x - this.centerX) * 0.95;
          particle.y = this.centerY + (particle.y - this.centerY) * 0.95;
        }
      }
    } else if (this.gameState === 'protostar') {
      // Update protostar - simpler pulsing animation
      if (this.protostar) {
        const time = this.ticks * 0.03;
        const scale = 1 + Math.sin(time) * 0.05;
        this.protostar.scale.set(scale);
      }
      
      // Update resources every 60 ticks (≈ 1 second)
      if (this.ticks % 60 === 0) {
        this.updateResources();
      }
    }
  }
  
  updateResources() {
    // Add resources based on production rates
    for (const resource in this.production) {
      if (this.resources.hasOwnProperty(resource) && this.production[resource] > 0) {
        this.resources[resource] += this.production[resource];
      }
    }
    
    // Update resources display
    if (this.resourcesText) {
      let text = '';
      for (const resource in this.resources) {
        if (this.production[resource] > 0) {
          text += `${resource.charAt(0).toUpperCase() + resource.slice(1)}: ${this.resources[resource].toFixed(1)} (+${this.production[resource]}/s)\n`;
        }
      }
      this.resourcesText.text = text;
    }
    
    // Update upgrade buttons
    this.updateUpgradeButtons();
  }
  
  updateUpgradeButtons() {
    if (!this.upgradeButtons) return;
    
    // Check each upgrade button
    for (const upgradeId in this.upgradeButtons) {
      const button = this.upgradeButtons[upgradeId];
      const upgrade = this.upgrades[upgradeId];
      
      if (upgrade.purchased) {
        button.visible = false;
        continue;
      }
      
      // Check if can afford
      let canAfford = true;
      for (const resource in upgrade.cost) {
        if (this.resources[resource] < upgrade.cost[resource]) {
          canAfford = false;
          break;
        }
      }
      
      // Update button appearance
      if (canAfford) {
        button.getChildAt(0).tint = 0xFFFFFF;
      } else {
        button.getChildAt(0).tint = 0x888888;
      }
    }
  }
  
  handleClick(event) {
    // Get position relative to canvas
    const rect = this.app.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (this.gameState === 'dust') {
      // Check if click is on cosmic dust
      const distance = Math.sqrt(
        Math.pow(x - this.centerX, 2) + 
        Math.pow(y - this.centerY, 2)
      );
      
      if (distance < 100) {
        this.addEnergy(1);
        this.createPulseEffect();
      }
    }
  }
  
  addEnergy(amount) {
    this.energy += amount;
    
    // Cap at max
    if (this.energy > this.maxEnergy) {
      this.energy = this.maxEnergy;
    }
    
    // Check if we should evolve
    if (this.energy >= this.maxEnergy) {
      this.evolveToProtostar();
    }
  }
  
  createPulseEffect() {
    // Create pulse at center
    const pulse = new Graphics();
    pulse.beginFill(0xFFFFFF, 0.7);
    pulse.drawCircle(0, 0, 50);
    pulse.endFill();
    
    pulse.x = this.centerX;
    pulse.y = this.centerY;
    
    this.app.stage.addChild(pulse);
    
    // Animate pulse
    let scale = 1;
    const expandPulse = () => {
      scale += 0.1;
      pulse.scale.set(scale);
      pulse.alpha -= 0.05;
      
      if (pulse.alpha <= 0) {
        this.app.stage.removeChild(pulse);
      } else {
        requestAnimationFrame(expandPulse);
      }
    };
    
    expandPulse();
  }
  
  evolveToProtostar() {
    console.log('Evolving to protostar!');
    
    // Change game state
    this.gameState = 'protostar';
    
    // Remove dust and particles
    this.app.stage.removeChild(this.dust);
    this.app.stage.removeChild(this.dustText);
    
    for (const particle of this.particles) {
      this.app.stage.removeChild(particle);
    }
    this.particles = [];
    
    // Create protostar
    this.createProtostar();
    
    // Create resource display
    this.createResourcesDisplay();
    
    // Create upgrade panel
    this.createUpgradesPanel();
    
    // Start resource production
    this.production.hydrogen = 1.0;
    this.production.helium = 0.2;
    
    // Update instructions
    this.instructionsText.text = 'Your protostar is generating resources!\nPurchase upgrades to evolve further.';
  }
  
  createProtostar() {
    // Create a protostar directly at the center
    this.protostar = new Graphics();
    
    // Position at the center
    this.protostar.x = this.centerX;
    this.protostar.y = this.centerY;
    
    // Draw a simple star with local coordinates relative to the center position
    this.protostar.beginFill(0xFF9966, 0.4); // Outer glow
    this.protostar.drawCircle(0, 0, 140);
    this.protostar.endFill();
    
    this.protostar.beginFill(0xFF7700, 0.9); // Star body
    this.protostar.drawCircle(0, 0, 90);
    this.protostar.endFill();
    
    this.protostar.beginFill(0xFFFF66, 0.9); // Bright center
    this.protostar.drawCircle(0, 0, 40);
    this.protostar.endFill();
    
    this.protostar.beginFill(0xFFFFFF, 0.9); // Core
    this.protostar.drawCircle(0, 0, 15);
    this.protostar.endFill();
    
    // Add solar flares
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      
      this.protostar.beginFill(0xFF7700, 0.7);
      this.protostar.moveTo(0, 0);
      this.protostar.lineTo(
        Math.cos(angle) * 130,
        Math.sin(angle) * 130
      );
      this.protostar.lineTo(
        Math.cos(angle + 0.2) * 80,
        Math.sin(angle + 0.2) * 80
      );
      this.protostar.endFill();
    }
    
    this.app.stage.addChild(this.protostar);
    
    // Create success message
    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      fontWeight: 'bold',
      fill: 0xFFFFFF,
      stroke: 0x000000,
      strokeThickness: 5
    });
    
    const message = new Text({
      text: 'PROTOSTAR CREATED!',
      style: style
    });
    
    message.anchor.set(0.5);
    message.x = this.centerX;
    message.y = 100;
    this.app.stage.addChild(message);
    
    // Remove message after 3 seconds
    setTimeout(() => {
      this.app.stage.removeChild(message);
    }, 3000);
  }
  
  createResourcesDisplay() {
    // Create background
    const bg = new Graphics();
    bg.beginFill(0x000000, 0.7);
    bg.lineStyle(2, 0xFFFFFF);
    bg.drawRoundedRect(window.innerWidth - 250, 120, 200, 150, 10);
    bg.endFill();
    
    this.app.stage.addChild(bg);
    
    // Create title
    const titleStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 20,
      fontWeight: 'bold',
      fill: 0xFFFFFF
    });
    
    const title = new Text({
      text: 'RESOURCES',
      style: titleStyle
    });
    
    title.x = window.innerWidth - 150;
    title.y = 130;
    title.anchor.set(0.5, 0);
    
    this.app.stage.addChild(title);
    
    // Create resources text
    const textStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 16,
      fill: 0xFFFFFF
    });
    
    this.resourcesText = new Text({
      text: 'Hydrogen: 0 (+1/s)\nHelium: 0 (+0.2/s)',
      style: textStyle
    });
    
    this.resourcesText.x = window.innerWidth - 230;
    this.resourcesText.y = 170;
    
    this.app.stage.addChild(this.resourcesText);
  }
  
  createUpgradesPanel() {
    // Create background with increased height
    const bg = new Graphics();
    bg.beginFill(0x000000, 0.7);
    bg.lineStyle(2, 0xFFFFFF);
    bg.drawRoundedRect(50, 180, 250, 300, 10); // Increased height
    bg.endFill();
    
    this.app.stage.addChild(bg);
    
    // Create title
    const titleStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 20,
      fontWeight: 'bold',
      fill: 0xFFFFFF
    });
    
    const title = new Text({
      text: 'UPGRADES',
      style: titleStyle
    });
    
    title.x = 175;
    title.y = 190;
    title.anchor.set(0.5, 0);
    
    this.app.stage.addChild(title);
    
    // Create upgrade buttons with increased spacing
    this.upgradeButtons = {};
    
    this.upgradeButtons.hydrogenFusion = this.createUpgradeButton(
      'Hydrogen Fusion',
      'Doubles hydrogen production',
      { hydrogen: 10 },
      80 // Increased spacing
    );
    
    this.upgradeButtons.heliumSynthesis = this.createUpgradeButton(
      'Helium Synthesis',
      'Doubles helium production',
      { hydrogen: 30, helium: 5 },
      160 // Increased spacing
    );
    
    this.upgradeButtons.carbonFormation = this.createUpgradeButton(
      'Carbon Formation',
      'Begin producing carbon',
      { hydrogen: 50, helium: 20 },
      240 // Increased spacing
    );
  }
  
  createUpgradeButton(name, description, cost, yOffset) {
    // Create button container
    const button = new Container();
    button.x = 60;
    button.y = 220 + yOffset;
    this.app.stage.addChild(button);
    
    // Create button background
    const bg = new Graphics();
    bg.beginFill(0x333333);
    bg.lineStyle(2, 0x666666);
    bg.drawRoundedRect(0, 0, 230, 50, 5);
    bg.endFill();
    button.addChild(bg);
    
    // Create name text
    const nameStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 16,
      fontWeight: 'bold',
      fill: 0xFFFFFF
    });
    
    const nameText = new Text({
      text: name,
      style: nameStyle
    });
    
    nameText.x = 10;
    nameText.y = 5;
    button.addChild(nameText);
    
    // Create description text
    const descStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 12,
      fill: 0xCCCCCC
    });
    
    const descText = new Text({
      text: description,
      style: descStyle
    });
    
    descText.x = 10;
    descText.y = 25;
    button.addChild(descText);
    
    // Create cost text
    let costText = 'Cost: ';
    for (const resource in cost) {
      costText += `${cost[resource]} ${resource}, `;
    }
    costText = costText.slice(0, -2);
    
    const costStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 10,
      fill: 0xFFCC66
    });
    
    const costTextObj = new Text({
      text: costText,
      style: costStyle
    });
    
    costTextObj.x = 130;
    costTextObj.y = 35;
    button.addChild(costTextObj);
    
    // Make button interactive
    bg.eventMode = 'static';
    bg.cursor = 'pointer';
    
    bg.on('pointerdown', () => {
      this.purchaseUpgrade(name);
    });
    
    return button;
  }
  
  purchaseUpgrade(upgradeName) {
    // Find the upgrade by name
    let upgradeId = null;
    for (const id in this.upgrades) {
      if (this.upgrades[id].name === upgradeName) {
        upgradeId = id;
        break;
      }
    }
    
    if (!upgradeId) return;
    
    const upgrade = this.upgrades[upgradeId];
    
    // Check if already purchased
    if (upgrade.purchased) {
      this.showMessage('Already purchased!');
      return;
    }
    
    // Check if can afford
    let canAfford = true;
    for (const resource in upgrade.cost) {
      if (this.resources[resource] < upgrade.cost[resource]) {
        canAfford = false;
        break;
      }
    }
    
    if (!canAfford) {
      this.showMessage('Not enough resources!');
      return;
    }
    
    // Deduct resources
    for (const resource in upgrade.cost) {
      this.resources[resource] -= upgrade.cost[resource];
    }
    
    // Apply upgrade effect
    if (upgradeId === 'hydrogenFusion') {
      this.production.hydrogen *= 2;
    } else if (upgradeId === 'heliumSynthesis') {
      this.production.helium *= 2;
    } else if (upgradeId === 'carbonFormation') {
      this.production.carbon = 0.1;
    }
    
    // Mark as purchased
    upgrade.purchased = true;
    
    // Hide button
    this.upgradeButtons[upgradeId].visible = false;
    
    // Show success message
    this.showMessage('Upgrade purchased: ' + upgradeName);
    
    // Update resources display
    this.updateResources();
  }
  
  showMessage(text) {
    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 24,
      fontWeight: 'bold',
      fill: 0xFFFFFF,
      stroke: 0x000000,
      strokeThickness: 4
    });
    
    const message = new Text({
      text: text,
      style: style
    });
    
    message.anchor.set(0.5);
    message.x = this.centerX;
    message.y = 200;
    this.app.stage.addChild(message);
    
    // Remove after 2 seconds
    setTimeout(() => {
      this.app.stage.removeChild(message);
    }, 2000);
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, starting Stellar Evolution');
  const game = new StellarEvolution();
  game.init();
});

export default StellarEvolution;