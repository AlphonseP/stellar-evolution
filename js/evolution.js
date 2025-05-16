// Evolution.js - Handles game evolution states

const Evolution = {
    states: {
        COSMIC_DUST: 'cosmic_dust',
        PROTOSTAR: 'protostar'
    },
    
    currentState: null,
    clickAnimations: [],
    evolutionNotification: null,
    
    init: function() {
        this.currentState = this.states.COSMIC_DUST;
        this.updateUI();
    },
    
    checkEvolution: function() {
        // Check if we can evolve
        if (this.currentState === this.states.COSMIC_DUST && Resources.hydrogen >= 50) {
            this.evolveToProtostar();
        }
    },
    
    evolveToProtostar: function() {
        this.currentState = this.states.PROTOSTAR;
        this.updateUI();
        
        // Visual notification of evolution
        this.showEvolutionNotification("Cosmic dust condensed into a Protostar!");
    },
    
    showEvolutionNotification: function(message) {
        this.evolutionNotification = {
            message: message,
            opacity: 1,
            y: Game.height / 2
        };
    },
    
    updateUI: function() {
        let statusText = 'Unknown';
        
        switch(this.currentState) {
            case this.states.COSMIC_DUST:
                statusText = 'Cosmic Dust';
                break;
            case this.states.PROTOSTAR:
                statusText = 'Protostar';
                break;
        }
        
        document.getElementById('evolution-status').textContent = `Status: ${statusText}`;
    },
    
    getCurrentObjectRadius: function() {
        switch(this.currentState) {
            case this.states.COSMIC_DUST:
                return 100;
            case this.states.PROTOSTAR:
                return 80;
            default:
                return 50;
        }
    },
    
    animateClick: function(x, y) {
        // Add a click animation
        this.clickAnimations.push({
            x: x,
            y: y,
            radius: 10,
            maxRadius: 30,
            opacity: 1,
            growSpeed: 50 // pixels per second
        });
    },
    
    updateClickAnimations: function(deltaTime) {
        // Update all click animations
        for (let i = this.clickAnimations.length - 1; i >= 0; i--) {
            const anim = this.clickAnimations[i];
            
            // Grow radius
            anim.radius += anim.growSpeed * (deltaTime / 1000);
            
            // Fade out
            anim.opacity = 1 - (anim.radius / anim.maxRadius);
            
            // Remove if completely faded
            if (anim.opacity <= 0) {
                this.clickAnimations.splice(i, 1);
            }
        }
        
        // Update evolution notification if exists
        if (this.evolutionNotification) {
            this.evolutionNotification.opacity -= 0.5 * (deltaTime / 1000);
            this.evolutionNotification.y -= 20 * (deltaTime / 1000);
            
            if (this.evolutionNotification.opacity <= 0) {
                this.evolutionNotification = null;
            }
        }
    },
    
    renderClickAnimations: function(ctx) {
        // Render all click animations
        for (const anim of this.clickAnimations) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${anim.opacity})`;
            ctx.lineWidth = 2;
            ctx.arc(anim.x, anim.y, anim.radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Render evolution notification if exists
        if (this.evolutionNotification) {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.evolutionNotification.opacity})`;
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(
                this.evolutionNotification.message, 
                Game.width / 2, 
                this.evolutionNotification.y
            );
        }
    },
    
    renderCurrentState: function(ctx, timestamp) {
        const centerX = Game.width / 2;
        const centerY = Game.height / 2;
        
        switch(this.currentState) {
            case this.states.COSMIC_DUST:
                this.renderCosmicDust(ctx, centerX, centerY, timestamp);
                break;
            case this.states.PROTOSTAR:
                this.renderProtostar(ctx, centerX, centerY, timestamp);
                break;
        }
    },
    
    renderCosmicDust: function(ctx, centerX, centerY, timestamp) {
        // Pulsing effect
        const pulseSize = Math.sin(timestamp * 0.001) * 5;
        const baseSize = 100;
        const size = baseSize + pulseSize;
        
        // Draw a cosmic dust cloud
        const gradient = ctx.createRadialGradient(
            centerX, centerY, 10,
            centerX, centerY, size
        );
        gradient.addColorStop(0, 'rgba(180, 180, 220, 0.8)');
        gradient.addColorStop(1, 'rgba(100, 100, 150, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw some smaller dust particles
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * size * 0.8;
            const particleSize = Math.random() * 3 + 1;
            
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            ctx.beginPath();
            ctx.fillStyle = `rgba(200, 200, 240, ${Math.random() * 0.5 + 0.3})`;
            ctx.arc(x, y, particleSize, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    
    renderProtostar: function(ctx, centerX, centerY, timestamp) {
        // Pulsing effect
        const pulse = Math.sin(timestamp * 0.002) * 5;
        const baseSize = 80;
        const size = baseSize + pulse;
        
        // Core glow
        const coreGradient = ctx.createRadialGradient(
            centerX, centerY, 5,
            centerX, centerY, size
        );
        coreGradient.addColorStop(0, 'rgba(255, 230, 160, 1)');
        coreGradient.addColorStop(0.4, 'rgba(255, 170, 70, 0.8)');
        coreGradient.addColorStop(1, 'rgba(200, 60, 20, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = coreGradient;
        ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner core
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 220, 0.9)';
        ctx.arc(centerX, centerY, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw some energy bursts
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + timestamp * 0.0005;
            const burstLength = size * (0.8 + Math.sin(timestamp * 0.003 + i) * 0.2);
            
            const innerX = centerX + Math.cos(angle) * size * 0.5;
            const innerY = centerY + Math.sin(angle) * size * 0.5;
            
            const outerX = centerX + Math.cos(angle) * burstLength;
            const outerY = centerY + Math.sin(angle) * burstLength;
            
            const gradient = ctx.createLinearGradient(innerX, innerY, outerX, outerY);
            gradient.addColorStop(0, 'rgba(255, 200, 100, 0.7)');
            gradient.addColorStop(1, 'rgba(255, 100, 50, 0)');
            
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3 + Math.sin(timestamp * 0.002 + i * 2) * 2;
            ctx.moveTo(innerX, innerY);
            ctx.lineTo(outerX, outerY);
            ctx.stroke();
        }
    },
    
    getClickHydrogenRate: function() {
        switch(this.currentState) {
            case this.states.COSMIC_DUST:
                return 1;
            case this.states.PROTOSTAR:
                return 2;
            default:
                return 0;
        }
    },
    
    getClickHeliumRate: function() {
        switch(this.currentState) {
            case this.states.COSMIC_DUST:
                return 0;
            case this.states.PROTOSTAR:
                return 0.5;
            default:
                return 0;
        }
    },
    
    getPassiveHydrogenRate: function() {
        switch(this.currentState) {
            case this.states.COSMIC_DUST:
                return 0; // No passive generation
            case this.states.PROTOSTAR:
                return 0.5; // 0.5 per second
            default:
                return 0;
        }
    },
    
    getPassiveHeliumRate: function() {
        switch(this.currentState) {
            case this.states.COSMIC_DUST:
                return 0; // No passive generation
            case this.states.PROTOSTAR:
                return 0.1; // 0.1 per second
            default:
                return 0;
        }
    },
    
    getState: function() {
        return {
            currentState: this.currentState
        };
    },
    
    setState: function(state) {
        this.currentState = state.currentState || this.states.COSMIC_DUST;
        this.updateUI();
    }
};