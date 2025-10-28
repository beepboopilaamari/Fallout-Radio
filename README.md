# 🎵 Fallout Radio - Wasteland Broadcasting System

![Fallout Radio](https://img.shields.io/badge/Fallout-Radio-00ff00?style=for-the-badge)
![Version](https://img.shields.io/badge/version-2.0.0-00ff00?style=for-the-badge)
![Status](https://img.shields.io/badge/status-Online-00ff00?style=for-the-badge)

A synchronized **Fallout-themed web radio player** that streams music from all Fallout games (Fallout 3, New Vegas, 4, and 76) with an authentic Pip-Boy 3000 terminal interface. Everyone hears the same song at the same time - just like a real radio station!

## ✨ Features

### 🎮 Authentic Pip-Boy Experience
- **Authentic Pip-Boy 3000 Interface** - Exact replica of the in-game terminal
- **CRT Screen Effects** - Realistic phosphor glow, scanlines, and screen flicker
- **Fullscreen Immersive Design** - Fills your entire screen for maximum immersion
- **Vault Boy Background** - Iconic Fallout mascot with subtle overlay
- **Retro Monospace Typography** - Just like the real Pip-Boy

### 📻 Radio Stations (8 Total)

#### Fallout 4
- **Diamond City Radio** - 106 tracks hosted by Travis "Lonely" Miles
- **Classical Radio** - 29 orchestral masterpieces

#### Fallout 3
- **Galaxy News Radio** - 40 tracks with Three Dog
- **Enclave Radio** - President Eden's continuous broadcast

#### Fallout: New Vegas
- **Radio New Vegas** - 40 tracks with Mr. New Vegas
- **Black Mountain Radio** - 30 tracks from Tabitha
- **Mojave Music Radio** - Continuous broadcast

#### Fallout 76
- **Appalachia Radio** - 51 tracks including "Country Roads"

### 🎵 Core Features
- **🌐 Synchronized Global Playback** - Everyone worldwide hears the same song at the same time
- **♾️ Continuous Broadcasting** - Radio never stops, plays 24/7 in a loop
- **🔄 Auto-Sync System** - Automatically corrects drift every 30 seconds
- **📡 YouTube Streaming** - High-quality audio from timestamped YouTube videos
- **🎚️ Volume Control** - Adjust volume with live percentage display
- **📋 Playlist Preview** - See upcoming tracks
- **ℹ️ Now Playing Display** - Current track, artist, and station info
- **📊 Session Statistics** - Track count and listening time
- **📱 Fully Responsive** - Works perfectly on all devices
- **Smooth Transitions** - Beautiful theme switching animations

## 🚀 Quick Start


## 🚀 Quick Start

### Installation

1. **Clone or Download** this repository
   ```bash
   git clone https://github.com/beepboopilaamari/Fallout-Radio.git
   cd Fallout-Radio
   ```

2. **Start a Local Server**
   ```bash
   # Using Python 3
   python -m http.server 8000
   ```

3. **Open in Browser**
   ```
   http://localhost:8000
   ```

That's it! The radio will start playing automatically.

## 🌐 Live Demo

Visit the live site: **[Your GitHub Pages URL here]**

## � How It Works

### Synchronized Broadcasting
- Uses a global epoch time (October 28, 2025 midnight) as reference
- Calculates current position in playlist based on elapsed time
- All users worldwide are synchronized to the same track and position
- Auto-corrects drift every 30 seconds to maintain perfect sync

### YouTube Integration
- Streams audio from timestamped YouTube videos
- Each track has a precise `startTime` in the video
- Seamlessly transitions between tracks within the same video
- No downloads required - streams on-demand

## 🎮 Usage

### Basic Controls
- **Select Station** - Click any station in the left sidebar
- **Adjust Volume** - Use the volume slider (0-100%)
- **Switch Stations** - Click any station without interrupting playback
- **View Playlist** - See upcoming tracks in the "UP NEXT" section

### Navigation Tabs
- **Radio** - Main player interface (default)
- **Stats** - View session statistics
- **Data** - Additional information
- **Map** - Placeholder for future features
- **Inv** - Placeholder for future features

## 🎨 Customization

### Theme Colors
The site includes a theme system in `themes.js` with 4 color schemes:
- **Classic Green** (default) - The iconic Pip-Boy phosphor green
- **Amber** - Warm amber CRT glow
- **White** - High-contrast white phosphor
- **Blue** - Cool blue terminal aesthetic

To change themes, modify the theme switcher in the code or add UI controls.
   - **Amber** - Warm amber/orange tones
   - **White** - High-contrast monochrome
   - **Blue** - Cool blue terminals

Your theme preference is automatically saved!

### Tabs

- **PLAYLIST** - View upcoming tracks
- **ABOUT** - Station information and details
- **STATS** - View listening statistics

## 🌐 Setting Up for Online Streaming

To create a truly synchronized experience where all users hear the same music at the same time, you'll need:

### Option 1: Icecast/Shoutcast Server

1. Set up an Icecast or Shoutcast streaming server
2. Use broadcasting software (like BUTT - Broadcast Using This Tool) to stream your playlist
3. Update the audio source in `app.js`:

```javascript
// In selectStation method
this.audioPlayer.src = 'http://your-stream-server.com:8000/fallout-radio';
```

### Option 2: Cloud Streaming Services

Use services like:
- **Mixcloud** (for pre-recorded shows)
- **Radio.co**
- **Live365**

## 📂 Project Structure

```
Fallout-Radio/
├── index.html              # Main HTML structure
├── pipboy.css             # Authentic Pip-Boy styling with CRT effects
├── app.js                 # Main application logic and sync system
├── youtube-player.js      # YouTube IFrame API wrapper
├── youtube-stations.js    # Station database with 300+ timestamped tracks
├── themes.js              # Color theme system (green/amber/white/blue)
├── vaultboy-bg.jpg       # Background image
├── favicon.gif           # Animated Vault Boy favicon
├── README.md             # This file
└── LICENSE               # MIT License
```

## 🔧 Technical Details

### Technologies Used
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API**: YouTube IFrame API v3
- **Hosting**: Static site (works on any web host)
- **Audio**: YouTube video streaming with timestamp control

### How Synchronization Works
1. Global epoch time set to October 28, 2025 00:00:00
2. Calculate seconds elapsed since epoch
3. Use modulo to find position in playlist loop
4. Calculate track index from consecutive `startTime` differences
5. Seek to exact position within track
6. Repeat check every 30 seconds to maintain sync

### Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera
- Any modern browser with ES6+ support

## 🎯 Adding More Stations

Want to add more radio stations? Edit `youtube-stations.js`:

```javascript
{
    name: "Your Station Name",
    game: "FALLOUT X",
    description: "Station description",
    host: "DJ Name",
    youtubeVideoId: "YouTube_Video_ID",
    tracks: [
        {
            title: "Song Title",
            artist: "Artist Name",
            startTime: 0,  // Start time in seconds
            type: "song"   // or "commentary"
        }
        // Add more tracks with their timestamps...
    ]
}
```

## � Troubleshooting

### Radio Not Playing
- Check browser console for errors
- Ensure you have internet connection (streams from YouTube)
- Try refreshing the page with Ctrl+Shift+R
- Check if YouTube is accessible in your region

### Out of Sync
- The system auto-corrects every 30 seconds
- Wait a moment for automatic resync
- Check your system clock is accurate

### Background Image Not Showing
- Ensure `vaultboy-bg.jpg` is in the same folder as `index.html`
- Check filename matches exactly (case-sensitive on some servers)
- Try hard refresh (Ctrl+Shift+R)

## 📜 License

MIT License - See LICENSE file for details

**Important Legal Notes**:
- Fallout franchise © Bethesda Softworks
- Music rights belong to respective artists/labels
- This is a fan project for educational/entertainment purposes
- YouTube content follows their terms of service
- No copyright infringement intended

## 🤝 Contributing

Contributions welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🎮 Credits & Inspiration

- **Inspired by**: [fallout.radio](https://fallout.radio) by Been Reported
- **UI Design**: Based on kibibyte's Pip-Boy CSS implementation
- **Game Series**: Fallout © Bethesda Game Studios
- **Music**: Various artists featured across Fallout games (3, NV, 4, 76)

## 🌟 Roadmap

Future enhancements:
- [ ] User-selectable themes via UI button
- [ ] Station search/filter
- [ ] Keyboard shortcuts for station switching
- [ ] Audio visualizer animation
- [ ] "Favorites" system
- [ ] Share current track feature
- [ ] Mobile app version
- [ ] Discord Rich Presence integration
- [ ] More stations from Fallout 1, 2, and Tactics

## 📞 Support

Having issues? Here's how to get help:

1. Check the [Troubleshooting](#-troubleshooting) section above
2. Review browser console for error messages
3. Ensure all files are present in the directory
4. Open an issue on GitHub with details

---

**🎵 War. War never changes. But your radio reception can be crystal clear! 🎵**

*Stay tuned to the Wasteland's finest broadcasts!*

Made with 💚 by the Fallout community
