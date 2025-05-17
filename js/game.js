// Game.js - Main game controller

const Game = {
    canvas: null,
    ctx: null,
    width: 800,
    height: 600,
    lastTimestamp: 0,
    stars: [], // Background stars
    
    // Debug mode settings
    debug: {
        enabled: false,
        speedMultiplier: 1,
        
        // Toggle the debug panel
        togglePanel: function() {
            this.enabled = !this.enabled;
            this.updateUI();
            Game.showNotification(this.enabled ? 'Debug mode enabled' : 'Debug mode disabled');
        },
        
        // Add resources quickly
        addHydrogen: function(amount) {
            Resources.hydrogen += amount;
            Resources.updateUI();
            Game.showNotification(`Added ${amount} hydrogen`);
        },
        
        addHelium: function(amount) {
            Resources.helium += amount;
            Resources.updateUI();
            Game.showNotification(`Added ${amount} helium`);
        },
        
        // Set game speed multiplier
        setSpeed: function(multiplier) {
            this.speedMultiplier = multiplier;
            Game.showNotification(`Game speed set to ${multiplier}x`);
        },
        
        // Evolve to next state instantly
        evolveToNext: function() {
            const currentState = Evolution.currentState;
            
            if (currentState === Evolution.states.COSMIC_DUST) {
                Evolution.evolveToProtostar();
            } else if (currentState === Evolution.states.PROTOSTAR) {
                Evolution.evolveToRedDwarf();
            } else if (currentState === Evolution.states.RED_DWARF) {
                Evolution.evolveToYellowStar();
            } else if (currentState === Evolution.states.YELLOW_STAR) {
                Evolution.evolveToBlueGiant();
            } else if (currentState === Evolution.states.BLUE_GIANT) {
                Evolution.evolveToSupernova();
                Game.showNotification("Evolving to Supernova!");
            } else if (currentState === Evolution.states.SUPERNOVA) {
                Evolution.evolveToBlackHole();
                Game.showNotification("Evolving to Black Hole!");
            } else {
                Game.showNotification('Already at highest evolution state');
            }
        },
        
        // Update the debug panel UI
        updateUI: function() {
            let panel = document.getElementById('debug-panel');
            
            if (this.enabled) {
                if (!panel) {
                    panel = document.createElement('div');
                    panel.id = 'debug-panel';
                    
                    // Style the panel
                    panel.style.position = 'absolute';
                    panel.style.bottom = '20px';
                    panel.style.left = '20px';
                    panel.style.width = '280px';
                    panel.style.padding = '15px';
                    panel.style.backgroundColor = 'rgba(20, 20, 20, 0.9)';
                    panel.style.color = '#ff5555';
                    panel.style.borderRadius = '8px';
                    panel.style.zIndex = '200';
                    panel.style.fontFamily = 'Arial, sans-serif';
                    panel.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.3)';
                    
                    document.body.appendChild(panel);
                }
                
                // Update panel content
                panel.innerHTML = `
                    <h3 style="margin-top:0;color:#ff7777;text-align:center">⚠️ DEBUG PANEL ⚠️</h3>
                    
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
                        <button id="debug-add-h-10" style="padding:5px">+10 Hydrogen</button>
                        <button id="debug-add-h-100" style="padding:5px">+100 Hydrogen</button>
                        <button id="debug-add-he-10" style="padding:5px">+10 Helium</button>
                        <button id="debug-add-he-100" style="padding:5px">+100 Helium</button>
                    </div>
                    
                    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px">
                        <button id="debug-speed-1" style="padding:5px">1x Speed</button>
                        <button id="debug-speed-2" style="padding:5px">2x Speed</button>
                        <button id="debug-speed-5" style="padding:5px">5x Speed</button>
                    </div>
                    
                    <button id="debug-evolve" style="width:100%;padding:8px;margin-top:5px">
                        Evolve to Next Stage
                    </button>
                    
                    <button id="debug-toggle" style="width:100%;padding:8px;margin-top:15px;background:#550000;color:#ffffff;border:none;border-radius:4px">
                        Hide Debug Panel
                    </button>
                `;
                
                // Add event listeners
                document.getElementById('debug-add-h-10').onclick = () => this.addHydrogen(10);
                document.getElementById('debug-add-h-100').onclick = () => this.addHydrogen(100);
                document.getElementById('debug-add-he-10').onclick = () => this.addHelium(10);
                document.getElementById('debug-add-he-100').onclick = () => this.addHelium(100);
                
                document.getElementById('debug-speed-1').onclick = () => this.setSpeed(1);
                document.getElementById('debug-speed-2').onclick = () => this.setSpeed(2);
                document.getElementById('debug-speed-5').onclick = () => this.setSpeed(5);
                
                document.getElementById('debug-evolve').onclick = () => this.evolveToNext();
                document.getElementById('debug-toggle').onclick = () => this.togglePanel();
                
            } else if (panel) {
                // Hide the panel
                panel.remove();
                
                // Add a small button to re-enable
                let toggleBtn = document.getElementById('debug-toggle-mini');
                if (!toggleBtn) {
                    toggleBtn = document.createElement('button');
                    toggleBtn.id = 'debug-toggle-mini';
                    toggleBtn.textContent = '🐞';
                    toggleBtn.title = 'Enable Debug Mode';
                    toggleBtn.style.position = 'absolute';
                    toggleBtn.style.bottom = '10px';
                    toggleBtn.style.left = '10px';
                    toggleBtn.style.width = '30px';
                    toggleBtn.style.height = '30px';
                    toggleBtn.style.borderRadius = '50%';
                    toggleBtn.style.backgroundColor = 'rgba(40, 40, 40, 0.7)';
                    toggleBtn.style.color = '#ff5555';
                    toggleBtn.style.border = '1px solid #ff3333';
                    toggleBtn.style.fontSize = '16px';
                    toggleBtn.style.cursor = 'pointer';
                    toggleBtn.style.zIndex = '200';
                    
                    toggleBtn.onclick = () => this.togglePanel();
                    document.body.appendChild(toggleBtn);
                }
            }
        }
    },
    
    init: function() {
        // Initialize the game
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Create background stars
        this.generateStars(150);
        
        // Initialize sub-systems
        Resources.init();
        Evolution.init();
        Upgrades.init();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Try to load saved game
        this.loadGame();
        
        // Start the game loop
        requestAnimationFrame(this.gameLoop.bind(this));
        
        console.log("Game initialized successfully");
    },
    
    generateStars: function(count) {
        this.stars = [];
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2 + 0.5,
                brightness: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.03 + 0.005
            });
        }
    },
    
