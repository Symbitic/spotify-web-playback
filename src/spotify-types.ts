/**
 * @todo https://developer.spotify.com/documentation/web-playback-sdk/reference/
 */

/**
 * Generic method type.
 */
export type SpotifyWebPlaybackMethod<T = void, R = void> = (args: T) => R;

/** @hidden */
export type SpotifyOAuthCallback = SpotifyWebPlaybackMethod<string, Promise<void>>;

/**
 * Status events.
 */
export type SpotifyWebPlaybackStatusType = 'ready' | 'not_ready';

/**
 * State change event.
 */
export type SpotifyWebPlaybackStateType = 'player_state_changed';

/**
 * Error events.
 */
export type SpotifyWebPlaybackErrorType =
  | 'initialization_error'
  | 'authentication_error'
  | 'account_error'
  | 'playback_error';

/** @hidden */
export interface SpotifyWebPlaybackError {
  message: SpotifyWebPlaybackErrorType;
}

/** @hidden */
export interface SpotifyWebPlaybackReady {
  device_id: string;
}

/** @hidden */
export interface SpotifyWebPlaybackState {
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
    current_track: SpotifyWebPlaybackTrack;
    next_tracks: SpotifyWebPlaybackTrack[];
    previous_tracks: SpotifyWebPlaybackTrack[];
  };
}

/** @hidden */
export interface SpotifyWebPlaybackArtist {
  name: string;
  uri: string;
}

/** @hidden */
export interface SpotifyWebPlaybackImage {
  height: number;
  url: string;
  width: number;
}

/** @hidden */
export interface SpotifyWebPlaybackAlbum {
  images: SpotifyWebPlaybackImage[];
  name: string;
  uri: string;
}

