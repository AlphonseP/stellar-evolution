// upgrades.js - Handles star upgrades

const Upgrades = {
    availableUpgrades: [],
    purchasedUpgrades: [],
    
    init: function() {
        console.log("Upgrades system initialized");
    },
    
    checkAvailableUpgrades: function() {
        this.availableUpgrades = [];
        
        // Get current star state
        const currentState = Evolution.currentState;
        
        // Always check upgrades from all lower evolution stages
        this.checkCosmicDustUpgrades();
        
        // Check additional upgrades based on current state
        if (currentState === Evolution.states.PROTOSTAR || 
            currentState === Evolution.states.RED_DWARF || 
            currentState === Evolution.states.YELLOW_STAR || 
            currentState === Evolution.states.BLUE_GIANT) {
            this.checkProtostarUpgrades();
        }
        
        if (currentState === Evolution.states.RED_DWARF || 
            currentState === Evolution.states.YELLOW_STAR || 
            currentState === Evolution.states.BLUE_GIANT) {
            this.checkRedDwarfUpgrades();
        }
        
        if (currentState === Evolution.states.YELLOW_STAR || 
            currentState === Evolution.states.BLUE_GIANT) {
            this.checkYellowStarUpgrades();
        }
        
        if (currentState === Evolution.states.BLUE_GIANT) {
            this.checkBlueGiantUpgrades();
        }
        
        this.updateUI();
    },
    
    checkCosmicDustUpgrades: function() {
        // Dust gathering efficiency upgrade
        if (!this.hasUpgrade('dust_efficiency') && Resources.hydrogen >= 25) {
            this.addUpgrade('dust_efficiency', 'Dust Efficiency I', 
                            'Clicking generates 50% more hydrogen', 
                            { hydrogen: 25, helium: 0 }, 
                            function() {
                                // Apply the upgrade effect
                                const oldRate = Evolution.getClickHydrogenRate();
                                Evolution.boostClickHydrogenRate(1.5); // 50% increase
                                // Notify the player
                                Game.showNotification('Hydrogen per click increased from ' + 
                                                   oldRate + ' to ' + Evolution.getClickHydrogenRate());
                            });
        }
    },
    
    checkProtostarUpgrades: function() {
        // Keep one simple upgrade for now until we implement the new system
        if (!this.hasUpgrade('protostar_catalyst') && Resources.hydrogen >= 100 && Resources.helium >= 20) {
            this.addUpgrade('protostar_catalyst', 'Protostar Catalyst', 
                           'Enhances fusion processes, increasing all resource generation by 75%', 
                           { hydrogen: 100, helium: 20 }, 
                           function() {
                               Evolution.boostPassiveHydrogenRate(1.75);
                               Evolution.boostPassiveHeliumRate(1.75);
                               Evolution.boostClickHydrogenRate(1.75);
                               Evolution.boostClickHeliumRate(1.75);
                               Game.showNotification('All resource generation increased by 75%!');
                           });
        }
    },
    
    checkRedDwarfUpgrades: function() {
        // One condensed upgrade for Red Dwarf
        if (!this.hasUpgrade('red_dwarf_stability') && Resources.hydrogen >= 250 && Resources.helium >= 75) {
            this.addUpgrade('red_dwarf_stability', 'Red Dwarf Stabilization', 
                           'Optimizes the stable fusion process of red dwarfs, doubling all production', 
                           { hydrogen: 250, helium: 75 }, 
                           function() {
                               Evolution.boostPassiveHydrogenRate(2);
                               Evolution.boostPassiveHeliumRate(2);
                               Evolution.boostClickHydrogenRate(2);
                               Evolution.boostClickHeliumRate(2);
                               Game.showNotification('All resource production doubled!');
                           });
        }
    },
    
    checkYellowStarUpgrades: function() {
        // One consolidated upgrade for Yellow Star
        if (!this.hasUpgrade('yellow_star_mastery') && Resources.hydrogen >= 400 && Resources.helium >= 200) {
            this.addUpgrade('yellow_star_mastery', 'Yellow Star Mastery', 
                           'Master the balanced energy output of a yellow star, doubling all production', 
                           { hydrogen: 400, helium: 200 }, 
                           function() {
                               Evolution.boostPassiveHydrogenRate(2);
                               Evolution.boostPassiveHeliumRate(2);
                               Evolution.boostClickHydrogenRate(2);
                               Evolution.boostClickHeliumRate(2);
                               Game.showNotification('All production rates doubled!');
                           });
        }
    },
    
    checkBlueGiantUpgrades: function() {
        // One powerful upgrade for Blue Giant
        if (!this.hasUpgrade('blue_giant_intensity') && Resources.hydrogen >= 600 && Resources.helium >= 350) {
            this.addUpgrade('blue_giant_intensity', 'Blue Giant Intensity', 
                           'Harness the immense power of a Blue Giant, tripling all resource production', 
                           { hydrogen: 600, helium: 350 }, 
                           function() {
                               Evolution.boostPassiveHydrogenRate(3);
                               Evolution.boostPassiveHeliumRate(3);
                               Evolution.boostClickHydrogenRate(3);
                               Evolution.boostClickHeliumRate(3);
                               Game.showNotification('All production tripled!');
                           });
        }
    },
    
    // Helper function to add a new upgrade
    addUpgrade: function(id, name, description, cost, action) {
        this.availableUpgrades.push({
            id: id,
            name: name,
            description: description,
            cost: cost,
            action: function() {
                // Check if player has enough resources
                if (Resources.hydrogen >= cost.hydrogen && Resources.helium >= cost.helium) {
                    // Deduct the cost
                    Resources.hydrogen -= cost.hydrogen;
                    Resources.helium -= cost.helium;
                    Resources.updateUI();
                    
                    // Add to purchased upgrades
                    Upgrades.purchasedUpgrades.push(id);
                    
                    // Execute the upgrade action
                    action();
                    
                    // Update the UI
                    Upgrades.checkAvailableUpgrades();
                } else {
                    Game.showNotification('Not enough resources for this upgrade!');
                }
            }
        });
    },
    
    // Check if an upgrade has been purchased
    hasUpgrade: function(id) {
        return this.purchasedUpgrades.includes(id);
    },
    
    updateUI: function() {
        let panel = document.getElementById('upgrade-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'upgrade-panel';
            
            // Better styling
            panel.style.position = 'absolute';
            panel.style.top = '100px';
            panel.style.right = '20px';
            panel.style.width = '250px';
            panel.style.padding = '15px';
            panel.style.backgroundColor = 'rgba(20, 20, 40, 0.9)';
            panel.style.color = '#e0e0ff';
            panel.style.borderRadius = '8px';
            panel.style.zIndex = '100';
            panel.style.fontFamily = 'Arial, sans-serif';
            panel.style.maxHeight = '400px';
            panel.style.overflowY = 'auto';
            panel.style.boxShadow = '0 0 10px rgba(100, 100, 255, 0.5)';
            
            document.body.appendChild(panel);
        }
        
        panel.innerHTML = '<h3 style="margin-top:0;text-align:center;color:#9090ff">Star Upgrades</h3>';
        
        if (this.availableUpgrades.length === 0) {
            panel.innerHTML += '<p style="text-align:center;color:#7070a0">No upgrades available</p>';
        } else {
            this.availableUpgrades.forEach(upgrade => {
                const div = document.createElement('div');
                div.style.backgroundColor = 'rgba(40, 40, 80, 0.8)';
                div.style.margin = '8px 0';
                div.style.padding = '10px';
                div.style.borderRadius = '6px';
                div.style.cursor = 'pointer';
                div.style.transition = 'all 0.2s ease';
                div.style.borderLeft = '3px solid #5050a0';
                
                // Add hover effect
                div.onmouseover = function() {
                    this.style.backgroundColor = 'rgba(60, 60, 100, 0.8)';
                    this.style.borderLeft = '3px solid #7070c0';
                };
                div.onmouseout = function() {
                    this.style.backgroundColor = 'rgba(40, 40, 80, 0.8)';
                    this.style.borderLeft = '3px solid #5050a0';
                };
                
                // Check if player has enough resources
                const canAfford = Resources.hydrogen >= upgrade.cost.hydrogen && 
                                 Resources.helium >= upgrade.cost.helium;
                
                div.innerHTML = `
                    <strong style="color:#a0a0ff">${upgrade.name}</strong><br>
                    <span style="color:#d0d0ff;font-size:13px">${upgrade.description}</span><br>
                    <small style="color:${canAfford ? '#80ff80' : '#ff8080'}">
                        Cost: ${upgrade.cost.hydrogen} Hydrogen, ${upgrade.cost.helium} Helium
                    </small>
                `;
                
                if (!canAfford) {
                    div.style.opacity = '0.7';
                    div.style.cursor = 'not-allowed';
                }
                
                div.onclick = function() {
                    if (canAfford) {
                        console.log('Purchased upgrade:', upgrade.id);
                        upgrade.action();
                    } else {
                        Game.showNotification('Not enough resources for this upgrade!');
                    }
                };
                
                panel.appendChild(div);
            });
        }
    },
    
    getState: function() {
        return {
            purchasedUpgrades: this.purchasedUpgrades
        };
    },
    
    setState: function(state) {
        this.purchasedUpgrades = state.purchasedUpgrades || [];
    }
};