/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/!(*.stories|*.spec).{js,jsx,ts,tsx,mdx}'],
  mode: 'jit',
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};
