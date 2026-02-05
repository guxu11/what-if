import { useState, useEffect, useRef } from 'react';

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);
  const oscillatorRef = useRef(null);

  useEffect(() => {
    // Load preferences from localStorage
    const savedVolume = localStorage.getItem('whatif-audio-volume');
    const savedPlaying = localStorage.getItem('whatif-audio-playing');

    if (savedVolume !== null) {
      setVolume(parseFloat(savedVolume));
    }
    if (savedPlaying === 'true') {
      setIsPlaying(true);
    }
  }, []);

  useEffect(() => {
    // Save preferences
    localStorage.setItem('whatif-audio-volume', volume.toString());
    localStorage.setItem('whatif-audio-playing', isPlaying.toString());

    // Update volume
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
    }
  }, [volume, isPlaying]);

  const startAudio = () => {
    if (oscillatorRef.current) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContextRef.current = new AudioContext();

    // Create gain node for volume control
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);

    // Create oscillator for ambient drone
    oscillatorRef.current = audioContextRef.current.createOscillator();
    oscillatorRef.current.type = 'sine';
    oscillatorRef.current.frequency.setValueAtTime(65.41, audioContextRef.current.currentTime); // C2 note

    // Create LFO for subtle modulation
    const lfo = audioContextRef.current.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.5, audioContextRef.current.currentTime);

    const lfoGain = audioContextRef.current.createGain();
    lfoGain.gain.setValueAtTime(5, audioContextRef.current.currentTime);

    // Connect LFO to oscillator frequency
    lfo.connect(lfoGain);
    lfoGain.connect(oscillatorRef.current.frequency);

    // Connect oscillator to gain
    oscillatorRef.current.connect(gainNodeRef.current);
    gainNodeRef.current.connect(audioContextRef.current.destination);

    // Start audio
    oscillatorRef.current.start();
    lfo.start();
  };

  const stopAudio = () => {
    if (oscillatorRef.current) {
      const context = audioContextRef.current;
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
      audioContextRef.current = null;
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      startAudio();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="audio-player">
      <button
        className="audio-btn"
        onClick={togglePlay}
        title={isPlaying ? 'Mute' : 'Play Music'}
      >
        {isPlaying ? '🔇' : '🔊'}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        className="audio-volume"
        title="Volume"
      />
    </div>
  );
}
