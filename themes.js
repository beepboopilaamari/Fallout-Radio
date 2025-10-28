// ==========================================
// FALLOUT RADIO - THEME SYSTEM
// Pip-Boy Color Customization
// ==========================================

const FALLOUT_THEMES = {
    'classic-green': {
        name: 'Classic Green',
        colors: {
            primary: '#00ff00',
            secondary: '#00aa00',
            background: '#0a0a0a',
            surface: '#1a1a1a',
            border: '#00ff00',
            text: '#00ff00',
            textDim: '#008800',
            shadow: 'rgba(0, 255, 0, 0.5)',
            glow: 'rgba(0, 255, 0, 0.3)'
        }
    },
    'amber': {
        name: 'Amber',
        colors: {
            primary: '#ffb000',
            secondary: '#cc8800',
            background: '#0a0700',
            surface: '#1a1400',
            border: '#ffb000',
            text: '#ffb000',
            textDim: '#aa7700',
            shadow: 'rgba(255, 176, 0, 0.5)',
            glow: 'rgba(255, 176, 0, 0.3)'
        }
    },
    'white': {
        name: 'White',
        colors: {
            primary: '#e0e0e0',
            secondary: '#b0b0b0',
            background: '#0a0a0a',
            surface: '#1a1a1a',
            border: '#e0e0e0',
            text: '#e0e0e0',
            textDim: '#909090',
            shadow: 'rgba(224, 224, 224, 0.5)',
            glow: 'rgba(224, 224, 224, 0.3)'
        }
    },
    'blue': {
        name: 'Blue',
        colors: {
            primary: '#00d4ff',
            secondary: '#0088cc',
            background: '#000a0f',
            surface: '#001a24',
            border: '#00d4ff',
            text: '#00d4ff',
            textDim: '#0077aa',
            shadow: 'rgba(0, 212, 255, 0.5)',
            glow: 'rgba(0, 212, 255, 0.3)'
        }
    }
};

class ThemeManager {
    constructor() {
        this.currentTheme = 'classic-green';
        this.init();
    }

    init() {
        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem('fallout-radio-theme');
        if (savedTheme && FALLOUT_THEMES[savedTheme]) {
            this.currentTheme = savedTheme;
        }

        // Apply the theme
        this.applyTheme(this.currentTheme);

        // Setup theme button listeners
        this.setupThemeListeners();
    }

    setupThemeListeners() {
        const themeOptions = document.querySelectorAll('.theme-option');
        
        themeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const themeName = e.target.dataset.theme;
                this.applyTheme(themeName);
                
                // Close the theme picker
                document.getElementById('themePicker').style.display = 'none';
                
                // Show feedback
                this.showThemeChangeNotification(FALLOUT_THEMES[themeName].name);
            });
        });
    }

    applyTheme(themeName) {
        if (!FALLOUT_THEMES[themeName]) {
            console.error('Theme not found:', themeName);
            return;
        }

        const theme = FALLOUT_THEMES[themeName];
        const root = document.documentElement;

        // Apply CSS variables
        root.style.setProperty('--primary-color', theme.colors.primary);
        root.style.setProperty('--secondary-color', theme.colors.secondary);
        root.style.setProperty('--background-color', theme.colors.background);
        root.style.setProperty('--surface-color', theme.colors.surface);
        root.style.setProperty('--border-color', theme.colors.border);
        root.style.setProperty('--text-color', theme.colors.text);
        root.style.setProperty('--text-dim', theme.colors.textDim);
        root.style.setProperty('--shadow-color', theme.colors.shadow);
        root.style.setProperty('--glow-color', theme.colors.glow);

        // Save to localStorage
        this.currentTheme = themeName;
        localStorage.setItem('fallout-radio-theme', themeName);

        // Add animation effect
        this.animateThemeChange();
    }

    animateThemeChange() {
        const container = document.querySelector('.pip-boy-container');
        if (!container) return;

        // Brief flash effect
        container.style.transition = 'opacity 0.2s';
        container.style.opacity = '0.7';
        
        setTimeout(() => {
            container.style.opacity = '1';
            setTimeout(() => {
                container.style.transition = '';
            }, 200);
        }, 100);
    }

    showThemeChangeNotification(themeName) {
        console.log(`Theme changed to: ${themeName}`);
        
        // Create a temporary notification element
        const notification = document.createElement('div');
        notification.textContent = `THEME: ${themeName.toUpperCase()}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--surface-color);
            color: var(--text-color);
            border: 2px solid var(--border-color);
            padding: 15px 25px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            font-weight: bold;
            z-index: 10001;
            box-shadow: 0 0 20px var(--shadow-color);
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Remove after 2 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getThemeInfo(themeName) {
        return FALLOUT_THEMES[themeName];
    }

    getAllThemes() {
        return Object.keys(FALLOUT_THEMES).map(key => ({
            id: key,
            name: FALLOUT_THEMES[key].name
        }));
    }
}

// Add animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize theme manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FALLOUT_THEMES, ThemeManager };
}