/** @hidden */
export interface SpotifyWebPlaybackTrack {
  album: SpotifyWebPlaybackAlbum;
  artists: SpotifyWebPlaybackArtist[];
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

/**
 * Event callbacks.
 */
export type SpotifyListenerType = 'error' | 'state' | 'ready';

/**
 * An event listener for when an error occurs.
 */
export type SpotifyErrorListener = SpotifyWebPlaybackMethod<SpotifyWebPlaybackErrorType>;

/**
 * An event listener for when the playback state changes.
 */
export type SpotifyStateListener = SpotifyWebPlaybackMethod<SpotifyWebPlaybackState | null>;

/**
 * An event listener for when the player status changes.
 */
export type SpotifyStatusListener = SpotifyWebPlaybackMethod<SpotifyWebPlaybackStatusType>;

/**
 * Event listeners.
 */
export type SpotifyListener = SpotifyErrorListener | SpotifyStateListener | SpotifyStatusListener;


/** @hidden */
export type SpotifyErrorCallback = SpotifyWebPlaybackMethod<SpotifyWebPlaybackError>;

/** @hidden */
export type SpotifyStateCallback = SpotifyWebPlaybackMethod<SpotifyWebPlaybackState | null>;

/** @hidden */
export type SpotifyStatusCallback = SpotifyWebPlaybackMethod<SpotifyWebPlaybackReady>;

/** @hidden */
export interface SpotifyWebPlaybackPlayer {
  _options: {
    getOAuthToken: SpotifyOAuthCallback;
    name: string;
    id: string;
    volume: number;
  };
  addListener: {
    (event: SpotifyWebPlaybackErrorType, callback: SpotifyErrorCallback): boolean;
    (event: SpotifyWebPlaybackStateType, callback: SpotifyStateCallback): boolean;
    (event: SpotifyWebPlaybackStatusType, callback: SpotifyStatusCallback): boolean;
  };
  connect: SpotifyWebPlaybackMethod<void, boolean>;
  activateElement: SpotifyWebPlaybackMethod<void, Promise<void>>;
  disconnect: SpotifyWebPlaybackMethod;
  getCurrentState: SpotifyWebPlaybackMethod<void, Promise<SpotifyWebPlaybackState | null>>;
  getVolume: SpotifyWebPlaybackMethod<void, number>;
  pause: SpotifyWebPlaybackMethod;
  nextTrack: SpotifyWebPlaybackMethod;
  previousTrack: SpotifyWebPlaybackMethod;
  removeListener: (
    event: SpotifyWebPlaybackErrorType | SpotifyWebPlaybackStateType | SpotifyWebPlaybackStatusType,
    callback?: SpotifyWebPlaybackMethod,
  ) => boolean;
  resume: SpotifyWebPlaybackMethod;
  seek: (positionMS: number) => Promise<void>;
  setName: (name: string) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  togglePlay: SpotifyWebPlaybackMethod;
}

/**
 * Different Spotify devices.
 */
export enum SpotifyDeviceType {
  /** The Spotify web player. */
  Computer = 'Computer',
  /** The Spotify app running on a tablet device. */
  Tablet = 'Tablet',
  /** The Spotify app running on a smartphone */
  Smartphone = 'Smartphone',
  /** A speaker with Spotify built in. */
  Speaker = 'Speaker',
  /** A smart TV with Spotify. */
  TV = 'TV',
  /** AV Receiver. */
  AVR = 'AVR',
  /** Set-top Box. */
  STB = 'STB',
  /** Spotify Connect. */
  AudioDongle = 'AudioDongle',
  /** Video game console. */
  GameConsole = 'GameConsole',
  /** Chromecast audio. */
  CastVideo = 'CastVideo',
  /** Chromecast video. */
  CastAudio = 'CastAudio',
  /** Automobile. */
  Automobile = 'Automobile',
  /** Unknown. */
  Unknown = 'Unknown'
};

/**
 * Represents a single Spotify device capable of streaming music.
 */
export interface SpotifyDevice {
  /** Device ID. */
  id: string;
  /** Device name. */
  name: string;
  /** Device type, such as "Computer", "Smartphone", or "Speaker". */
  type: SpotifyDeviceType;
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
  /** A list of the genres the artist is associated with. */
  genres: string[];
  /** The Web API endpoint providing full details of the artist. */
  href: string;
  /** The Spotify ID for the artist. */
  id: string;
  /** The name of the artist. */
  name: string;
  /** The Spotify URI for the artist. */
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

/**
 * A Spotify album.
 */
export interface SpotifyAlbum {
  /** Album ID. */
  id: string;
  /** Album name. */
  name: string;
  /** Album type. */
  album_type: 'album' | 'single' | 'compilation';
  /** List of artists for this album. */
  artists: SpotifyArtist[];
  /** List of markets this track is available in. */
  available_markets: string[];
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
  /** The Spotify URI for this album. */
  uri: string;
};

interface SpotifyTrack {
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
  explicit: boolean;
  /** A link to the Web API endpoint providing full details of the track. */
  href: string;
  /** The Spotify ID for the track. */
  id: string;
  /** Indicates if this track is a local file or not. */
  is_local: boolean;
  /** The name of the track. */
  name: string;
  /** The popularity of this album (`0` to `100`). */
  popularity: number;
  /** A link to a 30 second preview (MP3 format) of the track. Can be `null`. */
  preview_url: string | null;
  /** The number of the track. If an album has several discs, the track number is the number on the specified disc. */
  track_number: number;
  /** The object type. Will always be `track`. */
  type: string;
  /** The Spotify URI for the track. */
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
  /** Track image URL. */
  image: string;
  /** Track name. */
  name: string;
  /** The Spotify URI for the track. */
  uri: string;
}

/**
 * The Artist of an album.
 */
export interface SpotifyPlaylistArtist {
  /** The Spotify ID for the artist. */
  id: string;
  /** Name of this artist. */
  name: string;
}

/**
 * A single track in a playlist.
 *
 * Use `uri` for playing tracks with the Web Playback SDK.
 */
export interface SpotifyPlaylistTrack {
  /** List of artists. */
  artists: SpotifyPlaylistArtist[];
  /** Duration in milliseconds. */
  duration: number;
  /** Spotify ID. */
  id: string;
  /** Album image. */
  image: SpotifyImage;
  /** Track name. */
  name: string;
  /** The Spotify URI for the track. */
  uri: string;
};

export interface SpotifyPlaylist {
  /** The name of the playlist. */
  name: string;
  /** Playlist items. */
  tracks: SpotifyPlaylistTrack[];
};
