import { updatePreferences, getPreferences } from "./PreferencesManager.js";

const applyBg = (value: string): void => {
    document.documentElement.setAttribute('data-bg-theme', value);
};

const applyDot = (value: string): void => {
    document.documentElement.setAttribute('data-dot-theme', value);
};

export const initThemeManager = (): void => {
    const prefs = getPreferences();
    applyBg(prefs.bgTheme);
    applyDot(prefs.dotTheme);

    const bgSel = document.getElementById('bg-theme') as HTMLSelectElement | null;
    const dotSel = document.getElementById('dot-theme') as HTMLSelectElement | null;

    if (bgSel) {
        bgSel.value = prefs.bgTheme;
        bgSel.addEventListener('change', () => {
            applyBg(bgSel.value);
            updatePreferences({ bgTheme: bgSel.value });
        });
    }
    if (dotSel) {
        dotSel.value = prefs.dotTheme;
        dotSel.addEventListener('change', () => {
            applyDot(dotSel.value);
            updatePreferences({ dotTheme: dotSel.value });
        });
    }
};
