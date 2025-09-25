# Audio Files for Energy Quest Game

## Background Music
- **background_music.mp3**: Ambient background music for Level 1 (Living Room)
  - Should be calm, ambient music suitable for a living room environment
  - Duration: 2-5 minutes with seamless loop capability
  - Volume: Automatically set to 30% in game

## Dramatic Sound Effects
- **dramatic_sound.mp3**: Dramatic sound effect for special moments
  - Used for puzzle completion, video playback, and victory moments
  - Should be a short dramatic chord, fanfare, or triumphant sound
  - Duration: 2-5 seconds
  - Volume: Automatically set to 50-60% in game

## Implementation Notes
- Audio files are integrated into Scene 2 Level 1, Splash Screen, and Main Menu
- Background music plays automatically with fallback for autoplay restrictions
- Dramatic sounds trigger on:
  - Cable puzzle completion
  - TV puzzle completion
  - Video playback start
  - Main menu video events

## File Locations
- HTML audio elements: `scene2-level1.html`
- JavaScript integration: `scene2-level1.js`, `splashScreen.js`, `main-menu.js`
- Audio controls: Volume adjustment, play/pause, mute functions available

## Browser Compatibility
- MP3 format chosen for broad browser support
- Fallback error handling for autoplay restrictions
- User interaction triggers for blocked autoplay scenarios