setupEventListeners: function() {
    // Set up clicking on the canvas
    this.canvas.addEventListener('click', this.handleClick.bind(this));
    
    // Set up save button
    document.getElementById('save-button').addEventListener('click', this.saveGame.bind(this));
    
    // Set up reset button
    document.getElementById('reset-button').addEventListener('click', this.resetGame.bind(this));
    
    // Set up star type selector
    document.getElementById('set-star-type').addEventListener('click', function() {
        const selectedType = document.getElementById('star-type-select').value;
        
        // Manually set the evolution state
        switch(selectedType) {
            case 'cosmic_dust':
                Evolution.currentState = Evolution.states.COSMIC_DUST;
                break;
            case 'protostar':
                Evolution.currentState = Evolution.states.PROTOSTAR;
                break;
            case 'red_dwarf':
                Evolution.currentState = Evolution.states.RED_DWARF;
                break;
            case 'yellow_star':
                Evolution.currentState = Evolution.states.YELLOW_STAR;
                break;
            case 'blue_giant':
                Evolution.currentState = Evolution.states.BLUE_GIANT;
                break;
        }
        
        // Update the UI to reflect the new state
        Evolution.updateUI();
    });
    
    // Add keyboard shortcut for debug mode (press D)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'd' || event.key === 'D') {
            this.debug.togglePanel();
        }
    });
},
    
    handleClick: function(event) {
        // Get click position relative to canvas
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Check if click is on the cosmic dust/star
        if (this.isClickOnCelestialObject(x, y)) {
            Resources.addFromClick();
            Evolution.animateClick(x, y);
        }
    },
    
    isClickOnCelestialObject: function(x, y) {
        // Consider the center area as clickable
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = Evolution.getCurrentObjectRadius();
        
        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        return distance <= radius;
    },
    
    gameLoop: function(timestamp) {
        // Calculate delta time
        const deltaTime = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;
        
        // Update game state
        this.update(deltaTime);
        
        // Render the game
        this.render(timestamp);
        
        // Continue the loop
        requestAnimationFrame(this.gameLoop.bind(this));
    },
    
