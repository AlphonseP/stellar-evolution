// Game.js - Main game controller

const Game = {
    canvas: null,
    ctx: null,
    width: 800,
    height: 600,
    lastTimestamp: 0,
    stars: [], // Background stars
    
    init: function() {
        // Initialize the game
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Create background stars
        this.generateStars(150);
        
        // Initialize sub-systems
        Resources.init();
        Evolution.init();
        
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
        // Update resources
        Resources.update(deltaTime);
        
        // Check for evolution
        Evolution.checkEvolution();
        
        // Update click animations
        Evolution.updateClickAnimations(deltaTime);
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
    
    saveGame: function() {
        const gameState = {
            resources: Resources.getState(),
            evolution: Evolution.getState()
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
                console.log('Game loaded successfully');
            }
        } catch (e) {
            console.error('Error loading game:', e);
        }
    }
};