// src/js/entities/cosmic-dust.js
import { Container, Graphics } from 'pixi.js';
import { GameConfig } from '../config/game-config';

export class CosmicDust {
  constructor(game) {
    this.game = game;
    this.container = new Container();
    this.particles = [];
    this.energy = 0;
    this.maxEnergy = GameConfig.PROTOSTAR_THRESHOLD;
    
    this.init();
  }
  
  init() {
    // Create a visible background glow
    const glow = new Graphics();
    glow.beginFill(0x3366ff, 0.3); // Make it more visible
    glow.drawCircle(0, 0, 150);
    glow.endFill();
    this.container.addChild(glow);
    
    // Add a label to help users
    this.createLabel();
    
    // Create dust particles
    this.createParticles();
    
    // Position the cosmic dust in the center of the screen
    this.repositionParticles();
  }
  
  createLabel() {
    // Create a visual indicator for clicking
    const labelBg = new Graphics();
    labelBg.beginFill(0x000000, 0.7);
    labelBg.drawRoundedRect(-100, 80, 200, 40, 10);
    labelBg.endFill();
    this.container.addChild(labelBg);
    
    // We can't easily add text with PIXI.js Graphics
    // So we'll create a visual indicator instead
    const indicator = new Graphics();
    indicator.beginFill(0xffffff);
    indicator.drawCircle(0, 100, 10);
    indicator.endFill();
    
    // Make it pulse
    this.container.addChild(indicator);
    
    // Store reference for animation
    this.clickIndicator = indicator;
  }
  
  createParticles() {
    // Create 50-100 dust particles
    const numParticles = Math.floor(Math.random() * 50) + 100; // More particles
    
    for (let i = 0; i < numParticles; i++) {
      // Create a visible particle
      const dust = new Graphics();
      
      // Randomly determine particle color
      const colorChoice = Math.random();
      let color;
      
      if (colorChoice < 0.33) {
        color = 0x6699ff; // Brighter blue
      } else if (colorChoice < 0.66) {
        color = 0xffff99; // Brighter yellow
      } else {
        color = 0xff9999; // Brighter red
      }
      
      dust.beginFill(color, 0.8); // Higher alpha
      dust.drawCircle(0, 0, 2 + Math.random() * 3); // Larger particles
      dust.endFill();
      
      // Randomize position, scale, and rotation
      const distance = Math.random() * 140; // Wider spread
      const angle = Math.random() * Math.PI * 2;
      
      dust.x = Math.cos(angle) * distance;
      dust.y = Math.sin(angle) * distance;
      dust.scale.set(0.8 + Math.random() * 1.5);
      dust.alpha = 0.6 + Math.random() * 0.4; // More visible
      
      // Add particle data for animation
      dust.vx = (Math.random() - 0.5) * 0.2;
      dust.vy = (Math.random() - 0.5) * 0.2;
      
      this.container.addChild(dust);
      this.particles.push(dust);
    }
  }
  
  repositionParticles() {
    this.container.x = window.innerWidth / 2;
    this.container.y = window.innerHeight / 2;
  }
  
  update(deltaTime) {
    // Update particles
    for (const particle of this.particles) {
      // Move particles
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
      
      // Pull particles toward center based on energy
      const energyFactor = this.energy / this.maxEnergy;
      const dx = 0 - particle.x;
      const dy = 0 - particle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 5) {
        const force = 0.01 * energyFactor * deltaTime;
        particle.x += dx * force;
        particle.y += dy * force;
      }
      
      // Make particles glow more as energy increases
      particle.alpha = 0.5 + (0.5 * energyFactor);
    }
    
    // Make the cloud pulsate
    const pulseFactor = 1 + Math.sin(this.game.gameTime * 0.05) * 0.1;
    this.container.scale.set(pulseFactor);
    
    // Animate the click indicator
    if (this.clickIndicator) {
      this.clickIndicator.scale.set(0.8 + Math.sin(this.game.gameTime * 0.1) * 0.3);
    }
  }
  
  addEnergy(amount) {
    this.energy += amount;
    
    // Ensure we don't exceed max energy
    if (this.energy > this.maxEnergy) {
      this.energy = this.maxEnergy;
    }
    
    // Visual feedback for energy gain
    this.pulseEffect();
  }
  
  pulseEffect() {
    // Create a pulse effect when energy is added
    const pulse = new Graphics();
    pulse.beginFill(0xffffff, 0.7); // More visible
    pulse.drawCircle(0, 0, 30); // Larger pulse
    pulse.endFill();
    
    pulse.alpha = 0.9;
    this.container.addChild(pulse);
    
    // Animate the pulse
    const expandPulse = () => {
      pulse.scale.x += 0.1;
      pulse.scale.y += 0.1;
      pulse.alpha -= 0.05;
      
      if (pulse.alpha <= 0) {
        this.container.removeChild(pulse);
      } else {
        requestAnimationFrame(expandPulse);
      }
    };
    
    expandPulse();
  }
}