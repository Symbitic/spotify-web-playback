/**
 * @todo https://developer.spotify.com/documentation/web-playback-sdk/reference/
 */

/** @hidden */
type SpotifyPlayerMethod<T = void> = () => Promise<T>;

/** @hidden */
export type SpotifyPlayerCallback = (token: string) => void;

/**
 * Represents a single Spotify device capable of streaming music.
 */
export interface SpotifyDevice {
  /** Device ID. */
  id: string;
  /** Device name. */
  name: string;
  /** Device type, such as "Computer", "Smartphone", or "Speaker". */
  type: string;
  /** Volume level (as a percentage between `0` and `100`). */
  volume_percent: number;
  /** Indicates if this device is the user's currently active device. */
  is_active: boolean;
  /** Indicates if this device is currently in a private session. */
  is_private_session: boolean;
  /** Indicates if this device is restricted from accepting Web API commands. */
  is_restricted: boolean;
}

/**
 * An artist on Spotify.
 */
export interface SpotifyArtist {
  /** Artist ID. */
  id: string;
  /** Artist name. */
  name: string;
  /** Artist URI. */
  uri: string;
  external_urls: {
    /** The open.spotify.com URL. */
    spotify: string;
  };
  /** The Web API endpoint providing full details of the artist. */
  href: string;
  type: string;
}

/**
 * The image of an album/song/artist from Spotify.
 */
export interface SpotifyImage {
  /** Image width. */
  width: number;
  /** Image height. */
  height: number;
  /** Image URL. */
  url: string;
}

/**
 * A Spotify album.
 */
export interface SpotifyAlbum {
  /** Album ID. */
  id: string;
  /** Album name. */
  name: string;
  type: string; // 'artist'
  /** Album type. */
  album_type: string; // 'album' | 'single' | 'compilation'
  /** List of artists for this album. */
  artists: SpotifyArtist[];
  /** List of markets this track is available in. */
  available_markets: string[];
  /** Web browser URLs. */
  external_urls: {
    /** The open.spotify.com URL. */
    spotify: string;
  };
  /** The api.spotify.com URL. */
  href: string;
  /** List of images for this album. */
  images: SpotifyImage[];
  /** Release date (YYYY-MM-DD). */
  release_date: string;
  /** The precision with which the release date is known. */
  release_date_precision: 'year' | 'month' | 'day';
  /** Number of tracks in this album. */
  total_tracks: number;
  uri: string;
};

export interface SpotifyTrack {
  /** Album information. */
  album: SpotifyAlbum;
  /** List of artists. */
  artists: SpotifyArtist[];
  /** List of markets this track is available in. */
  available_markets: string[];
  /** The disc number (set to 1 unless the album has more than one disc). */
  disc_number: number;
  /** Track length in milliseconds. */
  duration_ms: number;
  /** Indicates if this track has explicit material. */
  explicit: false;
  external_ids: {
    isrc: string;
  };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  /** Indicates if this track is a local file or not. */
  is_local: false;
  /** The popularity of this album (`0` to `100`). */
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
};

/**
 * Status of a Spotify player.
 */
export interface SpotifyPlayerStatus {
  name: string;
  actions: {
    /** Indicates which actions are not allowed. */
    disallows: {
      resuming: boolean;
      skipping_prev: boolean;
    };
  };
  /** @hidden */
  context: null;
  /** The object type of the currently playing item. */
  currently_playing_type: 'track' | 'episode' | 'ad' | 'unknown';
  /** Current device. */
  device: SpotifyDevice;
  /** Indicates if something is currently playing. */
  is_playing: boolean;
  /** The currently active track. */
  item: SpotifyTrack;
  /** Progress (in milliseconds). */
  progress_ms: number;
  /** What (if anything) is being repeated. */
  repeat_state: 'off' | 'track' | 'context';
  /** Indicates if shuffle mode is on. */
  shuffle_state: false;
  /** Timestamp. */
  timestamp: number;
}

/**
 * A Spotify track.
 */
export interface SpotifyPlayerTrack {
  /** List of artist names. */
  artists: string[];
  /** Duration in milliseconds. */
  duration: number;
  /** Track unique ID. */
  id: string;
  /** Track name. */
  name: string;
  /** Track image URL. */
  image: string;
  /** Spotify URI. */
  uri: string;
}

/** @hidden */
export type WebPlaybackStatuses = 'ready' | 'not_ready';

/** @hidden */
export type WebPlaybackStates = 'player_state_changed';

/** @hidden */
export type WebPlaybackErrors =
  | 'initialization_error'
  | 'authentication_error'
  | 'account_error'
  | 'playback_error';

/** @hidden */
export interface WebPlaybackError {
  message: WebPlaybackErrors;
}

/** @hidden */
export interface WebPlaybackReady {
  device_id: string;
}

/** @hidden */
export interface WebPlaybackState {
  bitrate: number;
  context: {
    metadata: Record<string, unknown>;
    uri: null;
  };
  disallows: {
    resuming: boolean;
    skipping_prev: boolean;
  };
  duration: number;
  paused: boolean;
  position: number;
  repeat_mode: number;
  restrictions: {
    disallow_resuming_reasons: [];
    disallow_skipping_prev_reasons: [];
  };
  shuffle: boolean;
  timestamp: number;
  track_window: {
    current_track: WebPlaybackTrack;
    next_tracks: WebPlaybackTrack[];
    previous_tracks: WebPlaybackTrack[];
  };
}

/** @hidden */
export interface WebPlaybackAlbum {
  images: WebPlaybackImage[];
  name: string;
  uri: string;
}

/** @hidden */
export interface WebPlaybackArtist {
  name: string;
  uri: string;
}

/** @hidden */
export interface WebPlaybackImage {
  height: number;
  url: string;
  width: number;
}

/** @hidden */
export interface WebPlaybackTrack {
  album: WebPlaybackAlbum;
  artists: WebPlaybackArtist[];
  duration_ms: number;
  id: string;
  is_playable: boolean;
  linked_from: {
    uri: null | string;
    id: null | string;
  };
  linked_from_uri: null | string;
  media_type: string;
  name: string;
  type: string;
  uri: string;
}

/** @hidden */
export interface WebPlaybackPlayer {
  _options: {
    getOAuthToken: SpotifyPlayerCallback;
    name: string;
    id: string;
    volume: number;
  };
  addListener: {
    (event: WebPlaybackErrors, callback: (d: WebPlaybackError) => void): boolean;
    (event: WebPlaybackStates, callback: (d: WebPlaybackState | null) => void): boolean;
    (event: WebPlaybackStatuses, callback: (d: WebPlaybackReady) => void): boolean;
  };
  connect: SpotifyPlayerMethod<boolean>;
  disconnect: () => void;
  getCurrentState: () => Promise<WebPlaybackState | null>;
  getVolume: SpotifyPlayerMethod<number>;
  pause: SpotifyPlayerMethod;
  nextTrack: SpotifyPlayerMethod;
  previousTrack: SpotifyPlayerMethod;
  removeListener: (
    event: WebPlaybackErrors | WebPlaybackStates | WebPlaybackStatuses,
    callback?: () => void,
  ) => boolean;
  resume: SpotifyPlayerMethod;
  seek: (positionMS: number) => Promise<void>;
  setName: (n: string) => Promise<void>;
  setVolume: (n: number) => Promise<void>;
  togglePlay: SpotifyPlayerMethod;
}
