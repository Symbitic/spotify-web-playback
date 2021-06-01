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
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  /** Device name. */
  name: string;
  /** Device type. */
  type: string;
  /** Volume level (as a percentage between `0` and `100`). */
  volume_percent: number;
}

/**
 * An artist on Spotify.
 */
export interface SpotifyArtist {
  external_urls: {
    spotify: string;
  };
  href: string;
  /** Artist ID. */
  id: string;
  /** Artist name. */
  name: string;
  type: string;
  uri: string;
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

export interface SpotifyPlayOptions {
  context_uri?: string;
  deviceId: string;
  offset?: number;
  uris?: string[];
}

/**
 * Status of a Spotify player.
 */
export interface SpotifyPlayerStatus {
  actions: {
    disallows: {
      resuming: boolean;
      skipping_prev: boolean;
    };
  };
  /** @hidden */
  context: null;
  currently_playing_type: string;
  /** Current device. */
  device: SpotifyDevice;
  is_playing: boolean;
  item: {
    album: {
      album_type: string;
      artists: SpotifyArtist[];
      available_markets: string[];
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      images: SpotifyImage[];
      name: string;
      release_date: string;
      release_date_precision: string;
      total_tracks: number;
      type: string;
      uri: string;
    };
    artists: SpotifyArtist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: false;
    external_ids: {
      isrc: string;
    };
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    is_local: false;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
  };
  /** Progress (in milliseconds). */
  progress_ms: number;
  repeat_state: string;
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
