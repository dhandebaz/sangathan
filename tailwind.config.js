/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",
    "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
  ],
  theme: {
    extend: {
      colors: {
        // Sangathan Design System - Orange Primary
        orange: {
          50: '#FFF5F2',   // Very light orange
          100: '#FFE8E0',  // Light orange
          200: '#FFD4C4',  // Soft orange
          300: '#FFB899',  // Medium light orange
          400: '#FF8C66',  // Medium orange
          500: '#FF6B35',  // PRIMARY - Main orange color
          600: '#E55A2B',  // Dark orange
          700: '#CC4A21',  // Darker orange
          800: '#A33D1B',  // Very dark orange
          900: '#8A3216',  // Near brown
        },
        // Monochrome for text and UI elements
        black: {
          DEFAULT: '#000000',
          50: '#F2F2F2',   // Off-white
          100: '#E6E6E6',  // Very light gray
          200: '#CCCCCC',  // Light gray
          300: '#B3B3B3',  // Medium light gray
          400: '#999999',  // Medium gray
          500: '#808080',  // Gray
          600: '#666666',  // Medium dark gray
          700: '#4D4D4D',  // Dark gray
          800: '#333333',  // Very dark gray
          900: '#1A1A1A',  // Near black
        },
        // White for cards and content areas
        white: '#FFFFFF',
      },
      fontFamily: {
        // Single font family for entire application - Inter
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
      },
      spacing: {
        // Custom spacing scale for consistent layouts
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        // Custom container widths
        '8xl': '88rem',
        '9xl': '96rem',
      },
      boxShadow: {
        // Subtle shadows only - no heavy shadows
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        // No xl, 2xl, or heavy shadows
      },
      transitionDuration: {
        // Subtle transitions only - 150-200ms
        '150': '150ms',
        '200': '200ms',
      },
      transitionTimingFunction: {
        // Smooth easing functions
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      zIndex: {
        // Custom z-index scale
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    // Custom plugin for Sangathan design system
    function({ addBase, theme }) {
      addBase({
        // PDF-compatible base styles
        'html': {
          'font-family': theme('fontFamily.sans'),
          'line-height': '1.5',
          '-webkit-text-size-adjust': '100%',
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        },
        'body': {
          'font-family': theme('fontFamily.sans'),
          'color': theme('colors.black.DEFAULT'),
          'background-color': theme('colors.orange.500'),
          'margin': '0',
          'padding': '0',
        },
        // Ensure consistent box-sizing
        '*, *::before, *::after': {
          'box-sizing': 'border-box',
        },
        // PDF-safe heading styles
        'h1, h2, h3, h4, h5, h6': {
          'font-family': theme('fontFamily.sans'),
          'font-weight': '600',
          'color': theme('colors.black.DEFAULT'),
          'margin': '0',
        },
        // PDF-safe paragraph styles
        'p': {
          'margin': '0',
          'color': theme('colors.black.DEFAULT'),
        },
        // PDF-safe link styles
        'a': {
          'color': theme('colors.orange.600'),
          'text-decoration': 'none',
          'transition': 'color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
        'a:hover': {
          'color': theme('colors.orange.700'),
        },
        // PDF-safe button reset
        'button': {
          'font-family': 'inherit',
          'font-size': '100%',
          'line-height': '1.15',
          'margin': '0',
        },
        // PDF-safe input styles
        'input, textarea, select': {
          'font-family': theme('fontFamily.sans'),
          'font-size': '100%',
          'line-height': '1.5',
          'margin': '0',
        },
      });
    },
  ],
}