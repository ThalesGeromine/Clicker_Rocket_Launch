// Rocket Launch - A clicker game about tension and timing
// Goal: Maintain high power to clear the cockpit and launch

const state = {
    mode: 'ignite',              // Current mode: 'ignite' or 'refuel'
    power: 0,                    // 0-100: launch power, decays over time
    fuel: 100,                   // 0-100: fuel reserves, consumed in ignite mode
    cockpitClear: 0,            // 0-100: visibility progress, win condition
    gameWon: false,
    locked: false                // Locks input after win to prevent state corruption
};

// DOM cache - grab elements once at init for performance
const $ = {
    rocketContainer: document.getElementById('rocketContainer'),
    rocket: document.getElementById('rocket'),
    cockpit: document.getElementById('cockpit'),
    particles: document.getElementById('particles'),
    powerBar: document.getElementById('powerBar'),
    fuelBar: document.getElementById('fuelBar'),
    powerVal: document.getElementById('powerValue'),
    fuelVal: document.getElementById('fuelValue'),
    igniteBtn: document.getElementById('igniteBtn'),
    refuelBtn: document.getElementById('refuelBtn'),
    modal: document.getElementById('modalOverlay'),
    video: document.getElementById('launchVideo'),
    successMsg: document.getElementById('successMessage'),
    restartBtn: document.getElementById('restartBtn')
};

// Utility: clamp value between min and max bounds
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// Update all visual elements to match current state
function render() {
    $.powerBar.style.width = `${state.power}%`;
    $.fuelBar.style.width = `${state.fuel}%`;
    $.powerVal.textContent = `${Math.round(state.power)}%`;
    $.fuelVal.textContent = `${Math.round(state.fuel)}%`;
    // Cockpit opacity tied to clear progress - player sees visibility improve
    $.cockpit.style.opacity = state.cockpitClear / 100;
}

// Switch between ignite/refuel modes
// Also updates button states and body classes for custom cursors
function setMode(mode) {
    state.mode = mode;
    $.igniteBtn.classList.toggle('active', mode === 'ignite');
    $.refuelBtn.classList.toggle('active', mode === 'refuel');
    document.body.classList.toggle('ignite-mode', mode === 'ignite');
    document.body.classList.toggle('refuel-mode', mode === 'refuel');
}

// Create particle effect - flame or fuel droplets
// Uses CSS custom properties (--tx, --ty) to control animation direction
// This avoids JS-based animation calculations per frame
function spawnParticle(type) {
    const p = document.createElement('div');
    p.classList.add('particle', `${type}-particle`);
    
    // Random direction using polar coordinates - spreads particles naturally
    const angle = Math.random() * Math.PI * 2;
    const dist = 50 + Math.random() * 100;
    p.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
    p.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
    
    // Position at rocket base
    p.style.left = '50%';
    p.style.top = '70%';
    $.particles.appendChild(p);
    
    // Cleanup: remove from DOM after animation completes (matches CSS duration)
    setTimeout(() => p.remove(), 800);
}

// Quick shake feedback when clicking rocket in ignite mode
// Adds visual "impact" feel - important for game responsiveness
function shakeRocket() {
    $.rocketContainer.classList.add('shake');
    // Remove class after animation completes so it can be triggered again
    setTimeout(() => $.rocketContainer.classList.remove('shake'), 150);
}

// Core gameplay: handle rocket clicks based on current mode
// Ignite: gain power but burn fuel (risk/reward tradeoff)
// Refuel: restore fuel, no power change (strategic pause)
function handleClick() {
    if (state.locked) return;

    if (state.mode === 'ignite') {
        // Power gain: 5% with fuel, only 2% without (efficiency drops)
        // This creates urgency: player must manage fuel while building power
        const gain = state.fuel > 0 ? 5 : 2;
        state.power = clamp(state.power + gain, 0, 100);
        state.fuel = clamp(state.fuel - 5, 0, 100);
        
        // More flames when fuel exists - visual feedback for "good" state
        const count = state.fuel > 0 ? 3 : 1;
        for (let i = 0; i < count; i++) spawnParticle('flame');
        shakeRocket();
    } else {
        // Refuel mode: steady fuel recovery, no power change
        // Player uses this to recover before next power push
        state.fuel = clamp(state.fuel + 15, 0, 100);
        for (let i = 0; i < 2; i++) spawnParticle('fuel');
    }

    render();
}

// Main game loop - runs every second (1000ms)
// Handles passive decay and cockpit clearing mechanic
function tick() {
    if (state.locked) return;

    // Power decays 4% per second - creates time pressure
    // Player must click frequently to maintain threshold
    state.power = clamp(state.power - 4, 0, 100);

    // Cockpit clearing: requires sustained power at 95%+ 
    // This is the "tension cycle" - maintain pressure to win
    // Drops 20% per second if power drops below threshold
    if (state.power >= 95) {
        state.cockpitClear = clamp(state.cockpitClear + 20, 0, 100);
    } else {
        state.cockpitClear = clamp(state.cockpitClear - 20, 0, 100);
    }

    render();
    checkWin();
}

// Check if win condition is met
// Win = cockpit fully clear (100%)
function checkWin() {
    if (state.cockpitClear >= 100 && !state.gameWon) {
        state.gameWon = true;
        triggerWin();
    }
}

// Trigger win sequence: lock game, show video, display success
function triggerWin() {
    state.locked = true;
    $.modal.classList.add('active');
    
    // Autoplay may be blocked by browsers - catch error gracefully
    $.video.play().catch(() => {});
    
    // Show success message after video has played a bit
    setTimeout(() => {
        $.successMsg.classList.add('visible');
    }, 3000);
}

// Reset game to initial state for replayability
function restart() {
    state.power = 0;
    state.fuel = 100;
    state.cockpitClear = 0;
    state.gameWon = false;
    state.locked = false;
    state.mode = 'ignite';
    
    $.modal.classList.remove('active');
    $.successMsg.classList.remove('visible');
    $.video.pause();
    $.video.currentTime = 0;
    
    setMode('ignite');
    render();
}

// Initialize game: set up event listeners and start game loop
function init() {
    $.rocketContainer.addEventListener('click', handleClick);
    $.igniteBtn.addEventListener('click', () => setMode('ignite'));
    $.refuelBtn.addEventListener('click', () => setMode('refuel'));
    
    // Keyboard shortcuts: Z for ignite, X for refuel
    // Nice QoL feature for dedicated players
    document.addEventListener('keydown', e => {
        if (e.key.toLowerCase() === 'z') setMode('ignite');
        else if (e.key.toLowerCase() === 'x') setMode('refuel');
    });
    
    $.restartBtn.addEventListener('click', restart);
    
    setMode('ignite');
    render();
    setInterval(tick, 1000);
}

init();
