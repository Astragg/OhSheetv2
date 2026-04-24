class Creature {
    constructor(x, y, parentDNA = null) {
        this.id = crypto.randomUUID();
        this.position = { x: x, y: y };
        this.age = 0;
        this.generation = parentDNA ? parentDNA.generation + 1 : 1;
        
        // Base Stats
        this.stats = {
            health: 100,
            energy: 100,
            speed: 10,
            strength: 5,
            perception: 50, // Vision radius
            adaptability: 1.0
        };

        // Equipment & Modifiers
        this.traits = [];
        this.equipment = {
            weapon: null,
            armor: null
        };

        // Genetic Code
        this.dna = parentDNA || {
            mobilityGene: 1.0,
            aggressionGene: 0.5,
            resilienceGene: 1.0,
            intelligenceGene: 0.2,
            mutationRate: 0.05
        };
    }
}
