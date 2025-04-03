module.exports = {
    content: ['./index.html', './src/**/*.{tsx,ts}'],
    theme: {
        extend: {
            backgroundImage: {
                sm: "url('./assets/img/bg-sm.png')",
                md: "url('./assets/img/bg-md.png')",
            },
            colors: {
                clmenu: '#D2B96D',
                clgreen: '#059F83',
            },
            animation: {
                'modal-slide': 'slideIn 0.5s ease-out',
                'grow-to-screen': 'growToScreen 1s ease-out forwards',
                'slide-right': 'slideRight 1s ease-out',
                'slide-up': 'slideUp 1s ease-out',
                'swapA': 'swapA 1s infinite',
                'swapB': 'swapB 1s infinite',
                'fadeIn': 'fadeIn 1s ease-in-out',
                'fadeOut': 'fadeOut 1s ease-out forwards',
                'sequential-bounce-text': 'sequentialBounceText 2s infinite',
                'sequential-bounce-1': 'sequentialBounce 2s infinite',
                'sequential-bounce-2': 'sequentialBounce 2s infinite 0.4s',
                'sequential-bounce-3': 'sequentialBounce 2s infinite 0.8s',
                'color-change': 'colorChange 2s infinite',
            },
            keyframes: {
                slideIn: {
                    '0%': { opacity: 0, transform: 'translateY(50%)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                growToScreen: {
                    '0%': { transform: 'scale(1)', opacity: 1 },
                    '50%': { transform: 'scale(5)', opacity: 1 },
                    '75%': { transform: 'scale(10)', opacity: 1 },
                    '100%': { transform: 'scale(20)', opacity: 1 },
                },
                slideRight: {
                    '0%': { transform: 'translateX(100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                swapA: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '50%': { transform: 'translateX(100px)' }, // A moves to B's position
                },
                swapB: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '50%, 100%': { zIndex: 20 },
                    '50%': { transform: 'translateX(-150px)', zIndex: 0 }, // B moves to A's position
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '33%': { opacity: '0.6' },
                    '66%': { opacity: '0.8' },
                    '100%': { opacity: '1' },
                },
                fadeOut: {
                    '0%': { opacity: 1 },
                    '100%': { opacity: 0 },
                },
                sequentialBounce: {
                    '0%, 80%, 100%': { transform: 'translateY(0)' },
                    '40%': { transform: 'translateY(-15px)' },
                },
                sequentialBounceText: {
                    '0%, 80%, 100%': { transform: 'translateY(0)' },
                    '40%': { transform: 'translateY(-5px)' },
                },
                colorChange: {
                    '0%': { color: '#000' },
                    '33%': { color: '#DCB867' },
                    '66%': { color: '#A0E56B' },
                    '100%': { color: '#79A4E8' },
                },
            },
        },
        screens: {
            xs: '360px',
            // => @media (min-width: 375px) { ... }
            sm: '640px',
            // => @media (min-width: 640px) { ... }

            md: '768px',
            // => @media (min-width: 768px) { ... }

            lg: '1024px',
            // => @media (min-width: 1024px) { ... }

            xl: '1280px',
            // => @media (min-width: 1280px) { ... }

            '2xl': '1536px',
            // => @media (min-width: 1536px) { ... }
        },
    },
    plugins: [
        require('daisyui'),
        require('@tailwindcss/line-clamp'),
        // other plugins...
    ],
};
