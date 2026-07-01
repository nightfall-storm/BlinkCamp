import { updatePreferences, getPreferences } from "./PreferencesManager.js";
const applyBg = (value) => {
    document.documentElement.setAttribute('data-bg-theme', value);
};
const applyDot = (value) => {
    document.documentElement.setAttribute('data-dot-theme', value);
};
export const initThemeManager = () => {
    const prefs = getPreferences();
    applyBg(prefs.bgTheme);
    applyDot(prefs.dotTheme);
    const bgSel = document.getElementById('bg-theme');
    const dotSel = document.getElementById('dot-theme');
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
