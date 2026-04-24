// Game State
let running = false;
let simulationState = {
    worldSeed: Math.floor(Math.random() * 100000),
    time: 0,
    creatures: [],
    terrain: [],
    events: []
};

// Canvas Setup
const canvas = document.getElementById('world-canvas');
const ctx = canvas.getContext('2d');

// --- NEW: Initialization ---
function initSimulation() {
    // 1. Generate Terrain
    simulationState.terrain = World.generate();
    
    // 2. Spawn 15 initial creatures at random locations
    for(let i = 0; i < 15; i++) {
        const randomX = Math.random() * canvas.width;
        const randomY = Math.random() * canvas.height;
        simulationState.creatures.push(new Creature(randomX, randomY));
    }
    
    // 3. Update UI and draw the first frame
    document.getElementById('ui-pop').innerText = simulationState.creatures.length;
    render();
}

// Engine Loop
let lastTime = 0;
function simulationLoop(timestamp) {
    if (!running) return;
    
    const deltaTime = timestamp - lastTime;
    
    if (deltaTime > 100) { // Limit logic updates to ~10 FPS
        updateWorld();
        updateCreatures();
        handleAI();
        resolveCombat();
        spawnResources();
        processEvolution();
        
        simulationState.time++;
        document.getElementById('ui-year').innerText = simulationState.time;
        
        lastTime = timestamp;
    }
    
    render(); // Render runs at screen refresh rate
    requestAnimationFrame(simulationLoop);
}

// Sub-system Stubs
function updateWorld() { /* Update terrain temps, weather */ }
function updateCreatures() { /* Energy drain, age increase */ }
function handleAI() { /* Flee, seek food, mate */ }
function resolveCombat() { /* Math calculations */ }
function spawnResources() { /* Sky drops, plant growth */ }
function processEvolution() { /* Skill unlocks based on conditions */ }

// --- UPDATED: Render Function ---
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Terrain
    simulationState.terrain.forEach(tile => {
        ctx.fillStyle = tile.color;
        ctx.fillRect(tile.pixelX, tile.pixelY, World.tileSize, World.tileSize);
    });

    // 2. Draw Creatures
    simulationState.creatures.forEach(creature => {
        ctx.beginPath();
        // Draw as circles
        ctx.arc(creature.position.x, creature.position.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444'; // Bright red so they stand out
        ctx.fill();
        ctx.strokeStyle = '#ffffff'; // White border
        ctx.lineWidth = 1.5;
        ctx.stroke();
    });
}

// Controls
document.getElementById('btn-play').addEventListener('click', () => {
    running = !running;
    if (running) {
        requestAnimationFrame(simulationLoop);
    }
});

// --- NEW: Start the setup ---
initSimulation();
