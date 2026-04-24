// Manages Save/Load operations for simulationState
const SaveSystem = {
    downloadSave: function(data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `evogenesis_save_${data.time}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    loadSave: function(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                restoreWorld(data);
            } catch (err) {
                console.error("Failed to parse save file:", err);
                alert("Invalid save file.");
            }
        };
        reader.readAsText(file);
    },

    autoSave: function(data) {
        localStorage.setItem("evogenesis_autosave", JSON.stringify(data));
        console.log("Auto-saved to localStorage.");
    }
};

function restoreWorld(data) {
    simulationState = data;
    document.getElementById('ui-year').innerText = simulationState.time;
    document.getElementById('ui-pop').innerText = simulationState.creatures.length;
    // Trigger re-render of world data here
    console.log("World restored from seed:", simulationState.worldSeed);
}

// UI Listeners for Save/Load
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('btn-save').addEventListener('click', () => {
        SaveSystem.downloadSave(simulationState);
    });

    document.getElementById('btn-load').addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            SaveSystem.loadSave(e.target.files[0]);
        }
    });

    // Auto-save every 60 seconds
    setInterval(() => {
        if (running) SaveSystem.autoSave(simulationState);
    }, 60000);
});
