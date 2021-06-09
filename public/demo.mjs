import SpotifyPlayer from './index.mjs';

let token = '';

let uri = 'spotify:track:54flyrjcdnQdco7300avMJ';

const loginEl = document.getElementById('login');
const playEl = document.getElementById('play');
const connectEl = document.getElementById('connect');
const playButtonEl = document.getElementById('play-button');
const pauseButtonEl = document.getElementById('pause-button');
const connectButtonEl = document.getElementById('connect-button');
const connectMessageEl = document.getElementById('connect-message');

const spotify = new SpotifyPlayer();

window.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('/test');
  const { type, data } = await response.json();
  if (type === 'success') {
    token = data;
    loginEl.style.display = 'none';
    connectEl.style.display = 'initial';
  }
});

connectButtonEl.addEventListener('click', async () => {
  try {
    const ret = await spotify.connect(token);
    if (ret) {
      const playlists = await spotify.getUsersPlaylists();

      // Play a random track from the user's favorites.
      const idx = Math.floor(Math.random() * playlists[0].tracks.length)
      uri = playlists[0].tracks[idx].uri;

      playEl.style.display = 'initial';
      connectEl.style.display = 'none';
    } else {
      connectMessageEl.innerHTML = `Error connecting to Spotify`;
    }
  } catch (err) {
    connectMessageEl.innerHTML = `Error connecting to Spotify: ${err.message}`;
  }
})

playButtonEl.addEventListener('click', () => {
  spotify.play(uri);
});

pauseButtonEl.addEventListener('click', () => {
  spotify.pause();
});