update: function(deltaTime) {
    // Apply debug speed multiplier if enabled
    if (this.debug.enabled && this.debug.speedMultiplier > 1) {
        deltaTime *= this.debug.speedMultiplier;
    }
    
    // Update resources
    Resources.update(deltaTime);
    
    // Add debug logging
    console.log(`Resources - H: ${Math.floor(Resources.hydrogen)}, He: ${Math.floor(Resources.helium)}`);
    
    // Check for evolution
    Evolution.checkEvolution();
    
    // Update click animations
    Evolution.updateClickAnimations(deltaTime);
    
    // Check for available upgrades every 2 seconds
    this.upgradeCheckTimer = (this.upgradeCheckTimer || 0) + deltaTime;
    if (this.upgradeCheckTimer > 2000) {
        Upgrades.checkAvailableUpgrades();
        this.upgradeCheckTimer = 0;
    }
},
    
    render: function(timestamp) {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw background
        this.drawBackground(timestamp);
        
        // Draw the current celestial object
        Evolution.renderCurrentState(this.ctx, timestamp);
        
        // Draw click animations
        Evolution.renderClickAnimations(this.ctx);
    },
    
    drawBackground: function(timestamp) {
        // Space background
        this.ctx.fillStyle = '#000020';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw stars with twinkling effect
        for (let star of this.stars) {
            // Create twinkling effect
            const twinkle = Math.sin(timestamp * star.twinkleSpeed) * 0.3 + 0.7;
            const alpha = star.brightness * twinkle;
            
            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    },
    
    // Show a notification to the player
    showNotification: function(message) {
        // Create a notification element if it doesn't exist
        let notification = document.getElementById('game-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'game-notification';
            
            // Style the notification
            notification.style.position = 'absolute';
            notification.style.bottom = '20px';
            notification.style.left = '50%';
            notification.style.transform = 'translateX(-50%)';
            notification.style.backgroundColor = 'rgba(20, 20, 50, 0.9)';
            notification.style.color = '#fff';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '5px';
            notification.style.fontFamily = 'Arial, sans-serif';
            notification.style.fontSize = '16px';
            notification.style.fontWeight = 'bold';
            notification.style.boxShadow = '0 0 10px rgba(100, 100, 255, 0.7)';
            notification.style.zIndex = '1000';
            notification.style.transition = 'opacity 0.3s ease-in-out';
            
            document.body.appendChild(notification);
        }
        
        // Set the message
        notification.textContent = message;
        notification.style.opacity = '1';
        
        // Hide after 3 seconds
        clearTimeout(this.notificationTimeout);
        this.notificationTimeout = setTimeout(() => {
            notification.style.opacity = '0';
        }, 3000);
    },
    
    saveGame: function() {
        const gameState = {
            resources: Resources.getState(),
            evolution: Evolution.getState(),
            upgrades: Upgrades.getState()
        };
        
        try {
            localStorage.setItem('stellarEvolution', JSON.stringify(gameState));
            console.log('Game saved successfully');
            // Visual feedback for save
            const saveButton = document.getElementById('save-button');
            saveButton.textContent = 'Saved!';
            saveButton.disabled = true;
            setTimeout(() => {
                saveButton.textContent = 'Save Game';
                saveButton.disabled = false;
            }, 2000);
        } catch (e) {
            console.error('Error saving game:', e);
        }
    },
    
    loadGame: function() {
        try {
            const savedState = localStorage.getItem('stellarEvolution');
            if (savedState) {
                const gameState = JSON.parse(savedState);
                Resources.setState(gameState.resources);
                Evolution.setState(gameState.evolution);
                if (gameState.upgrades) {
                    Upgrades.setState(gameState.upgrades);
                }
                console.log('Game loaded successfully');
            }
        } catch (e) {
            console.error('Error loading game:', e);
        }
    },
    
    resetGame: function() {
        // Reset the game state
        Evolution.resetToInitialState();
        Resources.hydrogen = 0;
        Resources.helium = 0;
        Resources.updateUI();
        
        // Reset upgrades
        if (typeof Upgrades !== 'undefined') {
            Upgrades.purchasedUpgrades = [];
            Upgrades.checkAvailableUpgrades();
        }
        
        // Clear saved game from local storage
        try {
            localStorage.removeItem('stellarEvolution');
            console.log('Game reset successfully');
            
            // Visual feedback for reset
            const resetButton = document.getElementById('reset-button');
            resetButton.textContent = 'Game Reset!';
            setTimeout(() => {
                resetButton.textContent = 'Reset Game';
            }, 2000);
        } catch (e) {
            console.error('Error clearing saved game:', e);
        }
    }
};