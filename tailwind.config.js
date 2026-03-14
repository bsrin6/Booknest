/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2196F3',
                'primary-dark': '#1976D2',
                'primary-light': '#BBDEFB',
                'bg-light': '#F5F7FA',
                'text-dark': '#1A2138',
                'text-secondary': '#6B7280',
                'text-muted': '#9CA3AF',
                'border-light': '#E5E7EB',
            },
            fontFamily: {
                sans: ['System'],
            },
        },
    },
    plugins: [],
};
