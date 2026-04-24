document.addEventListener('DOMContentLoaded', () => {
    // Specify the JSON file you want to load here. 
    // You can later make this dynamic via URL parameters (e.g., ?npc=boss)
    const npcFile = 'data/character.json';
    loadNPCData(npcFile);
});

async function loadNPCData(fileUrl) {
    const container = document.getElementById('npc-container');
    
    try {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const npc = await response.json();
        renderNPC(npc, container);
    } catch (error) {
        console.error("Failed to load NPC:", error);
        container.innerHTML = `<div class="empty-state">Error loading NPC data. Ensure you are running this on a web server (like GitHub Pages) and that ${fileUrl} exists.</div>`;
    }
}

function renderNPC(npc, container) {
    // Format modifiers to safely include the '+' or '-' sign
    const formatMod = (mod) => mod >= 0 ? `+${mod}` : mod;
    
    // Helper function to build lists (Features, Actions, Reactions, Spells)
    const buildList = (arr, emptyMsg) => {
        if (!arr || arr.length === 0) return `<div class="empty-state">${emptyMsg}</div>`;
        return `<div class="item-list">` + arr.map(item => `
            <div class="item">
                <strong>${item.name}.</strong> ${item.description}
            </div>
        `).join('') + `</div>`;
    };

    // Subtitle logic
    const raceStr = npc.race ? `${npc.race} ` : '';
    const classStr = npc.class ? npc.class : 'NPC';

    // Build the final HTML string
    container.innerHTML = `
        <header>
            <h1>${npc.name || 'Unnamed NPC'}</h1>
            <div class="subtitle">Level ${npc.level} ${raceStr}${classStr}</div>
        </header>

        <div class="combat-stats">
            <div><strong>Armor Class:</strong> ${npc.ac}</div>
            <div><strong>Hit Points:</strong> ${npc.hp}</div>
            <div><strong>Proficiency:</strong> ${npc.proficiency}</div>
        </div>

        <div class="stats-grid">
            ${['str', 'dex', 'con', 'int', 'wis', 'cha'].map(stat => `
                <div class="stat-box">
                    <div class="stat-name">${stat.toUpperCase()}</div>
                    <div class="stat-score">${npc.stats[stat].score}</div>
                    <div class="stat-mod">(${formatMod(npc.stats[stat].mod)})</div>
                </div>
            `).join('')}
        </div>

        ${npc.saving_throws.length > 0 || npc.skills.length > 0 ? `
            <h2>Proficiencies</h2>
            <div class="item-list">
                ${npc.saving_throws.length > 0 ? `<div class="item"><strong>Saving Throws:</strong> ${npc.saving_throws.join(', ')}</div>` : ''}
                ${npc.skills.length > 0 ? `<div class="item"><strong>Skills:</strong> ${npc.skills.join(', ')}</div>` : ''}
            </div>
        ` : ''}

        <h2>Features</h2>
        ${buildList(npc.features, 'No special features.')}

        <h2>Actions</h2>
        ${buildList(npc.actions, 'No actions defined.')}

        <h2>Reactions</h2>
        ${buildList(npc.reactions, 'No reactions available.')}

        ${npc.legendary_actions && npc.legendary_actions.length > 0 ? `
            <h2>Legendary Actions</h2>
            ${buildList(npc.legendary_actions, '')}
        ` : ''}

        ${npc.spells && npc.spells.length > 0 ? `
            <h2>Spells</h2>
            ${buildList(npc.spells, '')}
        ` : ''}
    `;
}
