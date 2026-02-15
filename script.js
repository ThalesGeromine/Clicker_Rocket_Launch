/* ==========================================
   ROCKET LAUNCH COUNTDOWN GAME - JAVASCRIPT
   ========================================== */

// ==========================================
// GAME STATE
// ==========================================
// Stores all mutable game data in a single object
const state = {
    currentMode: 'ignite',       // 'ignite' or 'refuel' - current game mode
    launchPower: 0,              // 0-100 - current launch power percentage
    fuelLevel: 100,              // 0-100 - current fuel percentage  
    fadeProgress: 0,             // 0-100 - cockpit overlay opacity (0=foggy, 100=clear)
    isEndingTriggered: false,    // prevents double win trigger
    isGameLocked: false          // locks game after win to prevent further actions
};

// ==========================================
// DOM ELEMENT REFERENCES
// ==========================================
// Cache all DOM elements for performance - avoids repeated getElementById calls
const elements = {
    rocketContainer: document.getElementById('rocketContainer'),  // Clickable rocket wrapper
    rocket: document.getElementById('rocket'),                    // Rocket image element
    cockpit: document.getElementById('cockpit'),                  // Cockpit overlay element
    particles: document.getElementById('particles'),              // Particle effects container
    powerBar: document.getElementById('powerBar'),                // Power bar fill element
    fuelBar: document.getElementById('fuelBar'),                  // Fuel bar fill element
    powerValue: document.getElementById('powerValue'),            // Power percentage text
    fuelValue: document.getElementById('fuelValue'),              // Fuel percentage text
    igniteBtn: document.getElementById('igniteBtn'),              // Ignite mode button
    refuelBtn: document.getElementById('refuelBtn'),              // Refuel mode button
    modalOverlay: document.getElementById('modalOverlay'),        // Win screen overlay
    launchVideo: document.getElementById('launchVideo'),          // Video player element
    successMessage: document.getElementById('successMessage'),    // Success text element
    restartBtn: document.getElementById('restartBtn')             // Play again button
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Clamps a value between min and max bounds
// Used to ensure power/fuel/fade stay within 0-100 range
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// ==========================================
// UI UPDATE FUNCTIONS
// ==========================================

// Updates all visual elements to reflect current game state
// Called after every action and game loop tick
function updateUI() {
    // Update power bar width
    elements.powerBar.style.width = `${state.launchPower}%`;
    // Update fuel bar width
    elements.fuelBar.style.width = `${state.fuelLevel}%`;
    // Update power percentage text (rounded)
    elements.powerValue.textContent = `${Math.round(state.launchPower)}%`;
    // Update fuel percentage text (rounded)
    elements.fuelValue.textContent = `${Math.round(state.fuelLevel)}%`;
    // Update cockpit opacity based on fade progress (0-100 -> 0-1)
    elements.cockpit.style.opacity = state.fadeProgress / 100;
}

// ==========================================
// MODE SWITCHING
// ==========================================

// Switches between 'ignite' and 'refuel' modes
// Updates state, button styles, and custom cursor
function setMode(mode) {
    // Update current mode in state
    state.currentMode = mode;
    
    // Toggle 'active' class on buttons (highlights selected button)
    elements.igniteBtn.classList.toggle('active', mode === 'ignite');
    elements.refuelBtn.classList.toggle('active', mode === 'refuel');
    
    // Toggle body classes for custom cursors
    document.body.classList.toggle('ignite-mode', mode === 'ignite');
    document.body.classList.toggle('refuel-mode', mode === 'refuel');
}

// ==========================================
// PARTICLE EFFECTS
// ==========================================

// Creates a visual particle effect (flame or fuel)
// Type: 'flame' for ignite mode, 'fuel' for refuel mode
function spawnParticle(type) {
    // Create new div element for particle
    const particle = document.createElement('div');
    // Add particle class and type-specific class (e.g., 'flame-particle')
    particle.classList.add('particle', `${type}-particle`);
    
    // Calculate random direction for particle to fly
    const angle = Math.random() * Math.PI * 2;           // Random angle 0-360 degrees
    const distance = 50 + Math.random() * 100;            // Random distance 50-150px
    const tx = Math.cos(angle) * distance;                // X translation
    const ty = Math.sin(angle) * distance;               // Y translation
    
    // Set CSS custom properties for animation direction
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);
    
    // Position particle at rocket center (bottom area)
    particle.style.left = '50%';
    particle.style.top = '70%';
    
    // Add particle to container
    elements.particles.appendChild(particle);
    
    // Remove particle from DOM after animation completes (800ms)
    setTimeout(() => {
        particle.remove();
    }, 800);
}

// ==========================================
// ROCKET ANIMATIONS
// ==========================================

// Triggers shake animation on rocket container
// Called when clicking rocket in ignite mode
function shakeRocket() {
    // Add shake class to trigger CSS animation
    elements.rocketContainer.classList.add('shake');
    
    // Remove shake class after animation completes (150ms)
    setTimeout(() => {
        elements.rocketContainer.classList.remove('shake');
    }, 150);
}

// ==========================================
// GAME ACTIONS
// ==========================================

