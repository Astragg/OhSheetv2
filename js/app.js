document.addEventListener('DOMContentLoaded', () => {
    loadNPCData('data/character.json');
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
        container.innerHTML = `<div class="empty-state">Error loading NPC data. Ensure you are running on a web server.</div>`;
    }
}

function renderNPC(npc, container) {
    const formatMod = (mod) => mod >= 0 ? `+${mod}` : mod;
    
    // Helper to render comma-separated property lines (e.g. "Damage Resistances: fire, cold")
    const renderProp = (title, arr) => {
        if (!arr || arr.length === 0) return '';
        return `<div class="prop-line"><strong>${title}</strong> ${arr.join(', ')}</div>`;
    };

    // Helper to render action lists (Traits, Actions, Bonus Actions, Reactions)
    const renderActionList = (title, arr, headerText = '') => {
        if (!arr || arr.length === 0) return '';
        let html = `<h2>${title}</h2>`;
        if (headerText) html += `<div class="item desc-header">${headerText}</div>`;
        html += `<div class="item-list">` + arr.map(item => `
            <div class="item">
                <strong>${item.name}.</strong> ${item.description}
            </div>
        `).join('') + `</div>`;
        return html;
    };

    // Helper for Spells
    const renderSpells = (spellData) => {
        if (!spellData || !spellData.lists || spellData.lists.length === 0) return '';
        let html = `<h2>Spellcasting</h2>`;
        if (spellData.header) html += `<div class="item desc-header">${spellData.header}</div>`;
        html += `<div class="item-list">` + spellData.lists.map(list => `
            <div class="item">
                <strong>${list.level}:</strong> <em>${list.spells.join(', ')}</em>
            </div>
        `).join('') + `</div>`;
        return html;
    };

    container.innerHTML = `
        <header>
            <h1>${npc.name || 'Unnamed NPC'}</h1>
            <div class="subtitle">${npc.meta.size} ${npc.meta.type}, ${npc.meta.alignment}</div>
        </header>

        <div class="combat-stats">
            <div><strong>Armor Class:</strong> ${npc.armor_class.value} ${npc.armor_class.description ? `(${npc.armor_class.description})` : ''}</div>
            <div><strong>Hit Points:</strong> ${npc.hit_points.value} (${npc.hit_points.dice})</div>
            <div><strong>Speed:</strong> ${npc.speed}</div>
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

        <div class="properties-section">
            ${renderProp('Saving Throws', npc.saving_throws)}
            ${renderProp('Skills', npc.skills)}
            ${renderProp('Damage Vulnerabilities', npc.vulnerabilities)}
            ${renderProp('Damage Resistances', npc.resistances)}
            ${renderProp('Damage Immunities', npc.immunities)}
            ${renderProp('Condition Immunities', npc.condition_immunities)}
            ${renderProp('Senses', npc.senses)}
            ${renderProp('Languages', npc.languages)}
            <div class="prop-line">
                <strong>Challenge</strong> ${npc.challenge.cr} (${npc.challenge.xp} XP) 
                <span style="float:right;"><strong>Proficiency Bonus</strong> ${npc.challenge.proficiency}</span>
            </div>
        </div>

        ${renderActionList('Traits', npc.traits)}
        ${renderSpells(npc.spellcasting)}
        ${renderActionList('Actions', npc.actions)}
        ${renderActionList('Bonus Actions', npc.bonus_actions)}
        ${renderActionList('Reactions', npc.reactions)}
        ${npc.legendary_actions ? renderActionList('Legendary Actions', npc.legendary_actions.actions, npc.legendary_actions.header) : ''}
    `;
}
