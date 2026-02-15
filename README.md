# 🚀 Rocket Launch Countdown Game

A browser-based interactive clicker game where you must build and maintain launch power while managing fuel levels to successfully launch a rocket.

## How to Play

1. Open `index.html` in a web browser
2. Click the **Ignite Engines** button (or press **Z**) to switch to ignite mode
3. Click the rocket to build power (costs fuel)
4. Keep power above **95%** to clear the cockpit
5. If fuel runs low, switch to **Refuel** mode (or press **X**) and click the rocket to add fuel
6. Once the cockpit is fully clear, the rocket launches!

## Controls

| Action | Control |
|--------|---------|
| Ignite Mode | Click "Ignite Engines" button or press **Z** |
| Refuel Mode | Click "Refuel" button or press **X** |
| Build Power | Click the rocket in Ignite mode (+5% power, -5% fuel) |
| Add Fuel | Click the rocket in Refuel mode (+15% fuel) |

## Game Mechanics

- **Power Decay**: -4% per second
- **Win Condition**: Maintain 95%+ power for 5 seconds to clear the cockpit
- **Fuel**: Required for efficient power building (2% power gain when out of fuel)

## Files

```
/project-root/
├── index.html              # Main game HTML
├── style.css               # Game styling
├── script.js               # Game logic
├── CODE_DOCUMENTATION.md   # Code documentation
├── README.md               # This file
└── assets/                 # Game assets
    ├── rocket.png
    ├── cockpit.png
    ├── final_video.mp4
    ├── ignite.png
    └── refuel.png
```

## Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No external dependencies (pure HTML, CSS, JavaScript)

## License

MIT
