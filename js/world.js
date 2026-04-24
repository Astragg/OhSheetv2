const World = {
    cols: 40,  // 800px width / 20px tile size
    rows: 30,  // 600px height / 20px tile size
    tileSize: 20,

    generate: function() {
        const terrainGrid = [];
        
        // Define our terrain palette
        const terrainTypes = [
            { type: "grass", color: "#22c55e", movementCost: 0 },
            { type: "water", color: "#3b82f6", movementCost: 70 },
            { type: "sand", color: "#eab308", movementCost: 40 },
            { type: "forest", color: "#166534", movementCost: 30 }
        ];

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                // Pick a random terrain type
                const randomType = terrainTypes[Math.floor(Math.random() * terrainTypes.length)];
                
                terrainGrid.push({
                    gridX: x,
                    gridY: y,
                    pixelX: x * this.tileSize,
                    pixelY: y * this.tileSize,
                    ...randomType
                });
            }
        }
        return terrainGrid;
    }
};
