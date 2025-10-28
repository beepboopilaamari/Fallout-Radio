// ==========================================
// FALLOUT RADIO - MAIN APPLICATION
// Synchronized Wasteland Broadcasting System
// ==========================================

class FalloutRadio {
    constructor() {
        this.audioPlayer = document.getElementById('audioPlayer');
        this.youtubePlayer = null;
        this.currentStation = null;
        this.isPlaying = false;
        this.currentTrackIndex = 0;
        this.playlist = [];
        this.startTime = Date.now();
        this.playtimeSeconds = 0;
        this.syncInterval = null;
        this.useYouTube = true; // Use YouTube by default
        
        // Synchronized playback - Use actual current time
        // This way the "broadcast" position is based on real time
        // Everyone who visits at the same moment hears the same thing
        this.GLOBAL_START_TIME = new Date('2025-10-28T00:00:00').getTime(); // Epoch start
        this.syncCheckInterval = null;
        
        this.init();
    }

    init() {
        this.setupUI();
        this.loadStations();
        this.setupEventListeners();
        this.updateDateTime();
        this.updateStats();
        
        // Initialize YouTube player if needed
        if (typeof YouTubePlayer !== 'undefined') {
            this.youtubePlayer = new YouTubePlayer();
            this.youtubePlayer.init();
            
            // Set up callback for when track ends - use sync instead of sequential
            this.youtubePlayer.onTrackEnd = () => {
                // Recalculate position to stay in sync
                const syncPos = this.calculateSyncPosition(this.currentStation);
                this.currentTrackIndex = syncPos.trackIndex;
                this.youtubePlayer.playTrack(syncPos.trackIndex, syncPos.trackPosition);
                this.updateNowPlaying(this.playlist[syncPos.trackIndex]);
                this.updatePlaylist();
            };

            // Auto-select first station after YouTube is ready
            setTimeout(() => {
                if (this.allStations && this.allStations.length > 0) {
                    console.log('[AUTO] Auto-selecting first station');
                    this.selectStation(0);
                    // Auto-check the first radio button
                    const firstRadio = document.querySelector('input[name="station"]');
                    if (firstRadio) firstRadio.checked = true;
                }
            }, 1000);
        }
        
        this.hideLoadingScreen();
        
        this.hideLoadingScreen();
        
        // Update date/time every second
        setInterval(() => this.updateDateTime(), 1000);
        
        // Update session time every second
        setInterval(() => this.updateSessionTime(), 1000);
        
        // Update stats periodically
        setInterval(() => this.updateStats(), 5000);
    }

    setupUI() {
        // Simplified setup for Pip-Boy interface
        // No complex tab navigation needed for now
    }

