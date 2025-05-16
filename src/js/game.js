// src/js/game.js
console.log('Game initializing...');

// Basic game initialization
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, starting game setup');
  
  // We'll add more game code later
  const gameContainer = document.getElementById('game-container');
  
  if (gameContainer) {
    gameContainer.innerHTML += '<div>Stellar Evolution: Click to begin!</div>';
    
    gameContainer.addEventListener('click', () => {
      console.log('Game clicked!');
    });
  }
});