// Handles rocket click based on current mode
// Main interaction - players click rocket to perform actions
function handleRocketClick() {
    // Don't process clicks if game is over
    if (state.isGameLocked) return;
    
    // IGNITE MODE: Clicking adds power, consumes fuel
    if (state.currentMode === 'ignite') {
        // Power gain: 5% if fuel exists, 2% if out of fuel
        const powerGain = state.fuelLevel > 0 ? 5 : 2;
        // Add power, clamp to 0-100
        state.launchPower = clamp(state.launchPower + powerGain, 0, 100);
        // Consume 5 fuel, clamp to 0-100
        state.fuelLevel = clamp(state.fuelLevel - 5, 0, 100);
        
        // Spawn particles: 3 if fuel exists, 1 if empty
        const particleCount = state.fuelLevel > 0 ? 3 : 1;
        for (let i = 0; i < particleCount; i++) {
            spawnParticle('flame');
        }
        
        // Shake the rocket
        shakeRocket();
    } 
    // REFUEL MODE: Clicking adds fuel, no power change
    else if (state.currentMode === 'refuel') {
        // Add 60 fuel, clamp to 0-100
        state.fuelLevel = clamp(state.fuelLevel + 15, 0, 100);
        
        // Spawn fuel particles
        for (let i = 0; i < 2; i++) {
            spawnParticle('fuel');
        }
    }
    
    // Update all UI elements to reflect changes
    updateUI();
}

// ==========================================
// GAME LOOP
// ==========================================

// Main game loop - runs every 1 second (1000ms)
// Handles passive decay and cockpit fade logic
function gameLoop() {
    // Don't run if game is over
    if (state.isGameLocked) return;
    
    // Decay: Power decreases by 4% every second
    state.launchPower = clamp(state.launchPower - 4, 0, 100);
    
    // Cockpit fade push-pull system
    // If power >= 95%: cockpit clears (fade increases)
    if (state.launchPower >= 95) {
        state.fadeProgress = clamp(state.fadeProgress + 20, 0, 100);
    } 
    // If power < 95%: fog returns (fade decreases)
    else {
        state.fadeProgress = clamp(state.fadeProgress - 20, 0, 100);
    }
    
    // Update UI with new values
    updateUI();
    
    // Check if win condition is met
    checkWinCondition();
}

// ==========================================
// WIN CONDITION
// ==========================================

// Checks if player has won (cockpit fully cleared)
// Called after each game loop tick
function checkWinCondition() {
    // Win if fade is 100% AND win hasn't been triggered yet
    if (state.fadeProgress >= 100 && !state.isEndingTriggered) {
        // Mark as triggered to prevent multiple wins
        state.isEndingTriggered = true;
        // Start win sequence
        triggerWin();
    }
}

// ==========================================
// WIN SEQUENCE
// ==========================================

// Handles the win sequence when player succeeds
// Locks game, shows video, displays success message
function triggerWin() {
    // Lock game to prevent further interactions
    state.isGameLocked = true;
    
    // Show modal overlay
    elements.modalOverlay.classList.add('active');
    
    // Attempt to play launch video
    // Autoplay may be blocked by browsers, so we catch the error
    elements.launchVideo.play().catch(() => {
        console.log('Video autoplay blocked');
    });
    
    // Show success message after 3 seconds (allows video to play)
    setTimeout(() => {
        elements.successMessage.classList.add('visible');
    }, 3000);
}

// ==========================================
// RESTART FUNCTIONALITY
// ==========================================

// Resets all game state to initial values
// Allows player to play again without refreshing page
function restartGame() {
    // Reset all state values to defaults
    state.launchPower = 0;
    state.fuelLevel = 100;
    state.fadeProgress = 0;
    state.isEndingTriggered = false;
    state.isGameLocked = false;
    state.currentMode = 'ignite';
    
    // Hide modal and success message
    elements.modalOverlay.classList.remove('active');
    elements.successMessage.classList.remove('visible');
    
    // Reset video to beginning
    elements.launchVideo.pause();
    elements.launchVideo.currentTime = 0;
    
    // Initialize UI in ignite mode
    setMode('ignite');
    updateUI();
}

// ==========================================
// INITIALIZATION
// ==========================================

// Sets up event listeners and starts the game
// Called once when page loads
function init() {
    // Add click handler to rocket container
    elements.rocketContainer.addEventListener('click', handleRocketClick);
    
    // Add click handlers to mode buttons
    elements.igniteBtn.addEventListener('click', () => setMode('ignite'));
    elements.refuelBtn.addEventListener('click', () => setMode('refuel'));
    
    // Add keyboard controls (Z and X keys)
    document.addEventListener('keydown', (e) => {
        // Press Z for ignite mode
        if (e.key.toLowerCase() === 'z') {
            setMode('ignite');
        }
        // Press X for refuel mode
        else if (e.key.toLowerCase() === 'x') {
            setMode('refuel');
        }
    });
    
    // Add click handler to restart button
    elements.restartBtn.addEventListener('click', restartGame);
    
    // Initialize UI in ignite mode
    setMode('ignite');
    updateUI();
    
    // Start the game loop - runs every 1000ms (1 second)
    setInterval(gameLoop, 1000);
}

// ==========================================
// AUTO-START
// ==========================================

// Initialize game when script loads
// This starts the game automatically
init();
