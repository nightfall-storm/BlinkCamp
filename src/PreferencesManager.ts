const STORAGE_KEY = 'blinkcamp-prefs';

interface Preferences {
    bgTheme: string;
    dotTheme: string;
    velocity: number;
    radius: number;
    routineIndex: number;
    vsyncEnabled: boolean;
    targetFps: number;
    menuHidden: boolean;
}

const defaults: Preferences = {
    bgTheme: 'dark',
    dotTheme: 'dark',
    velocity: 3,
    radius: 2,
    routineIndex: 0,
    vsyncEnabled: true,
    targetFps: 60,
    menuHidden: false,
};

let prefs: Preferences = { ...defaults };

const migrateOldKeys = (): void => {
    const oldKeys = ['blinkcamp-theme', 'blinkcamp-bg-theme', 'blinkcamp-dot-theme'];
    oldKeys.forEach(k => localStorage.removeItem(k));
};

export const loadPreferences = (): Preferences => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            prefs = { ...defaults, ...JSON.parse(saved) };
        }
    } catch {
        prefs = { ...defaults };
    }
    migrateOldKeys();
    return prefs;
};

export const getPreferences = (): Readonly<Preferences> => prefs;

export const updatePreferences = (partial: Partial<Preferences>): void => {
    prefs = { ...prefs, ...partial };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
};
