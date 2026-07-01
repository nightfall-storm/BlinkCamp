const THEME_STORAGE_KEY = 'blinkcamp-theme';
const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
};
export const initThemeManager = () => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    const initial = saved || 'dark';
    applyTheme(initial);
    const selector = document.getElementById('theme-selector');
    if (selector) {
        selector.value = initial;
        selector.addEventListener('change', () => applyTheme(selector.value));
    }
};
