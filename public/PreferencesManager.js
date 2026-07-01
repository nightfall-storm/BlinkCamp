const STORAGE_KEY = 'blinkcamp-prefs';
const defaults = {
    bgTheme: 'dark',
    dotTheme: 'dark',
    velocity: 3,
    radius: 2,
    routineIndex: 0,
    vsyncEnabled: true,
    targetFps: 60,
    menuHidden: false,
};
let prefs = Object.assign({}, defaults);
const migrateOldKeys = () => {
    const oldKeys = ['blinkcamp-theme', 'blinkcamp-bg-theme', 'blinkcamp-dot-theme'];
    oldKeys.forEach(k => localStorage.removeItem(k));
};
export const loadPreferences = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            prefs = Object.assign(Object.assign({}, defaults), JSON.parse(saved));
        }
    }
    catch (_a) {
        prefs = Object.assign({}, defaults);
    }
    migrateOldKeys();
    return prefs;
};
export const getPreferences = () => prefs;
export const updatePreferences = (partial) => {
    prefs = Object.assign(Object.assign({}, prefs), partial);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
};
