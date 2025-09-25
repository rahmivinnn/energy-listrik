# 🚀 Energy Quest - Deployment Guide

## 📋 Deployment Status

✅ **GitHub Repository**: https://github.com/rahmivinnn/energi-listrik-unity  
✅ **Top-Down Game**: Fully implemented and playable  
✅ **Main Menu Integration**: Added "GAME TOP DOWN" button  
✅ **Vercel Configuration**: Updated for proper routing  

## 🎮 Game Access

### Local Development
```bash
cd energy-quest-web
npm install
npm run dev
# Access: http://localhost:3000
```

### Production Build
```bash
cd energy-quest-web
npm run build
# Files in dist/ folder
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Deploy from master branch
3. Access game at: `https://your-domain.vercel.app/public/topdown-game.html`

### Option 2: Netlify
1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `energy-quest-web/dist`
4. Access game at: `https://your-domain.netlify.app/public/topdown-game.html`

### Option 3: GitHub Pages
1. Enable GitHub Pages in repository settings
2. Set source to master branch
3. Access game at: `https://rahmivinnn.github.io/energi-listrik-unity/public/topdown-game.html`

## 🎯 Game URLs

- **Main Menu**: `/` or `/index.html`
- **Top-Down Game**: `/public/topdown-game.html`
- **2D Game**: `/public/game-2d.html`
- **Energy Experiments**: `/public/energy-experiments.html`
- **Quiz**: `/public/quiz.html`

## 🔧 Configuration Files

### vercel.json
```json
{
  "rewrites": [
    {
      "source": "/",
      "destination": "/index.html"
    },
    {
      "source": "/topdown-game",
      "destination": "/public/topdown-game.html"
    },
    {
      "source": "/public/(.*)",
      "destination": "/public/$1"
    }
  ]
}
```

### vite.config.js
```javascript
export default {
  base: '/',
  root: './',
  publicDir: './public',
  build: {
    outDir: './dist'
  }
}
```

## 🎮 Game Features

### Top-Down Game
- **Real-time gameplay** with smooth movement
- **WASD/Arrow keys** for movement
- **SPACE** for dash ability
- **5 levels** with progressive difficulty
- **Energy collection** and waste avoidance
- **Power-ups** and special effects
- **Responsive design** for all devices

### Main Menu Integration
- Added "GAME TOP DOWN" button
- Seamless navigation to all games
- Mobile-optimized interface

## 🚨 Troubleshooting

### 404 Error
- Check if files are in `dist/` folder after build
- Verify Vercel configuration
- Ensure proper routing in vercel.json

### Game Not Loading
- Check browser console for errors
- Verify all assets are accessible
- Test locally first with `npm run dev`

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch controls for mobile devices
- Optimized performance for mobile browsers

## 🎯 Next Steps

1. **Deploy to Vercel/Netlify** for live access
2. **Test on mobile devices** for compatibility
3. **Add analytics** for game usage tracking
4. **Implement leaderboards** for competitive play
5. **Add more game levels** for extended gameplay

---

**🎮 Game is ready for deployment and play!** 🚀