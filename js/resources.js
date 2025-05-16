// Resources.js - Handles game resources

const Resources = {
    hydrogen: 0,
    helium: 0,
    
    init: function() {
        this.updateUI();
    },
    
    addFromClick: function() {
        // Add resources based on click and current evolution state
        const hydrogenPerClick = Evolution.getClickHydrogenRate();
        const heliumPerClick = Evolution.getClickHeliumRate();
        
        this.hydrogen += hydrogenPerClick;
        this.helium += heliumPerClick;
        
        this.updateUI();
    },
    
    update: function(deltaTime) {
        // Add passive resources based on current evolution state
        const passiveHydrogen = Evolution.getPassiveHydrogenRate() * (deltaTime / 1000);
        const passiveHelium = Evolution.getPassiveHeliumRate() * (deltaTime / 1000);
        
        if (passiveHydrogen > 0 || passiveHelium > 0) {
            this.hydrogen += passiveHydrogen;
            this.helium += passiveHelium;
            this.updateUI();
        }
    },
    
    updateUI: function() {
        document.getElementById('hydrogen-counter').textContent = `Hydrogen: ${Math.floor(this.hydrogen)}`;
        document.getElementById('helium-counter').textContent = `Helium: ${Math.floor(this.helium)}`;
    },
    
    getState: function() {
        return {
            hydrogen: this.hydrogen,
            helium: this.helium
        };
    },
    
    setState: function(state) {
        this.hydrogen = state.hydrogen || 0;
        this.helium = state.helium || 0;
        this.updateUI();
    }
};