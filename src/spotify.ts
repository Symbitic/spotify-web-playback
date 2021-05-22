import {
  SpotifyDevice,
  SpotifyPlayerCallback,
  SpotifyPlayerStatus,
  SpotifyPlayerTrack,
  WebPlaybackAlbum,
  WebPlaybackError,
  WebPlaybackErrors,
  WebPlaybackImage,
  WebPlaybackPlayer,
  WebPlaybackState,
} from './spotify-types';

export * from './spotify-types';

/** @hidden */
const EMPTY_TRACK: SpotifyPlayerTrack = {
  artists: [],
  duration: 0,
  id: '',
  name: '',
  image: '',
  uri: ''
};

/** @hidden */
function loadSpotifyPlayer(): Promise<any> {
  return new Promise<void>((resolve, reject) => {
    const scriptTag = document.getElementById("spotify-player");

    if (!scriptTag) {
      const script = document.createElement("script");

      script.id = "spotify-player";
      script.type = "text/javascript";
      script.async = false;
      script.defer = true;
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.onload = () => resolve();
      script.onerror = (error: any) =>
        reject(new Error(`loadScript: ${error.message}`));

      document.head.appendChild(script);
    } else {
      resolve();
    }
  });
}

/**
 * Spotify web player.
 */
export class SpotifyPlayer {
  private readonly _baseUrl = 'https://api.spotify.com/v1/me';

  private _player?: WebPlaybackPlayer;
  private _name;
  private _volume;
  private _deviceId: string = '';
  private _token: string = '';
  private _playing: boolean = false;
  private _ready: boolean = false;
  private _error: string = '';
  private _errorType: WebPlaybackErrors | '' = '';
  private _position: number = 0;
  private _track: SpotifyPlayerTrack = EMPTY_TRACK;
  
