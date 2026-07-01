const THEME_STORAGE_KEY = 'blinkcamp-theme';

const applyTheme = (theme: string): void => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
};

export const initThemeManager = (): void => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    const initial = saved || 'dark';
    applyTheme(initial);

    const selector = document.getElementById('theme-selector') as HTMLSelectElement | null;
    if (selector) {
        selector.value = initial;
        selector.addEventListener('change', () => applyTheme(selector.value));
    }
};
