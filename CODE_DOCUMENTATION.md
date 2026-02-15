# Rocket Launch Countdown Game - Code Documentation

## File Structure Overview

```
/project-root/
├── index.html              # ~88 lines  - HTML structure
├── style.css               # ~420 lines - CSS styling
├── script.js               # 176 lines  - Game logic
├── CODE_DOCUMENTATION.md   # This file
└── assets/                 # Images and video
    ├── rocket.png
    ├── cockpit.png
    ├── final_video.mp4
    ├── ignite.png
    └── refuel.png
```

---

## Part 1: HTML Structure (`index.html`)

| Line(s) | Element | Purpose |
|---------|---------|---------|
| 1-2 | Comments | File description |
| 4 | `<!DOCTYPE html>` | HTML5 document type |
| 5-14 | `<head>` | Meta tags, title, CSS link |
| 15-66 | `.game-container` | Main game area |
| 17-19 | `.game-title` | "Click to launch the rocket" title |
| 20-37 | `.bars-container` | Holds progress bars (Launch Power, Fuel) |
| 39-47 | `.rocket-container` | Rocket image + cockpit overlay + particles |
| 49-59 | `.buttons-container` | Mode switch buttons (Ignite/Refuel) |
| 61-64 | `.instructions` | Player instructions |
| 67-82 | `.modal-overlay` | Win screen with video |
| 85 | `<script>` | JS file inclusion |

---

## Part 2: CSS Styling (`style.css`)

### Sections:

| Lines | Section | Description |
|-------|---------|-------------|
| 1-6 | Reset | Global margin/padding reset, box-sizing |
| 8-17 | Body | Deep space gradient background, centered flex layout |
| 19-71 | Stars | Fixed background with CSS-generated star field + twinkle animation |
| 73-81 | Game container | Flex column, centered, max-width 600px |
| 83-91 | Game title | "Click to launch the rocket" styling with yellow glow |
| 93-100 | Bars container | Holds both progress bars |
| 102-133 | Bar styling | Labels, containers, fills (orange=power, cyan=fuel), glow effects |
| 135-186 | Rocket | Container (200x300px), shake animation, rocket image (scale 1), cockpit (scale 1.8), drop-shadow |
| 188-199 | Cockpit | Absolute overlay, starts at opacity 0, fade transition, scale 1.8 for dramatic reveal |
| 201-238 | Particles | Particle container, flame/fuel particle styles, fly animation |
| 240-260 | Buttons | Ignite (orange) and Refuel (cyan) button styling, active states |
| 262-270 | Instructions | Help text styling |
| 272-417 | Modal | Win screen overlay with fade-in, video player, success message, restart button |
| 419-465 | Custom cursors | ignite.png/refuel.png cursor states |
| 467-510 | Media queries | Mobile responsive adjustments (200x300px on mobile) |

### Key CSS Techniques Used:

- **CSS gradients** for bars and buttons
- **CSS custom properties** (`--tx`, `--ty`) for particle animation direction
- **Box-shadow glow** for neon effect
- **CSS keyframe animations** for stars, shake, particles
- **Flexbox** for responsive layout
- **Opacity transitions** for modal and video fade-in

---

## Part 3: JavaScript Logic (`script.js`)

### State Variables

```javascript
state = {
    currentMode: 'ignite',      // 'ignite' or 'refuel' - current game mode
    launchPower: 0,             // 0-100 - current launch power percentage
    fuelLevel: 100,             // 0-100 - current fuel percentage
    fadeProgress: 0,            // 0-100 - cockpit overlay opacity (0=foggy, 100=clear)
    isEndingTriggered: false,  // prevents double win trigger
    isGameLocked: false        // locks game after win to prevent further actions
}
```

### DOM References

Caches all DOM elements for performance - avoids repeated `document.getElementById()` calls.

### Core Functions:

| Function | Purpose |
|----------|---------|
| `clamp()` | Utility - clamps value between min/max |
| `updateUI()` | Updates bars, text values, cockpit opacity |
| `setMode()` | Switches between ignite/refuel, toggles CSS classes |
| `spawnParticle()` | Creates flame/fuel particles with random direction |
| `shakeRocket()` | Adds shake class, removes after 150ms |
| `handleRocketClick()` | Main game action - ignite: +5% power/-5% fuel, refuel: +15% fuel |
| `gameLoop()` | Runs every 1 second: -4% power, fade +/-20% based on 95% threshold |
| `checkWinCondition()` | Triggers win if fadeProgress >= 100 |
| `triggerWin()` | Locks game, shows modal with fade-in, plays video, shows success after 3s |
| `restartGame()` | Resets all state, hides modal, restarts game |
| `init()` | Sets up event listeners, initializes UI, starts game loop |

### Event Handling:

| Event | Action |
|-------|--------|
| Click rocket | Execute mode-specific action |
| Click Ignite button | Switch to ignite mode |
| Click Refuel button | Switch to refuel mode |
| Press Z key | Switch to ignite mode |
| Press X key | Switch to refuel mode |
| Click Restart | Reset game |
| setInterval (1s) | Run game loop |

---

## Implementation Notes

### Game Mechanics Implemented:

1. **Ignite Mode**: Click rocket → +5% power, -5% fuel (or +2% if no fuel)
2. **Refuel Mode**: Click rocket → +15% fuel, no power change
3. **Passive Decay**: Power loses 4% every second
4. **Cockpit Fade**: If power ≥95%, fade +20%/sec; otherwise fade -20%/sec
5. **Win Condition**: Fade reaches 100% → show video modal with fade-in → success message

### Visual Updates:

- **Game Title**: "Click to launch the rocket" displayed at top with yellow glow
- **Rocket Container**: 200x300px (original size)
- **Rocket Scale**: 1 (original)
- **Cockpit Scale**: 1.8 (larger than rocket for dramatic reveal)
- **Modal Fade-In**: 1 second opacity transition when win screen appears
- **Video Fade-In**: 3 second opacity transition

### Edge Cases Handled:

- Values clamped between 0-100
- Game locked after win (no further clicks)
- Only one win trigger allowed
- Video autoplay fallback (try/catch)
- Mobile responsive layout (200x300px on small screens)

---

## Visual Style Guidelines

- **Theme**: Deep space background with dark navy/black base
- **Colors**: 
  - Neon orange (#ff6b35) for power
  - Neon cyan (#00d4ff) for fuel
  - Yellow (#ffbe0b) for title
- **Effects**: Glow effects on bars, subtle star field, smooth transitions
- **Avoid**: Harsh flashing, overly complex animations, bright clashing colors

---

## Keyboard Controls

| Key | Action |
|-----|--------|
| Z | Switch to Ignite Engines mode |
| X | Switch to Refuel mode |

---

## Timing System

- `setInterval(1000ms)` - Main game loop for decay and fade logic
- CSS transitions/animations - For smooth visual effects
- Modal fade: 1s transition
- Video fade: 3s transition

---

## Target Experience

- **Duration**: 1-3 minutes per game
- **Feel**: Tension → Control → Success
- **Goal**: Simple mechanics, polished visuals, satisfying reveal