  /**
   * Required scopes for a token.
   */
  readonly scopes = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-library-read',
    'user-library-modify',
    'user-read-playback-state',
    'user-modify-playback-state'
  ];

  /**
   * Indicates if a media is playing.
   */
  get playing() {
    return this._playing;
  }

  /**
   * Indicates if the player has been initialized and is ready for playing.
   */
  get ready() {
    return this._ready;
  }

  /**
   * Error message. (empty if no error occurred)
   */
  get error() {
    return this._error;
  }

  /**
   * Error type. (empty if no error occurred)
   */
  get errorType() {
    return this._errorType;
  }

  /**
   * Current position.
   */
  get position() {
    return this._position;
  }

  /**
   * The current track.
   */
  get track() {
    return this._track;
  }

  /**
   * Create a new SpotifyPlayer instance.
   * @param name Player name.
   * @param volume Volume level. (default = 1.0)
   */
  constructor(name: string, volume: number = 1.0) {
    this._name = name;
    this._volume = volume;

    this.handlePlayerStateChanges = this.handlePlayerStateChanges.bind(this);
    this.handlePlayerErrors = this.handlePlayerErrors.bind(this);
  }

  /**
   * Connect to Spotify.
   * @param token Spotify token.
   * @returns `true` if successful, `false` otherwise.
   */
  async connect(token: string) {
    this._token = token;

    await Promise.all([
      this.waitForReady(),
      loadSpotifyPlayer()
    ]);

    const name = this._name;
    const volume = this._volume;

    // @ts-ignore
    this._player = new window.Spotify.Player({
      name,
      volume,
      getOAuthToken: (cb: SpotifyPlayerCallback) => {
        cb(token);
      },
    }) as WebPlaybackPlayer;

    return this.waitForConnection();
  }

  /**
   * Wait for the player to connect and emit the 'ready' signal.
   * 
   * @returns Promise that resolves to a boolean indicating if the connection
   * was successful.
   */
  protected waitForConnection() {
    if (!this._player) {
      return Promise.resolve(false);
    }

    const player = this._player;

    this._player.addListener('player_state_changed', this.handlePlayerStateChanges);

    this._player.addListener('initialization_error', (error: WebPlaybackError) => {
      this.handlePlayerErrors('initialization_error', error);
    });

    this._player.addListener('authentication_error', (error: WebPlaybackError) => {
      this.handlePlayerErrors('authentication_error', error)
    });

    this._player.addListener('account_error', (error: WebPlaybackError) => {
      this.handlePlayerErrors('account_error', error)
    });

    this._player.addListener('playback_error', (error: WebPlaybackError) => {
      this.handlePlayerErrors('playback_error', error)
    });
    
    const deviceConnected = (deviceId: string) => {
      this._deviceId = deviceId;
      this._ready = true;
    }

    const deviceDisconnected = () => {
      this._ready = false;
    }

    return new Promise((resolve) => {
      player.addListener('ready', async ({ device_id }) => {
        deviceConnected(device_id);
        resolve(true);
      });

      player.addListener('not_ready', () => {
        deviceDisconnected();
        resolve(false);
      });
      
      player.connect()
        //.then((ret: boolean) => resolve(ret));
    });
  }

  /**
   * Appends a script to spotify-player.js to the DOM.
   * @returns Promise that resolves when the web player script has been loaded.
   */
  protected waitForReady(): Promise<void> {
    return new Promise((resolve) => {
      const initialize = () => {
        resolve();
      }
      if (!window.onSpotifyWebPlaybackSDKReady) {
        window.onSpotifyWebPlaybackSDKReady = initialize;
      } else {
        initialize();
      }
    });
  }

  /**
   * Begin playback.
   */
  async play(items?: string | string[], offset: number = 0) {
    let body;

    if (Array.isArray(items) && items.length) {
      body = JSON.stringify({
        uris: items,
        offset: { position: offset }
      });
    } else if (items)  {
      const isArtist = items.indexOf('artist') >= 0;
      let position;

      if (!isArtist) {
        position = { position: offset };
      }

      body = JSON.stringify({
        context_uri: items,
        offset: position
      });
    }
  
    await fetch(`${this._baseUrl}/player/play?device_id=${this._deviceId}`, {
      method: 'PUT',
      body,
      headers: {
        'Authorization': `Bearer ${this._token}`,
        'Content-Type': 'application/json'
      },
    });
  }

  /**
   * Pause playback.
   */
  async pause() {
    await fetch(`${this._baseUrl}/player/pause`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this._token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Skip to the previous track.
   */
  async previous() {
    await fetch(`${this._baseUrl}/player/previous`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this._token}`,
        'Content-Type': 'application/json'
      }
    });
  }
  
  /**
   * Skip to the next track.
   */
  async next() {
    await fetch(`${this._baseUrl}/player/next`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this._token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Seek to position.
   */
  async seek(position: number) {
    await fetch(
      `${this._baseUrl}/player/seek?position_ms=${position}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this._token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  /**
   * Get a list of all a user's devices.
   */
  async getDevices(): Promise<SpotifyDevice[]> {
    const response = await fetch(`${this._baseUrl}/player/devices`, {
      headers: {
        Authorization: `Bearer ${this._token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    const { devices } = await response.json();
    return devices;
  }

  /**
   * Get current playback state.
   */
  async getPlaybackState(): Promise<SpotifyPlayerStatus | null> {
    const response = await fetch(`${this._baseUrl}/player`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this._token}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.status === 204) {
      return null;
    }
    return response.json();
  }

  /**
   * Check if a track or a list of tracks is saved in the user's library.
   */
  async getTracksStatus(tracks: string | string[]): Promise<boolean[]> {
    const ids = Array.isArray(tracks) ? tracks : [tracks];
  
    const response = await fetch(`${this._baseUrl}/tracks/contains?ids=${ids}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this._token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }

  /**
   * @TODO Not sure if this needs to be public or not.
   * https://developer.spotify.com/documentation/web-api/reference/#endpoint-transfer-a-users-playback
   */
  setDevice(deviceId: string, shouldPlay?: boolean) {
    return fetch(`${this._baseUrl}/player`, {
      method: 'PUT',
      body: JSON.stringify({ device_ids: [ deviceId ], play: shouldPlay }),
      headers: {
        'Authorization': `Bearer ${this._token}`,
        'Content-Type': 'application/json'
      },
    });
  }
  
  /**
   * Set the current volume level
   * @param volume Volume percentage from 0 to 100.
   */
  async setVolume(volume: number) {
    const url = `${this._baseUrl}/player/volume?volume_percent=${volume}`;
    await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this._token}`,
        'Content-Type': 'application/json',
      }
    });
  }

  private getAlbumImage(album: WebPlaybackAlbum) {
    const width = Math.min(...album.images.map((d) => d.width));
    const thumb: WebPlaybackImage =
      album.images.find((d) => d.width === width) || ({} as WebPlaybackImage);

    return thumb.url;
  }

  private async handlePlayerStateChanges(state: WebPlaybackState | null) {
    if (!state) {
      this._track = EMPTY_TRACK;
      this._position = 0;
      this._playing = false;
      return;
    }

    const {
      paused,
      position,
      track_window: {
        current_track: { album, artists, duration_ms, id, name, uri }
      },
    } = state;

    this._playing = !paused;
    this._position = position;

    this._track = {
      artists: artists.map(({ name }) => name),
      duration: duration_ms,
      image: this.getAlbumImage(album),
      id,
      name,
      uri
    };
  }

  private handlePlayerErrors(type: WebPlaybackErrors | '', error: WebPlaybackError) {
    this._error = error.message;
    this._errorType = type;
    this._ready = false;

    if (this._player && type !== 'playback_error') {
      this._player.removeListener('player_state_changed');
      this._player.removeListener('initialization_error');
      this._player.removeListener('authentication_error');
      this._player.removeListener('account_error');
      this._player.disconnect();
    }
  }
}
