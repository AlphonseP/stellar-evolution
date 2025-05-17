// Evolution.js - Handles game evolution states

const Evolution = {
    states: {
        COSMIC_DUST: 'cosmic_dust',
        PROTOSTAR: 'protostar',
        RED_DWARF: 'red_dwarf',
        YELLOW_STAR: 'yellow_star',
        BLUE_GIANT: 'blue_giant',
        SUPERNOVA: 'supernova',
        BLACK_HOLE: 'black_hole'
    },
    
    currentState: null,
    clickAnimations: [],
    evolutionNotification: null,
    
    // Variables to track production rate multipliers
    clickHydrogenMultiplier: 1,
    clickHeliumMultiplier: 1,
    passiveHydrogenMultiplier: 1, 
    passiveHeliumMultiplier: 1,
    
    // Variable to track supernova boost
    supernovaBoostMultiplier: 1,
    
    // Variables for supernova animation
    supernovaEffects: null,
    
    // Variables for black hole
    blackHoleEffects: null,
    blackHoleRotation: 0,
    
    init: function() {
        this.currentState = this.states.COSMIC_DUST;
        this.updateUI();
    },
    
    checkEvolution: function() {
        // Check if we can evolve from cosmic dust to protostar
        if (this.currentState === this.states.COSMIC_DUST) {
            // Standard requirement for evolving to protostar
            const requiredHydrogen = 50;
            
            if (Resources.hydrogen >= requiredHydrogen) {
                this.evolveToProtostar();
            }
        }
        
        // Evolution paths from protostar to different star types
        if (this.currentState === this.states.PROTOSTAR) {
            // Check evolution thresholds
            if (Resources.hydrogen >= 300 && Resources.helium >= 100) {
                this.evolveToBlueGiant();
            } else if (Resources.hydrogen >= 250 && Resources.helium >= 75) {
                this.evolveToYellowStar();
            } else if (Resources.hydrogen >= 200 && Resources.helium >= 50) {
                this.evolveToRedDwarf();
            }
        }
        
        // Evolution path from Red Dwarf to Yellow Star
        if (this.currentState === this.states.RED_DWARF && Resources.hydrogen >= 350 && Resources.helium >= 150) {
            this.evolveToYellowStar();
            this.showEvolutionNotification("Red Dwarf has grown into a Yellow Star!");
        }
        
        // Evolution path from Yellow Star to Blue Giant
        if (this.currentState === this.states.YELLOW_STAR && Resources.hydrogen >= 500 && Resources.helium >= 300) {
            this.evolveToBlueGiant();
            this.showEvolutionNotification("Yellow Star has expanded into a massive Blue Giant!");
        }
        
        // Evolution path from Blue Giant to Supernova
        if (this.currentState === this.states.BLUE_GIANT && Resources.hydrogen >= 1000 && Resources.helium >= 800) {
            this.evolveToSupernova();
            this.showEvolutionNotification("The Blue Giant is collapsing - SUPERNOVA DETECTED!");
        }
        
        // Evolution path from Supernova to Black Hole (automatic after a delay)
        // This will be handled in the Supernova animation/render code
    },
    
    evolveToProtostar: function() {
        this.currentState = this.states.PROTOSTAR;
        this.updateUI();
        this.showEvolutionNotification("Cosmic dust condensed into a Protostar!");
    },
    
    evolveToRedDwarf: function() {
        this.currentState = this.states.RED_DWARF;
        this.updateUI();
        this.showEvolutionNotification("Protostar has stabilized into a Red Dwarf star!");
    },
    
    evolveToYellowStar: function() {
        this.currentState = this.states.YELLOW_STAR;
        this.updateUI();
        this.showEvolutionNotification("Protostar has grown into a Yellow Star!");
    },
    
    evolveToBlueGiant: function() {
        this.currentState = this.states.BLUE_GIANT;
        this.updateUI();
        this.showEvolutionNotification("Protostar has expanded into a massive Blue Giant!");
    },
    
    evolveToSupernova: function() {
        this.currentState = this.states.SUPERNOVA;
        this.updateUI();
        
        // Calculate resource boost when going supernova
        this.supernovaBoostMultiplier = 2 + (Resources.helium / 200); // Base 2x plus bonus based on helium
        
        // Cap the multiplier to a reasonable value (maximum 5x)
        if (this.supernovaBoostMultiplier > 5) {
            this.supernovaBoostMultiplier = 5;
        }
        
        // Initialize supernova animation effects
        this.supernovaEffects = {
            startTime: performance.now(),
            duration: 10000, // 10 seconds
            expandingRings: [],
            particles: [],
            phase: 'expanding' // expanding -> collapsing -> complete
        };
        
        // Show notification about resource boost
        Game.showNotification(`SUPERNOVA EVENT! Resource production boosted by ${this.supernovaBoostMultiplier.toFixed(1)}x`);
        
        // Set a timer to evolve to black hole after the animation
        setTimeout(() => {
            if (this.currentState === this.states.SUPERNOVA) {
                this.evolveToBlackHole();
            }
        }, this.supernovaEffects.duration);
        
        // Generate initial expanding rings
        for (let i = 0; i < 5; i++) {
            this.supernovaEffects.expandingRings.push({
                radius: 0,
                maxRadius: 200 + Math.random() * 300,
                speed: 0.05 + Math.random() * 0.15,
                opacity: 1,
                color: `hsl(${30 + Math.random() * 30}, 100%, 60%)`
            });
        }
        
        // Generate particles
        for (let i = 0; i < 200; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.1 + Math.random() * 0.4;
            this.supernovaEffects.particles.push({
                x: 0,
                y: 0,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 1 + Math.random() * 3,
                opacity: 0.8 + Math.random() * 0.2,
                color: `hsl(${Math.random() * 60}, 100%, ${50 + Math.random() * 50}%)`
            });
        }
    },
    
    evolveToBlackHole: function() {
        this.currentState = this.states.BLACK_HOLE;
        this.updateUI();
        
        // Initialize black hole effects
        this.blackHoleEffects = {
            accretionDisk: [],
            radiationJets: {
                top: { length: 0, maxLength: 300 },
                bottom: { length: 0, maxLength: 300 }
            },
            gravitationalLensing: []
        };
        
        // Generate accretion disk particles
        for (let i = 0; i < 300; i++) {
            const distance = 40 + Math.random() * 100;
            const angle = Math.random() * Math.PI * 2;
            const orbitSpeed = 0.02 - (0.01 * (distance / 140)); // Further particles move slower
            
            this.blackHoleEffects.accretionDisk.push({
                distance: distance,
                angle: angle,
                orbitSpeed: orbitSpeed,
                size: 1 + Math.random() * 2,
                color: `hsl(${180 + Math.random() * 240}, ${70 + Math.random() * 30}%, ${40 + Math.random() * 60}%)`
            });
        }
        
        // Show notification about final evolution state
        this.showEvolutionNotification("The supernova has collapsed into a Black Hole!");
        Game.showNotification("Final evolution achieved: Black Hole!");
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
            case this.states.RED_DWARF:
                statusText = 'Red Dwarf';
                break;
            case this.states.YELLOW_STAR:
                statusText = 'Yellow Star';
                break;
            case this.states.BLUE_GIANT:
                statusText = 'Blue Giant';
                break;
            case this.states.SUPERNOVA:
                statusText = 'SUPERNOVA!';
                break;
            case this.states.BLACK_HOLE:
                statusText = 'Black Hole';
                break;
        }
        
        document.getElementById('evolution-status').textContent = `Status: ${statusText}`;
        
        // Display supernova boost if applicable
        if (this.currentState === this.states.SUPERNOVA || this.currentState === this.states.BLACK_HOLE) {
            let boostElement = document.getElementById('supernova-boost');
            if (!boostElement) {
                boostElement = document.createElement('div');
                boostElement.id = 'supernova-boost';
                boostElement.style.backgroundColor = 'rgba(255, 100, 50, 0.7)';
                boostElement.style.padding = '5px';
                boostElement.style.margin = '5px 0';
                boostElement.style.borderRadius = '3px';
                boostElement.style.textAlign = 'center';
                boostElement.style.fontWeight = 'bold';
                boostElement.style.color = '#fff';
                document.getElementById('resource-panel').appendChild(boostElement);
            }
            boostElement.textContent = `⚡ Supernova Boost: ${this.supernovaBoostMultiplier.toFixed(1)}x ⚡`;
        } else {
            // Remove boost display if not applicable
            const boostElement = document.getElementById('supernova-boost');
            if (boostElement) {
                boostElement.remove();
            }
        }
    },
    
    getCurrentObjectRadius: function() {
        switch(this.currentState) {
            case this.states.COSMIC_DUST:
                return 100;
            case this.states.PROTOSTAR:
                return 80;
            case this.states.RED_DWARF:
                return 70;
            case this.states.YELLOW_STAR:
                return 90;
            case this.states.BLUE_GIANT:
                return 120;
            case this.states.SUPERNOVA:
                // Supernova radius changes over time during animation
                if (this.supernovaEffects && this.supernovaEffects.expandingRings.length > 0) {
                    // Use the largest ring's radius as the clickable area
                    let maxRadius = 0;
                    for (const ring of this.supernovaEffects.expandingRings) {
                        if (ring.radius > maxRadius) {
                            maxRadius = ring.radius;
                        }
                    }
                    return Math.max(80, maxRadius * 0.8); // At least 80px radius
                }
                return 150; // Default supernova radius
            case this.states.BLACK_HOLE:
                return 50; // Black hole event horizon radius
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
            case this.states.RED_DWARF:
                this.renderRedDwarf(ctx, centerX, centerY, timestamp);
                break;
            case this.states.YELLOW_STAR:
                this.renderYellowStar(ctx, centerX, centerY, timestamp);
                break;
            case this.states.BLUE_GIANT:
                this.renderBlueGiant(ctx, centerX, centerY, timestamp);
                break;
            case this.states.SUPERNOVA:
                this.renderSupernova(ctx, centerX, centerY, timestamp);
                break;
            case this.states.BLACK_HOLE:
                this.renderBlackHole(ctx, centerX, centerY, timestamp);
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
    
    renderRedDwarf: function(ctx, centerX, centerY, timestamp) {
        // Slight pulsing effect
        const pulse = Math.sin(timestamp * 0.001) * 3;
        const baseSize = 70;
        const size = baseSize + pulse;
        
        // Core glow
        const coreGradient = ctx.createRadialGradient(
            centerX, centerY, 5,
            centerX, centerY, size
        );
        coreGradient.addColorStop(0, 'rgba(255, 200, 180, 1)');
        coreGradient.addColorStop(0.4, 'rgba(230, 100, 70, 0.8)');
        coreGradient.addColorStop(1, 'rgba(180, 60, 40, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = coreGradient;
        ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner core
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 210, 180, 0.9)';
        ctx.arc(centerX, centerY, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Surface details - solar flares
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2 + timestamp * 0.0002;
            const flareSize = size * (0.2 + Math.sin(timestamp * 0.002 + i * 0.5) * 0.1);
            
            const startX = centerX + Math.cos(angle) * size * 0.9;
            const startY = centerY + Math.sin(angle) * size * 0.9;
            
            const endX = centerX + Math.cos(angle) * (size + flareSize);
            const endY = centerY + Math.sin(angle) * (size + flareSize);
            
            const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
            gradient.addColorStop(0, 'rgba(230, 110, 80, 0.7)');
            gradient.addColorStop(1, 'rgba(200, 80, 60, 0)');
            
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2 + Math.sin(timestamp * 0.001 + i) * 1;
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    },
    
    renderYellowStar: function(ctx, centerX, centerY, timestamp) {
        // Pulsing effect
        const pulse = Math.sin(timestamp * 0.001) * 4;
        const baseSize = 90;
        const size = baseSize + pulse;
        
        // Core glow
        const coreGradient = ctx.createRadialGradient(
            centerX, centerY, 5,
            centerX, centerY, size
        );
        coreGradient.addColorStop(0, 'rgba(255, 255, 200, 1)');
        coreGradient.addColorStop(0.4, 'rgba(255, 240, 100, 0.8)');
        coreGradient.addColorStop(1, 'rgba(255, 180, 50, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = coreGradient;
        ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner core
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 230, 0.9)';
        ctx.arc(centerX, centerY, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Solar flares and surface activity
        for (let i = 0; i < 15; i++) {
            const angle = (i / 15) * Math.PI * 2 + timestamp * 0.0003;
            const flareSize = size * (0.3 + Math.sin(timestamp * 0.002 + i * 0.7) * 0.15);
            
            const startX = centerX + Math.cos(angle) * size * 0.9;
            const startY = centerY + Math.sin(angle) * size * 0.9;
            
            const endX = centerX + Math.cos(angle) * (size + flareSize);
            const endY = centerY + Math.sin(angle) * (size + flareSize);
            
            const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
            gradient.addColorStop(0, 'rgba(255, 220, 100, 0.7)');
            gradient.addColorStop(1, 'rgba(255, 180, 50, 0)');
            
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3 + Math.sin(timestamp * 0.001 + i) * 2;
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    },
    
    renderBlueGiant: function(ctx, centerX, centerY, timestamp) {
        // Pulsing effect
        const pulse = Math.sin(timestamp * 0.0008) * 5;
        const baseSize = 120;
        const size = baseSize + pulse;
        
        // Core glow
        const coreGradient = ctx.createRadialGradient(
            centerX, centerY, 10,
            centerX, centerY, size
        );
        coreGradient.addColorStop(0, 'rgba(200, 220, 255, 1)');
        coreGradient.addColorStop(0.3, 'rgba(120, 170, 255, 0.9)');
        coreGradient.addColorStop(0.7, 'rgba(70, 100, 220, 0.7)');
        coreGradient.addColorStop(1, 'rgba(50, 70, 180, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = coreGradient;
        ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner core
        ctx.beginPath();
        ctx.fillStyle = 'rgba(220, 235, 255, 0.95)';
        ctx.arc(centerX, centerY, size * 0.25, 0, Math.PI * 2);
        ctx.fill();
        
        // Energy outbursts and radiation jets
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2 + timestamp * 0.0004;
            const jetLength = size * (0.4 + Math.sin(timestamp * 0.001 + i * 0.3) * 0.2);
            
            const startX = centerX + Math.cos(angle) * size * 0.9;
            const startY = centerY + Math.sin(angle) * size * 0.9;
            
            const endX = centerX + Math.cos(angle) * (size + jetLength);
            const endY = centerY + Math.sin(angle) * (size + jetLength);
            
            const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
            gradient.addColorStop(0, 'rgba(140, 180, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(80, 120, 220, 0)');
            
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 4 + Math.sin(timestamp * 0.001 + i * 2) * 3;
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
        
        // Add radiating halo effect
        const haloGradient = ctx.createRadialGradient(
            centerX, centerY, size * 0.9,
            centerX, centerY, size * 1.5
        );
        haloGradient.addColorStop(0, 'rgba(100, 150, 255, 0.2)');
        haloGradient.addColorStop(1, 'rgba(80, 100, 200, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = haloGradient;
        ctx.arc(centerX, centerY, size * 1.5, 0, Math.PI * 2);
        ctx.fill();
    },
    
    renderSupernova: function(ctx, centerX, centerY, timestamp) {
        if (!this.supernovaEffects) {
            // If no effects are initialized yet, initialize them
            this.evolveToSupernova(); 
            return;
        }
        
        // Calculate the elapsed time since the supernova started
        const elapsedTime = timestamp - this.supernovaEffects.startTime;
        const progress = Math.min(elapsedTime / this.supernovaEffects.duration, 1);
        
        // Update supernova phase based on progress
        if (progress < 0.5 && this.supernovaEffects.phase !== 'expanding') {
            this.supernovaEffects.phase = 'expanding';
        } else if (progress >= 0.5 && progress < 0.9 && this.supernovaEffects.phase !== 'collapsing') {
            this.supernovaEffects.phase = 'collapsing';
        } else if (progress >= 0.9 && this.supernovaEffects.phase !== 'complete') {
            this.supernovaEffects.phase = 'complete';
        }
        
        // Draw bright central flash
        const flashOpacity = progress < 0.3 
            ? progress / 0.3 // Increase to full brightness
            : 1 - ((progress - 0.3) / 0.7); // Then fade out
        
        const gradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, 150 * (1 - progress * 0.5)
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${flashOpacity})`);
        gradient.addColorStop(0.2, `rgba(255, 240, 220, ${flashOpacity * 0.8})`);
        gradient.addColorStop(0.5, `rgba(255, 200, 100, ${flashOpacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 100, 50, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(centerX, centerY, 150, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw expanding rings
        for (let i = 0; i < this.supernovaEffects.expandingRings.length; i++) {
            const ring = this.supernovaEffects.expandingRings[i];
            
            // Update ring radius based on phase
            if (this.supernovaEffects.phase === 'expanding') {
                ring.radius += ring.speed * (timestamp % 50);
                ring.opacity = Math.max(0, 1 - (ring.radius / ring.maxRadius));
            } else if (this.supernovaEffects.phase === 'collapsing') {
                // Start collapsing the rings
                const collapseRate = ring.speed * 0.7;
                ring.radius -= collapseRate * (timestamp % 50);
                ring.opacity = Math.max(0, ring.radius / (ring.maxRadius * 0.5));
                
                // Remove rings that have collapsed completely
                if (ring.radius <= 0) {
                    this.supernovaEffects.expandingRings.splice(i, 1);
                    i--; // Adjust index for the removed item
                    continue;
                }
            } else {
                // In complete phase, quickly collapse any remaining rings
                ring.radius -= ring.speed * 2 * (timestamp % 50);
                ring.opacity = Math.max(0, ring.radius / (ring.maxRadius * 0.5));
                
                if (ring.radius <= 0) {
                    this.supernovaEffects.expandingRings.splice(i, 1);
                    i--;
                    continue;
                }
            }
            
            // Draw the ring
            ctx.beginPath();
            ctx.strokeStyle = ring.color.replace(')', `, ${ring.opacity})`).replace('rgb', 'rgba');
            ctx.lineWidth = 3 + Math.sin(timestamp * 0.002 + i) * 2;
            ctx.arc(centerX, centerY, ring.radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Update and draw particles
        for (let i = 0; i < this.supernovaEffects.particles.length; i++) {
            const particle = this.supernovaEffects.particles[i];
            
            // Update particle position
            if (this.supernovaEffects.phase === 'expanding') {
                // Particles fly outward
                particle.x += particle.vx * (timestamp % 30);
                particle.y += particle.vy * (timestamp % 30);
                
                particle.opacity = Math.max(0, 1 - (elapsedTime / (this.supernovaEffects.duration * 0.7)));
            } else if (this.supernovaEffects.phase === 'collapsing') {
                // Particles start getting pulled back in
                const distanceX = particle.x;
                const distanceY = particle.y;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                
                if (distance > 0) {
                    // Calculate direction to center
                    const dirX = -distanceX / distance;
                    const dirY = -distanceY / distance;
                    
                    // Apply force toward center
                    const pullStrength = 0.001 * (timestamp % 30);
                    particle.vx += dirX * pullStrength;
                    particle.vy += dirY * pullStrength;
                }
                
                particle.x += particle.vx * (timestamp % 30);
                particle.y += particle.vy * (timestamp % 30);
                
                particle.opacity = Math.max(0, 0.7 - ((progress - 0.5) / 0.5));
            } else {
                // In complete phase, quickly pull particles toward center
                const distanceX = particle.x;
                const distanceY = particle.y;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                
                if (distance > 0) {
                    const dirX = -distanceX / distance;
                    const dirY = -distanceY / distance;
                    
                    const strongPull = 0.004 * (timestamp % 30);
                    particle.vx += dirX * strongPull;
                    particle.vy += dirY * strongPull;
                }
                
                particle.x += particle.vx * (timestamp % 30);
                particle.y += particle.vy * (timestamp % 30);
                
                particle.opacity = Math.max(0, 0.3 - ((progress - 0.9) / 0.1));
            }
            
            // Draw the particle
            if (particle.opacity > 0) {
                ctx.beginPath();
                ctx.fillStyle = particle.color.replace(')', `, ${particle.opacity})`).replace('hsl', 'hsla');
                ctx.arc(centerX + particle.x, centerY + particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Generate new rings occasionally during expanding phase
        if (this.supernovaEffects.phase === 'expanding' && Math.random() < 0.02) {
            this.supernovaEffects.expandingRings.push({
                radius: 20 + Math.random() * 30,
                maxRadius: 200 + Math.random() * 300,
                speed: 0.05 + Math.random() * 0.15,
                opacity: 0.7 + Math.random() * 0.3,
                color: `hsl(${20 + Math.random() * 40}, 100%, 60%)`
            });
        }
        
        // Draw the core that will become a black hole in the collapsing phase
        if (this.supernovaEffects.phase === 'collapsing' || this.supernovaEffects.phase === 'complete') {
            const coreSize = this.supernovaEffects.phase === 'collapsing' 
                ? 10 + 40 * ((progress - 0.5) / 0.4)
                : 50;
                
            const coreGradient = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, coreSize
            );
            coreGradient.addColorStop(0, 'rgba(10, 10, 10, 1)');
            coreGradient.addColorStop(0.7, 'rgba(30, 30, 40, 0.8)');
            coreGradient.addColorStop(1, 'rgba(40, 40, 50, 0)');
            
            ctx.beginPath();
            ctx.fillStyle = coreGradient;
            ctx.arc(centerX, centerY, coreSize, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    
    renderBlackHole: function(ctx, centerX, centerY, timestamp) {
        if (!this.blackHoleEffects) {
            // If no effects are initialized yet, initialize them
            this.evolveToBlackHole();
            return;
        }
        
        // Rotate the black hole
        this.blackHoleRotation += 0.0005 * (timestamp % 100);
        
        // Draw the outer glow (ambient light distortion)
        const outerGlow = ctx.createRadialGradient(
            centerX, centerY, 30,
            centerX, centerY, 300
        );
        outerGlow.addColorStop(0, 'rgba(20, 20, 30, 0.7)');
        outerGlow.addColorStop(0.4, 'rgba(20, 20, 40, 0.3)');
        outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = outerGlow;
        ctx.arc(centerX, centerY, 300, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw the accretion disk
        ctx.save();
        ctx.translate(centerX, centerY);
        
        // Sort particles by distance for proper rendering order
        this.blackHoleEffects.accretionDisk.sort((a, b) => b.distance - a.distance);
        
        // Draw the back of the accretion disk
        for (let i = 0; i < this.blackHoleEffects.accretionDisk.length; i++) {
            const particle = this.blackHoleEffects.accretionDisk[i];
            
            // Update particle position
            particle.angle += particle.orbitSpeed * (timestamp % 100);
            
            // Determine if the particle is on the "far side" of the accretion disk
            const sineAngle = Math.sin(particle.angle);
            
            // Only draw particles on the back side (negative y)
            if (sineAngle < 0) {
                const x = Math.cos(particle.angle + this.blackHoleRotation) * particle.distance;
                const y = sineAngle * particle.distance * 0.3; // Flatten the disk
                
                ctx.beginPath();
                ctx.fillStyle = particle.color;
                ctx.arc(x, y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Draw the radiation jets
        this.updateRadiationJets(timestamp);
        this.drawRadiationJet(ctx, 0, -1, this.blackHoleEffects.radiationJets.top.length, 'rgba(100, 100, 255, 0.7)');
        this.drawRadiationJet(ctx, 0, 1, this.blackHoleEffects.radiationJets.bottom.length, 'rgba(100, 100, 255, 0.7)');
        
        // Draw the event horizon (black hole itself)
        const eventHorizonGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 50);
        eventHorizonGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        eventHorizonGradient.addColorStop(0.7, 'rgba(10, 10, 20, 1)');
        eventHorizonGradient.addColorStop(0.9, 'rgba(20, 20, 40, 0.8)');
        eventHorizonGradient.addColorStop(1, 'rgba(30, 30, 60, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = eventHorizonGradient;
        ctx.arc(0, 0, 50, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw the front of the accretion disk
        for (let i = 0; i < this.blackHoleEffects.accretionDisk.length; i++) {
            const particle = this.blackHoleEffects.accretionDisk[i];
            
            // Only draw particles on the front side (positive y)
            const sineAngle = Math.sin(particle.angle);
            if (sineAngle >= 0) {
                const x = Math.cos(particle.angle + this.blackHoleRotation) * particle.distance;
                const y = sineAngle * particle.distance * 0.3; // Flatten the disk
                
                ctx.beginPath();
                ctx.fillStyle = particle.color;
                ctx.arc(x, y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Draw gravitational lensing effect
        ctx.beginPath();
        ctx.arc(0, 0, 70, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(100, 100, 200, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(0, 0, 100, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(80, 80, 150, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        ctx.restore();
        
        // Occasionally generate light particles that get pulled into the black hole
        if (Math.random() < 0.05) {
            this.generateLightParticleTowardBlackHole();
        }
        
        // Draw the light particles being pulled in
        this.updateAndDrawLightParticles(ctx, centerX, centerY, timestamp);
    },
    
    // Helper function for the black hole's radiation jets
    updateRadiationJets: function(timestamp) {
        // Pulsate the jets
        const pulseFactor = Math.sin(timestamp * 0.001) * 0.2 + 0.8;
        
        // Update top jet
        const targetLengthTop = this.blackHoleEffects.radiationJets.top.maxLength * pulseFactor;
        this.blackHoleEffects.radiationJets.top.length += 
            (targetLengthTop - this.blackHoleEffects.radiationJets.top.length) * 0.05;
        
        // Update bottom jet
        const targetLengthBottom = this.blackHoleEffects.radiationJets.bottom.maxLength * pulseFactor;
        this.blackHoleEffects.radiationJets.bottom.length += 
            (targetLengthBottom - this.blackHoleEffects.radiationJets.bottom.length) * 0.05;
    },
    
    // Helper function to draw the jets
    drawRadiationJet: function(ctx, x, yDirection, length, color) {
        const jetWidth = 20;
        
        // Create gradient for the jet
        const jetGradient = ctx.createLinearGradient(
            x, 0,
            x, yDirection * length
        );
        jetGradient.addColorStop(0, color);
        jetGradient.addColorStop(1, 'rgba(50, 50, 150, 0)');
        
        // Draw the jet
        ctx.beginPath();
        ctx.moveTo(x - jetWidth, 0);
        ctx.lineTo(x + jetWidth, 0);
        ctx.lineTo(x + jetWidth * 0.5, yDirection * length);
        ctx.lineTo(x - jetWidth * 0.5, yDirection * length);
        ctx.closePath();
        ctx.fillStyle = jetGradient;
        ctx.fill();
    },
    
    // Generate a light particle that gets pulled into the black hole
    generateLightParticleTowardBlackHole: function() {
        // If this is the first particle, initialize the array
        if (!this.lightParticles) {
            this.lightParticles = [];
        }
        
        // Generate particle at a random position on the edge of the screen
        const angle = Math.random() * Math.PI * 2;
        const distance = 400; // Start from outside the visible area
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        // Calculate direction toward black hole
        const dirX = -x / distance;
        const dirY = -y / distance;
        
        // Add some randomness to the direction
        const randomFactor = 0.2;
        const vx = dirX + (Math.random() * randomFactor - randomFactor/2);
        const vy = dirY + (Math.random() * randomFactor - randomFactor/2);
        
        // Create particle
        this.lightParticles.push({
            x: x,
            y: y,
            vx: vx * 0.5,
            vy: vy * 0.5,
            lifespan: 200 + Math.random() * 200,
            age: 0,
            color: `hsl(${180 + Math.random() * 60}, 70%, 70%)`,
            size: 1 + Math.random() * 2
        });
    },
    
    // Update and draw light particles
    updateAndDrawLightParticles: function(ctx, centerX, centerY, timestamp) {
        if (!this.lightParticles) return;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        
        for (let i = this.lightParticles.length - 1; i >= 0; i--) {
            const particle = this.lightParticles[i];
            
            // Update age and check if the particle should be removed
            particle.age++;
            if (particle.age > particle.lifespan) {
                this.lightParticles.splice(i, 1);
                continue;
            }
            
            // Calculate distance to center (black hole)
            const distSq = particle.x * particle.x + particle.y * particle.y;
            const dist = Math.sqrt(distSq);
            
            if (dist < 30) {
                // Particle reached the black hole, remove it
                this.lightParticles.splice(i, 1);
                continue;
            }
            
            // Calculate gravitational pull
            if (dist > 0) {
                const pullFactor = 30 / distSq; // Stronger pull as particles get closer
                const dirX = -particle.x / dist;
                const dirY = -particle.y / dist;
                
                // Apply gravitational acceleration
                particle.vx += dirX * pullFactor * 0.1;
                particle.vy += dirY * pullFactor * 0.1;
            }
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Calculate opacity based on age
            const opacity = particle.age < particle.lifespan * 0.2 
                ? particle.age / (particle.lifespan * 0.2)
                : 1 - ((particle.age - particle.lifespan * 0.2) / (particle.lifespan * 0.8));
            
            // Draw the particle
            ctx.beginPath();
            ctx.fillStyle = particle.color.replace(')', `, ${opacity})`).replace('hsl', 'hsla');
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw a trail
            const trailLength = Math.min(50, dist * 0.2);
            if (trailLength > 1) {
                ctx.beginPath();
                ctx.strokeStyle = particle.color.replace(')', `, ${opacity * 0.5})`).replace('hsl', 'hsla');
                ctx.lineWidth = particle.size * 0.7;
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(
                    particle.x - particle.vx * trailLength,
                    particle.y - particle.vy * trailLength
                );
                ctx.stroke();
            }
        }
        
        ctx.restore();
    },
    
    getClickHydrogenRate: function() {
        let baseRate = 0;
        switch(this.currentState) {
            case this.states.COSMIC_DUST:
                baseRate = 1;
                break;
            case this.states.PROTOSTAR:
                baseRate = 2;
                break;
            case this.states.RED_DWARF:
                baseRate = 3;
                break;
            case this.states.YELLOW_STAR:
                baseRate = 5;
                break;
            case this.states.BLUE_GIANT:
                baseRate = 10;
                break;
            case this.states.SUPERNOVA:
                baseRate = 20; // Higher base rate during supernova
                break;
            case this.states.BLACK_HOLE:
                baseRate = 30; // Highest base rate for black hole
                break;
            default:
                baseRate = 0;
        }
        
        // Apply regular and supernova boosts
        let finalRate = baseRate * this.clickHydrogenMultiplier;
        
        // Apply supernova boost if applicable
        if (this.currentState === this.states.SUPERNOVA || this.currentState === this.states.BLACK_HOLE) {
            finalRate *= this.supernovaBoostMultiplier;
        }
        
        return finalRate;
    },
    
    getClickHeliumRate: function() {
        let baseRate = 0;
        switch(this.currentState) {
            case this.states.COSMIC_DUST:
                baseRate = 0;
                break;
            case this.states.PROTOSTAR:
                baseRate = 0.5;
                break;
            case this.states.RED_DWARF:
                baseRate = 1;
                break;
            case this.states.YELLOW_STAR:
                baseRate = 2;
                break;
            case this.states.BLUE_GIANT:
                baseRate = 5;
                break;
            case this.states.SUPERNOVA:
                baseRate = 10; // Higher base rate during supernova
                break;
            case this.states.BLACK_HOLE:
                baseRate = 15; // Highest base rate for black hole
                break;
            default:
                baseRate = 0;
        }
        
        // Apply regular and supernova boosts
        let finalRate = baseRate * this.clickHeliumMultiplier;
        
        // Apply supernova boost if applicable
        if (this.currentState === this.states.SUPERNOVA || this.currentState === this.states.BLACK_HOLE) {
            finalRate *= this.supernovaBoostMultiplier;
        }
        
        return finalRate;
    },
    
    getPassiveHydrogenRate: function() {
        let baseRate = 0;
        switch(this.currentState) {
            case this.states.COSMIC_DUST:
                baseRate = 0; // No passive generation
                break;
            case this.states.PROTOSTAR:
                baseRate = 0.5; // 0.5 per second
                break;
            case this.states.RED_DWARF:
                baseRate = 2; // 2 per second
                break;
            case this.states.YELLOW_STAR:
                baseRate = 5; // 5 per second
                break;
            case this.states.BLUE_GIANT:
                baseRate = 12; // 12 per second
                break;
            case this.states.SUPERNOVA:
                baseRate = 25; // 25 per second during supernova
                break;
            case this.states.BLACK_HOLE:
                baseRate = 40; // 40 per second for black hole
                break;
            default:
                baseRate = 0;
        }
        
        // Apply regular and supernova boosts
        let finalRate = baseRate * this.passiveHydrogenMultiplier;
        
        // Apply supernova boost if applicable
        if (this.currentState === this.states.SUPERNOVA || this.currentState === this.states.BLACK_HOLE) {
            finalRate *= this.supernovaBoostMultiplier;
        }
        
        return finalRate;
    },
    
    getPassiveHeliumRate: function() {
        let baseRate = 0;
        switch(this.currentState) {
            case this.states.COSMIC_DUST:
                baseRate = 0; // No passive generation
                break;
            case this.states.PROTOSTAR:
                baseRate = 0.1; // 0.1 per second
                break;
            case this.states.RED_DWARF:
                baseRate = 0.5; // 0.5 per second
                break;
            case this.states.YELLOW_STAR:
                baseRate = 1.5; // 1.5 per second
                break;
            case this.states.BLUE_GIANT:
                baseRate = 4; // 4 per second
                break;
            case this.states.SUPERNOVA:
                baseRate = 12; // 12 per second during supernova
                break;
            case this.states.BLACK_HOLE:
                baseRate = 20; // 20 per second for black hole
                break;
            default:
                baseRate = 0;
        }
        
        // Apply regular and supernova boosts
        let finalRate = baseRate * this.passiveHeliumMultiplier;
        
        // Apply supernova boost if applicable
        if (this.currentState === this.states.SUPERNOVA || this.currentState === this.states.BLACK_HOLE) {
            finalRate *= this.supernovaBoostMultiplier;
        }
        
        return finalRate;
    },
    
    // Methods to boost production rates (used by upgrades)
    boostClickHydrogenRate: function(multiplier) {
        this.clickHydrogenMultiplier *= multiplier;
    },
    
    boostClickHeliumRate: function(multiplier) {
        this.clickHeliumMultiplier *= multiplier;
    },
    
    boostPassiveHydrogenRate: function(multiplier) {
        this.passiveHydrogenMultiplier *= multiplier;
    },
    
    boostPassiveHeliumRate: function(multiplier) {
        this.passiveHeliumMultiplier *= multiplier;
    },
    
    resetToInitialState: function() {
        // Reset to cosmic dust state
        this.currentState = this.states.COSMIC_DUST;
        
        // Reset production multipliers
        this.clickHydrogenMultiplier = 1;
        this.clickHeliumMultiplier = 1;
        this.passiveHydrogenMultiplier = 1;
        this.passiveHeliumMultiplier = 1;
        this.supernovaBoostMultiplier = 1;
        
        // Reset animation-related properties
        this.supernovaEffects = null;
        this.blackHoleEffects = null;
        this.lightParticles = null;
        
        // Reset resources if needed (assuming Resources object exists)
        if (typeof Resources !== 'undefined') {
            Resources.hydrogen = 0;
            Resources.helium = 0;
        }
        
        // Update the UI to reflect reset state
        this.updateUI();
        
        // Show reset notification
        this.showEvolutionNotification("Game reset to initial state!");
    },
    
    getState: function() {
        return {
            currentState: this.currentState,
            clickHydrogenMultiplier: this.clickHydrogenMultiplier,
            clickHeliumMultiplier: this.clickHeliumMultiplier,
            passiveHydrogenMultiplier: this.passiveHydrogenMultiplier,
            passiveHeliumMultiplier: this.passiveHeliumMultiplier,
            supernovaBoostMultiplier: this.supernovaBoostMultiplier
        };
    },
    
    setState: function(state) {
        this.currentState = state.currentState || this.states.COSMIC_DUST;
        this.clickHydrogenMultiplier = state.clickHydrogenMultiplier || 1;
        this.clickHeliumMultiplier = state.clickHeliumMultiplier || 1;
        this.passiveHydrogenMultiplier = state.passiveHydrogenMultiplier || 1;
        this.passiveHeliumMultiplier = state.passiveHeliumMultiplier || 1;
        this.supernovaBoostMultiplier = state.supernovaBoostMultiplier || 1;
        
        // Reinitialize effects based on state
        if (this.currentState === this.states.SUPERNOVA) {
            // Initialize supernova effects
            this.supernovaEffects = {
                startTime: performance.now(),
                duration: 10000, 
                expandingRings: [],
                particles: [],
                phase: 'expanding'
            };
        } else if (this.currentState === this.states.BLACK_HOLE) {
            // Initialize black hole effects
            this.blackHoleEffects = {
                accretionDisk: [],
                radiationJets: {
                    top: { length: 0, maxLength: 300 },
                    bottom: { length: 0, maxLength: 300 }
                },
                gravitationalLensing: []
            };
            
            // Generate accretion disk particles
            for (let i = 0; i < 300; i++) {
                const distance = 40 + Math.random() * 100;
                const angle = Math.random() * Math.PI * 2;
                const orbitSpeed = 0.02 - (0.01 * (distance / 140));
                
                this.blackHoleEffects.accretionDisk.push({
                    distance: distance,
                    angle: angle,
                    orbitSpeed: orbitSpeed,
                    size: 1 + Math.random() * 2,
                    color: `hsl(${180 + Math.random() * 240}, ${70 + Math.random() * 30}%, ${40 + Math.random() * 60}%)`
                });
            }
        }
        
        this.updateUI();
    }
};