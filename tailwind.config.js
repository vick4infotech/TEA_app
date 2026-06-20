module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        teaPurple: { 50:'#fbf5ff',100:'#f3e4ff',200:'#e7c5ff',300:'#d795ff',400:'#c25cff',500:'#a72fe5',600:'#851bb8',700:'#68158d',800:'#4d0f68',900:'#3a0c4d' },
        teaGold: { 50:'#fff9eb',100:'#ffefc2',200:'#ffe085',300:'#ffd04a',400:'#f7b718',500:'#d99a08',600:'#ad7604',700:'#825704',800:'#604207',900:'#3e2a05' }
      },
      boxShadow: { soft: '0 18px 50px rgba(58,12,77,.12)' }
    }
  },
  plugins: []
};
