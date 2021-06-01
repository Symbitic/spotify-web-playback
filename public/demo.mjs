import SpotifyPlayer from './index.mjs';

let token = '';

const uri = 'spotify:album:51QBkcL7S3KYdXSSA0zM9R';

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