    setupEventListeners() {
        // Volume slider
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.setVolume(e.target.value);
                const volumeDisplay = document.getElementById('volumeDisplay');
                if (volumeDisplay) {
                    volumeDisplay.textContent = e.target.value + '%';
                }
            });
        }

        // Audio player events
        this.audioPlayer.addEventListener('ended', () => this.playNextTrack());
        this.audioPlayer.addEventListener('play', () => this.onPlay());
        this.audioPlayer.addEventListener('pause', () => this.onPause());
        this.audioPlayer.addEventListener('error', (e) => this.onError(e));
        this.audioPlayer.addEventListener('timeupdate', () => this.onTimeUpdate());
    }

    loadStations() {
        const stationList = document.getElementById('stationList');
        stationList.innerHTML = '';

        // Only load YouTube stations
        const allStations = [];
        
        if (typeof YOUTUBE_STATIONS !== 'undefined') {
            allStations.push(...YOUTUBE_STATIONS.map(s => ({ ...s, sourceType: 'youtube' })));
        }

        if (allStations.length === 0) {
            stationList.innerHTML = '<div style="padding: 20px; text-align: center;">No stations available</div>';
            return;
        }

        // Store combined stations
        this.allStations = allStations;

        allStations.forEach((station, index) => {
            const stationElement = this.createStationElement(station, index);
            stationList.appendChild(stationElement);
        });
    }

    createStationElement(station, index) {
        const li = document.createElement('li');
        const input = document.createElement('input');
        const label = document.createElement('label');
        
        input.type = 'radio';
        input.name = 'station';
        input.id = `station-${index}`;
        input.value = index;
        
        label.setAttribute('for', `station-${index}`);
        label.textContent = station.name;
        
        li.appendChild(input);
        li.appendChild(label);
        
        input.addEventListener('change', () => this.selectStation(index));
        
        return li;
    }

    // Calculate synchronized playback position
    calculateSyncPosition(station) {
        // Get total elapsed time since global start
        const now = Date.now();
        const elapsedMs = now - this.GLOBAL_START_TIME;
        const elapsedSeconds = Math.floor(elapsedMs / 1000);
        
        console.log(`[SYNC DEBUG] Now: ${now}, Start: ${this.GLOBAL_START_TIME}, Elapsed: ${elapsedSeconds}s (${Math.floor(elapsedSeconds / 60)} min)`);
        
        // Calculate total playlist duration from startTimes
        let totalDuration = 0;
        for (let i = 0; i < station.tracks.length; i++) {
            const currentTrack = station.tracks[i];
            const nextTrack = station.tracks[i + 1];
            
            if (currentTrack.startTime !== undefined) {
                if (nextTrack && nextTrack.startTime !== undefined) {
                    // Duration is difference between this track and next
                    const trackDuration = nextTrack.startTime - currentTrack.startTime;
                    totalDuration += trackDuration;
                } else {
                    // Last track - assume 3 minutes duration
                    totalDuration += 180;
                }
            }
        }
        
        console.log(`[SYNC DEBUG] Total playlist duration: ${totalDuration}s (${Math.floor(totalDuration / 60)} min)`);
        
        // If no duration info, can't sync properly
        if (totalDuration === 0) {
            console.warn('No duration info for tracks, using default playback');
            return { trackIndex: 0, trackPosition: 0 };
        }
        
        // Find position in the infinite loop
        const positionInLoop = elapsedSeconds % totalDuration;
        console.log(`[SYNC DEBUG] Position in loop: ${positionInLoop}s (${Math.floor(positionInLoop / 60)} min)`);
        
        // Find which track and position
        let accumulatedTime = 0;
        for (let i = 0; i < station.tracks.length; i++) {
            const currentTrack = station.tracks[i];
            const nextTrack = station.tracks[i + 1];
            
            let trackDuration = 180; // Default 3 minutes
            if (currentTrack.startTime !== undefined && nextTrack && nextTrack.startTime !== undefined) {
                trackDuration = nextTrack.startTime - currentTrack.startTime;
            }
            
            if (accumulatedTime + trackDuration > positionInLoop) {
                // This is the current track
                const trackPosition = positionInLoop - accumulatedTime;
                console.log(`[SYNC DEBUG] Found track ${i + 1}: "${station.tracks[i].title}", position: ${Math.floor(trackPosition)}s`);
                return { trackIndex: i, trackPosition: trackPosition };
            }
            accumulatedTime += trackDuration;
        }
        
        // Fallback to start
        console.warn('[SYNC DEBUG] Fallback to start');
        return { trackIndex: 0, trackPosition: 0 };
    }

    selectStation(stationId) {
        if (!this.allStations || !this.allStations[stationId]) {
            console.error('Station not found');
            return;
        }

        console.log('[SELECT] Selecting station:', stationId, this.allStations[stationId].name);

        // Store if we were playing
        const wasPlaying = this.isPlaying;

        // Stop current playback and sync checker
        if (this.syncCheckInterval) {
            clearInterval(this.syncCheckInterval);
        }

        // Load station
        this.currentStation = this.allStations[stationId];
        this.playlist = [...this.currentStation.tracks];
        this.useYouTube = this.currentStation.sourceType === 'youtube';

        console.log('[SELECT] Loaded station with', this.playlist.length, 'tracks');

        // Calculate synchronized position for this station
        const syncPos = this.calculateSyncPosition(this.currentStation);
        this.currentTrackIndex = syncPos.trackIndex;
        
        console.log(`[SYNC] Jumping to track ${syncPos.trackIndex + 1}/${this.playlist.length}, position ${Math.floor(syncPos.trackPosition)}s`);

        // Update station info
        this.updateStationInfo();
        
        // Start playing at synchronized position (always play, don't pause)
        if (this.useYouTube && this.youtubePlayer) {
            console.log('[YOUTUBE] Loading playlist and starting playback');
            this.youtubePlayer.loadPlaylist(this.currentStation.youtubeVideoId, this.playlist);
            this.youtubePlayer.playTrack(syncPos.trackIndex, syncPos.trackPosition);
            this.updateNowPlaying(this.playlist[syncPos.trackIndex]);
            
            // Mark as playing since YouTube auto-plays
            this.isPlaying = true;
            this.updatePlayButton();
            
            // Start sync checker - resync every 30 seconds to handle drift
            this.startSyncChecker();
        } else {
            console.log('[LOCAL] Loading track from local file');
            this.loadTrack(syncPos.trackIndex);
            this.play();
        }
    }

    startSyncChecker() {
        // Check sync every 30 seconds and correct if needed
        this.syncCheckInterval = setInterval(() => {
            if (!this.currentStation || !this.isPlaying) return;
            
            const syncPos = this.calculateSyncPosition(this.currentStation);
            const currentTrack = this.youtubePlayer ? this.youtubePlayer.currentTrackIndex : this.currentTrackIndex;
            
            // If we're on wrong track, resync
            if (Math.abs(syncPos.trackIndex - currentTrack) > 0) {
                console.log(`[SYNC] Drift detected. Resyncing from track ${currentTrack + 1} to ${syncPos.trackIndex + 1}`);
                if (this.useYouTube && this.youtubePlayer) {
                    this.youtubePlayer.playTrack(syncPos.trackIndex, syncPos.trackPosition);
                    this.currentTrackIndex = syncPos.trackIndex;
                    this.updateNowPlaying(this.playlist[syncPos.trackIndex]);
                    this.updatePlaylist();
                }
            }
        }, 30000); // Check every 30 seconds
    }

    updateStationInfo() {
        if (!this.currentStation) return;

        // Update station name in the now playing section
        const stationNameElement = document.getElementById('currentStationName');
        if (stationNameElement) {
            stationNameElement.textContent = this.currentStation.name;
        }

        // Update playlist
        this.updatePlaylist();
    }

    updatePlaylist() {
        const playlistList = document.getElementById('playlistList');
        playlistList.innerHTML = '';

        if (!this.playlist || this.playlist.length === 0) {
            playlistList.innerHTML = '<li>No tracks in playlist</li>';
            return;
        }

        // Show next 10 tracks
        const upcomingTracks = this.playlist.slice(this.currentTrackIndex, this.currentTrackIndex + 10);
        
        upcomingTracks.forEach((track, index) => {
            const li = document.createElement('li');
            const icon = track.type === 'commentary' ? '🎤' : '🎵';
            li.textContent = `${index === 0 ? '▶ ' : ''}${icon} ${track.title} - ${track.artist}`;
            if (index === 0) li.style.fontWeight = 'bold';
            playlistList.appendChild(li);
        });
    }

    loadTrack(index) {
        if (!this.playlist || this.playlist.length === 0) return;

        this.currentTrackIndex = index % this.playlist.length;
        const track = this.playlist[this.currentTrackIndex];

        this.updateNowPlaying(track);

        // Load audio source only for local files
        if (!this.useYouTube) {
            this.audioPlayer.src = track.url;
        }
        
        // Update playlist
        this.updatePlaylist();

        // Show notification
        const trackType = track.type === 'commentary' ? 'Commentary' : 'Now Playing';
        this.showNotification(`${trackType}: ${track.title}`);
    }

    updateNowPlaying(track) {
        // Update track info
        document.getElementById('trackTitle').textContent = track.title;
        document.getElementById('trackArtist').textContent = track.artist;
        
        // Update station name
        if (this.currentStation) {
            document.getElementById('currentStationName').textContent = this.currentStation.name;
        }
    }

    play() {
        const playPromise = this.audioPlayer.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    this.isPlaying = true;
                    this.updatePlayButton();
                })
                .catch(error => {
                    console.error('Playback error:', error);
                    this.showNotification('Playback failed. Please try again.');
                });
        }
    }

    pause() {
        this.audioPlayer.pause();
        this.isPlaying = false;
        this.updatePlayButton();
    }

    togglePlayPause() {
        if (!this.currentStation) {
            this.showNotification('Please select a station first');
            return;
        }

        if (this.useYouTube && this.youtubePlayer) {
            if (this.youtubePlayer.isPlaying()) {
                this.youtubePlayer.pause();
            } else {
                this.youtubePlayer.play();
            }
        } else {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        }
    }

    playNextTrack() {
        if (!this.playlist || this.playlist.length === 0) return;
        
        if (this.useYouTube && this.youtubePlayer) {
            this.youtubePlayer.playNext();
        } else {
            this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
            this.loadTrack(this.currentTrackIndex);
            this.play();
        }
    }

    toggleMute() {
        const muteBtn = document.getElementById('muteBtn');
        const btnIcon = muteBtn.querySelector('.btn-icon');
        
        if (this.useYouTube && this.youtubePlayer) {
            const isMuted = btnIcon.textContent === '🔇';
            this.youtubePlayer.setMute(!isMuted);
            
            if (!isMuted) {
                btnIcon.textContent = '🔇';
                muteBtn.classList.add('active');
            } else {
                btnIcon.textContent = '🔊';
                muteBtn.classList.remove('active');
            }
        } else {
            this.audioPlayer.muted = !this.audioPlayer.muted;
            
            if (this.audioPlayer.muted) {
                btnIcon.textContent = '🔇';
                muteBtn.classList.add('active');
            } else {
                btnIcon.textContent = '🔊';
                muteBtn.classList.remove('active');
            }
        }
    }

    setVolume(value) {
        if (this.useYouTube && this.youtubePlayer) {
            this.youtubePlayer.setVolume(value);
        } else {
            this.audioPlayer.volume = value / 100;
        }
        const volumeDisplay = document.getElementById('volumeDisplay');
        if (volumeDisplay) {
            volumeDisplay.textContent = value + '%';
        }
    }

    updatePlayButton() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (!playPauseBtn) return;
        
        if (this.isPlaying) {
            playPauseBtn.textContent = '⏸ PAUSE';
            playPauseBtn.classList.add('active');
        } else {
            playPauseBtn.textContent = '▶ PLAY';
            playPauseBtn.classList.remove('active');
        }
    }

    onPlay() {
        this.isPlaying = true;
        this.updatePlayButton();
        this.updateStats();
    }

    onPause() {
        this.isPlaying = false;
        this.updatePlayButton();
        this.updateStats();
    }

    onError(e) {
        console.error('Audio error:', e);
        this.showNotification('Error loading track. Skipping...');
        setTimeout(() => this.playNextTrack(), 2000);
    }

    onTimeUpdate() {
        if (this.isPlaying) {
            this.playtimeSeconds++;
        }
    }

    switchInfoTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.info-tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });

        // Update panels
        document.querySelectorAll('.info-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        const panelMap = {
            'playlist': 'playlistPanel',
            'about': 'aboutPanel',
            'stats': 'statsPanel'
        };
        
        document.getElementById(panelMap[tabName]).classList.add('active');
    }

    updateDateTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        const displayHours = (hours % 12) || 12;
        
        const timeElement = document.getElementById('gameTime');
        if (timeElement) {
            timeElement.textContent = `${displayHours}:${minutes}${ampm}`;
        }
    }

    updateSessionTime() {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        
        const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        const sessionElement = document.getElementById('sessionTime');
        if (sessionElement) {
            sessionElement.textContent = formatted;
        }
    }

    updateStats() {
        // Update tracks played counter
        const tracksElement = document.getElementById('tracksPlayed');
        if (tracksElement && this.currentStation) {
            tracksElement.textContent = this.currentTrackIndex + 1;
        }

        // Update player status
        const statusElement = document.getElementById('playerStatus');
        if (statusElement) {
            statusElement.textContent = this.isPlaying ? 'Playing' : 'Paused';
        }
    }

    showNotification(message) {
        // Simple console notification for now
        // In a full implementation, you could show a toast notification
        console.log(`[Notification] ${message}`);
    }

    hideLoadingScreen() {
        // No loading screen in Pip-Boy UI
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.falloutRadio = new FalloutRadio();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (!window.falloutRadio) return;

    switch(e.key.toLowerCase()) {
        case ' ':
            e.preventDefault();
            window.falloutRadio.togglePlayPause();
            break;
        case 'm':
            window.falloutRadio.toggleMute();
            break;
        case 'arrowright':
            window.falloutRadio.playNextTrack();
            break;
    }
});
