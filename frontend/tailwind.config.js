/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable dark mode via class strategy
    theme: {
        extend: {
            colors: {
                // Custom colors matching the existing design
                slate: {
                    850: '#1e293b', // Custom dark shade if needed
                    900: '#0f172a',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
