// ==========================================
// YOUTUBE PLAYER INTEGRATION
// Play music directly from YouTube videos
// ==========================================

/**
 * This module allows playing music from YouTube videos with timestamps
 * Perfect for full station broadcasts with DJ commentary
 */

class YouTubePlayer {
    constructor() {
        this.player = null;
        this.isReady = false;
        this.currentVideoId = null;
        this.playlist = [];
        this.currentIndex = 0;
    }

    /**
     * Initialize YouTube IFrame API
     */
    init() {
        // Load YouTube IFrame API
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        // API will call this when ready
        window.onYouTubeIframeAPIReady = () => {
            this.createPlayer();
        };
    }

    /**
     * Create the YouTube player
     */
    createPlayer() {
        this.player = new YT.Player('youtubePlayer', {
            height: '0',
            width: '0',
            videoId: '',
            playerVars: {
                'autoplay': 0,
                'controls': 0,
                'disablekb': 1,
                'fs': 0,
                'modestbranding': 1,
                'playsinline': 1
            },
            events: {
                'onReady': (event) => this.onPlayerReady(event),
                'onStateChange': (event) => this.onPlayerStateChange(event),
                'onError': (event) => this.onPlayerError(event)
            }
        });
    }

    /**
     * Player ready callback
     */
    onPlayerReady(event) {
        this.isReady = true;
        console.log('YouTube player ready');
    }

    /**
     * Player state change callback
     */
    onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.ENDED) {
            // Track ended - use callback if set, otherwise play next
            if (this.onTrackEnd) {
                this.onTrackEnd();
            } else {
                this.playNext();
            }
        } else if (event.data === YT.PlayerState.PLAYING) {
            // Update UI
            if (window.falloutRadio) {
                window.falloutRadio.onPlay();
            }
        } else if (event.data === YT.PlayerState.PAUSED) {
            // Update UI
            if (window.falloutRadio) {
                window.falloutRadio.onPause();
            }
        }
    }

    /**
     * Handle player errors
     */
    onPlayerError(event) {
        console.error('YouTube player error:', event.data);
        // Try next track
        this.playNext();
    }

    /**
     * Load a playlist from timestamps
     */
    loadPlaylist(videoId, tracks) {
        this.currentVideoId = videoId;
        this.playlist = tracks;
        this.currentIndex = 0;
    }

    /**
     * Play a specific track by index
     * @param {number} index - Track index
     * @param {number} offsetSeconds - Seconds into the track to start (optional)
     */
    playTrack(index, offsetSeconds = 0) {
        if (!this.isReady || !this.playlist.length) return;

        this.currentIndex = index % this.playlist.length;
        this.currentTrackIndex = this.currentIndex; // Store for sync checking
        const track = this.playlist[this.currentIndex];

        // Calculate end time (start of next track or video end)
        const nextTrack = this.playlist[this.currentIndex + 1];
        const endTime = nextTrack ? nextTrack.startTime : undefined;

        // Calculate actual start position with offset
        const startPosition = track.startTime + offsetSeconds;

        // Load video with start time
        this.player.loadVideoById({
            videoId: this.currentVideoId,
            startSeconds: startPosition,
            endSeconds: endTime
        });

        console.log(`[YouTube] Playing track ${index + 1}: ${track.title} at ${offsetSeconds}s offset (video time: ${startPosition}s)`);

        // Update now playing info
        if (window.falloutRadio) {
            window.falloutRadio.updateNowPlaying(track);
        }
    }

    /**
     * Play current track
     */
    play() {
        if (this.player && this.isReady) {
            this.player.playVideo();
        }
    }

    /**
     * Pause playback
     */
    pause() {
        if (this.player && this.isReady) {
            this.player.pauseVideo();
        }
    }

    /**
     * Play next track
     */
    playNext() {
        const nextIndex = (this.currentIndex + 1) % this.playlist.length;
        this.playTrack(nextIndex);
    }

    /**
     * Set volume (0-100)
     */
    setVolume(volume) {
        if (this.player && this.isReady) {
            this.player.setVolume(volume);
        }
    }

    /**
     * Mute/unmute
     */
    setMute(muted) {
        if (this.player && this.isReady) {
            if (muted) {
                this.player.mute();
            } else {
                this.player.unMute();
            }
        }
    }

    /**
     * Check if playing
     */
    isPlaying() {
        if (this.player && this.isReady) {
            return this.player.getPlayerState() === YT.PlayerState.PLAYING;
        }
        return false;
    }

    /**
     * Get current track
     */
    getCurrentTrack() {
        return this.playlist[this.currentIndex];
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = YouTubePlayer;
}
