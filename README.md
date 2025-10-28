# 🎵 Fallout Radio - Wasteland Broadcasting System

![Fallout Radio](https://img.shields.io/badge/Fallout-Radio-00ff00?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-00ff00?style=for-the-badge)
![Status](https://img.shields.io/badge/status-Online-00ff00?style=for-the-badge)

An authentic **Fallout-themed web radio player** featuring music from all Fallout games (Fallout 3, New Vegas, 4, and 76) with a stunning Pip-Boy inspired interface complete with CRT effects, scanlines, and customizable color themes.

## ✨ Features

### 🎮 Authentic Fallout Experience
- **Pip-Boy 3000 Mk IV Interface** - Authentic wasteland terminal aesthetic
- **CRT Screen Effects** - Realistic cathode ray tube monitor simulation with flickering and scanlines
- **Multiple Color Themes** - Classic Green, Amber, White, and Blue (just like in the games!)
- **Retro Typography** - Monospace fonts for that authentic terminal feel

### 📻 Radio Stations
All radio stations from across the Fallout universe:

#### Fallout 3
- **Galaxy News Radio** (GNR) - Hosted by Three Dog
- **Enclave Radio** - President John Henry Eden's patriotic broadcasts
- **Agatha's Station** - Classical violin music

#### Fallout: New Vegas
- **Radio New Vegas** - Hosted by Mr. New Vegas
- **Mojave Music Radio** - Country and western classics
- **Black Mountain Radio** - Tabitha's... interesting broadcasts

#### Fallout 4
- **Diamond City Radio** - Travis "Lonely" Miles
- **Classical Radio** - Orchestral masterpieces

#### Fallout 76
- **Appalachia Radio** - Country roads take me home
- **Classical Radio (76)** - More timeless classics

### 🎵 Features
- **Synchronized Playback** - Everyone hears the same song at the same time (designed for streaming)
- **Now Playing Display** - See current track, artist, and album information
- **Visual Waveform** - Animated audio visualizer
- **Playlist View** - See upcoming tracks
- **Station Information** - Learn about each station and its host
- **Statistics Tracking** - Monitor listening time and session stats
- **Keyboard Shortcuts** - Control playback with keyboard
- **Responsive Design** - Works on desktop, tablet, and mobile

### 🎨 Customization
- **4 Color Themes** inspired by Fallout games
- **Persistent Settings** - Your theme choice is saved
- **Smooth Transitions** - Beautiful theme switching animations

## 🚀 Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (for CORS compatibility with audio files)

### Installation

1. **Clone or Download** this repository to your computer

2. **Add Your Music Files**
   
   Create a `music` folder structure:
   ```
   Fallout Radio/
   ├── music/
   │   ├── fo3/          (Fallout 3 songs)
   │   ├── fonv/         (Fallout: New Vegas songs)
   │   ├── fo4/          (Fallout 4 songs)
   │   └── fo76/         (Fallout 76 songs)
   ├── index.html
   ├── styles.css
   ├── app.js
   ├── stations.js
   └── themes.js
   ```

3. **Start a Local Server**

   **Option 1: Using Python**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Option 2: Using Node.js (http-server)**
   ```bash
   npx http-server -p 8000
   ```

   **Option 3: Using VS Code**
   - Install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"

4. **Open in Browser**
   
   Navigate to: `http://localhost:8000`

## 🎼 Adding Your Music

### Getting Fallout Music

**IMPORTANT**: You must own the music legally. Here are legitimate ways to get Fallout soundtracks:

1. **Purchase from Official Sources**:
   - Steam (game soundtracks often included with purchase)
   - iTunes/Apple Music
   - Amazon Music
   - Spotify (for streaming, not downloading)
   - Bethesda.net

2. **Extract from Games** (if you own them):
   - Fallout 3: `Data\Sound\fx\mus`
   - Fallout: New Vegas: `Data\Sound\songs`
   - Fallout 4: `Data\Sound\fx\mus`
   - Use tools like Fallout Mod Manager or extract .ba2/.bsa files

3. **Official Soundtrack Albums**:
   - Many tracks are available on music platforms as official albums

### Configuring Music Files

Edit `stations.js` and update the `url` field for each track to match your file structure:

```javascript
{
    title: "I Don't Want to Set the World on Fire",
    artist: "The Ink Spots",
    album: "Fallout 3 OST",
    url: "music/fo3/i-dont-want-to-set-the-world-on-fire.mp3"
}
```

**Supported formats**: MP3, OGG, WAV, M4A

## 🎮 Usage

### Basic Controls

- **Select a Station** - Click on any station in the left sidebar
- **Play/Pause** - Click the play button or press `SPACE`
- **Mute** - Click the mute button or press `M`
- **Next Track** - Press `→` (Right Arrow)
- **Volume** - Use the volume slider

### Theme Switching

1. Click the "🎨 THEME" button in the footer
2. Select your preferred color scheme:
   - **Classic Green** - The iconic Pip-Boy green
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
- **Spreaker**

### Option 3: WebRTC for P2P Streaming

Implement WebRTC for peer-to-peer audio streaming (advanced).

## 📝 Customization

### Adding New Stations

Edit `stations.js`:

```javascript
{
    name: "Your Custom Station",
    game: "CUSTOM",
    description: "Your station description",
    host: "Your DJ Name",
    tracks: [
        {
            title: "Song Title",
            artist: "Artist Name",
            album: "Album Name",
            url: "music/custom/song.mp3"
        }
        // Add more tracks...
    ]
}
```

### Modifying Colors

Create new themes in `themes.js`:

```javascript
'custom-theme': {
    name: 'My Custom Theme',
    colors: {
        primary: '#your-color',
        secondary: '#your-color',
        // ... etc
    }
}
```

### Changing UI Elements

- **HTML Structure**: Edit `index.html`
- **Styling**: Modify `styles.css`
- **Behavior**: Update `app.js`

## 🎯 Advanced Features

### Adding DJ Voice Lines

To include DJ commentary (like Three Dog or Mr. New Vegas):

1. Record or extract voice lines from the games
2. Add them to your music folder
3. Create special "DJ Commentary" tracks in `stations.js`:

```javascript
{
    title: "[DJ Commentary]",
    artist: "Three Dog",
    album: "Galaxy News Radio",
    url: "music/fo3/voicelines/three-dog-01.mp3"
}
```

### Adding News Broadcasts

Similar to DJ lines, add authentic news segments:

```javascript
{
    title: "[News Report]",
    artist: "Galaxy News",
    album: "Wasteland Updates",
    url: "music/fo3/news/super-mutant-sighting.mp3"
}
```

## 🔧 Troubleshooting

### Audio Won't Play

**Issue**: Cross-Origin Resource Sharing (CORS) errors

**Solution**: 
- Use a local web server (not just opening the HTML file)
- Ensure audio files are in the correct location
- Check browser console for specific errors

### Station List Empty

**Issue**: `stations.js` not loading

**Solution**:
- Verify `stations.js` is in the same folder as `index.html`
- Check the browser console for JavaScript errors
- Ensure the file is properly formatted

### Theme Not Saving

**Issue**: LocalStorage disabled or browser in private mode

**Solution**:
- Enable cookies/storage in browser settings
- Exit private/incognito browsing mode

### Poor Performance

**Issue**: CRT effects causing lag

**Solution**: Reduce or disable effects in `styles.css`:
- Comment out `.crt-overlay` animations
- Reduce `.scanlines` complexity
- Lower animation frame rates

## 🎨 Screenshots

*(Add your own screenshots here)*

## 📜 License

This is a fan project inspired by the Fallout series. 

**Important**:
- Fallout is © Bethesda Softworks
- Music copyrights belong to their respective artists and labels
- This project is for personal use only
- Do not distribute copyrighted music without permission

## 🤝 Contributing

Want to improve Fallout Radio? 

- Add new features
- Fix bugs
- Improve styling
- Add more station information
- Optimize performance

Feel free to submit pull requests!

## 🎮 Credits

- **Inspired by**: fallout.radio by Been Reported
- **Game Series**: Fallout by Bethesda Game Studios
- **Music**: Various artists featured in Fallout games
- **Interface Design**: Based on Pip-Boy 3000 from Fallout series

## 🌟 Features Roadmap

Future enhancements:

- [ ] Audio spectrum analyzer
- [ ] Terminal hacking minigame
- [ ] V.A.T.S. style animations
- [ ] More interactive elements
- [ ] Android/iOS app versions
- [ ] Real-time chat for listeners
- [ ] Request system
- [ ] Favorite tracks system
- [ ] Download playlist as M3U
- [ ] Integration with Last.fm
- [ ] Discord Rich Presence

## 📞 Support

Having issues? 

1. Check the troubleshooting section above
2. Review browser console for errors
3. Ensure all files are in correct locations
4. Verify audio file formats are supported

## ⚡ Performance Tips

- Use MP3 files at 128-192 kbps for best balance of quality and performance
- Optimize large playlists by lazy-loading
- Consider CDN hosting for faster loading
- Compress images and assets
- Enable browser caching

---

**Remember**: War. War never changes. But your radio experience can be enhanced! 🎵

*Stay tuned to the Wasteland's finest broadcasts, Survivor!*
