const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');
const themeSelect = document.querySelector('#theme-select');

/* =====================
   USTAWIANIE MOTYWU
===================== */
function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (toggle) {
        toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    if (themeSelect) {
        themeSelect.value = theme;
    }
}

/* =====================
   INICJALIZACJA
===================== */
const savedTheme =
    localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

setTheme(savedTheme);

/* =====================
   SELECT
===================== */
if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
        const theme = e.target.value;

        if (!document.startViewTransition) {
            setTheme(theme);
            return;
        }

        document.startViewTransition(() => setTheme(theme));
    });
}

/* =====================
   TOGGLE BUTTON
===================== */
if (toggle) {
    toggle.addEventListener('click', () => {
        const current = root.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';

        if (!document.startViewTransition) {
            setTheme(next);
            return;
        }

        document.startViewTransition(() => setTheme(next));
    });
}

