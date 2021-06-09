# Spotify Web Playback

Spotify Web Playback is a TypeScript-enabled API for using the [Spotify Web Playback SDK].

The Spotify Web Playback SDK enables developers to stream and play Spotify tracks
in any web browser that supports [Encrypted Media Extensions]
(currently only FireFox, Google Chrome, and Microsoft Edge are supported).

Read the documentation [here][docs].

## Setup

Install spotify-web-playback by running:

    npm i -s spotify-web-playback

or

    yarn add spotify-web-playback

Deno or web browser users can use:

```javascript
import Spotify from 'https://esm.sh/spotify-web-playback';
```

## Getting Started

```javascript
const token = '<SPOTIFY_TOKEN>';

const uri = 'spotify:track:54flyrjcdnQdco7300avMJ';

const spotify = new SpotifyPlayer();

await spotify.connect(token);

spotify.play(uri);
```

## Authorization

**This library does not handle obtaining a Spotify token. You have to take care of that yourself.**

You have two options:

1. Click [here] to obtain a temporary token. You can pass it to your code, but be aware it will expire after one hour.
2. Use the Spotify Web API to obtain an access token. See [this gist] for a full example of how to obtain a Spotify token in a web application. This workflow is highly recommended for production apps.

An example of #2 is included. Please see [demo.mjs](demo.mjs) and [public/demo.mjs](public/demo.mjs) for more information.
Set `CLIENT_ID` and `CLIENT_SECRET` then run `npm run demo` and open `http://localhost:8989/` to view the demo.

## Acknowledgements

Much of the inspiration for this API comes from Gil Barbara's [react-spotify-web-playback](https://github.com/gilbarbara/react-spotify-web-playback).

## License

Licensed under the [MIT](https://spdx.org/licenses/MIT) license. See [LICENSE.md](LICENSE.md) for more details.

[Spotify Web Playback SDK]: https://developer.spotify.com/documentation/web-playback-sdk/quick-start/
[Encrypted Media Extensions]: https://www.w3.org/TR/encrypted-media/
[docs]: https://symbitic.github.io/spotify-web-playback/
[here]: https://accounts.spotify.com/en/authorize?response_type=token&client_id=adaaf209fb064dfab873a71817029e0d&redirect_uri=https:%2F%2Fdeveloper.spotify.com%2Fdocumentation%2Fweb-playback-sdk%2Fquick-start%2F&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state&show_dialog=true
[this gist]: https://gist.github.com/Symbitic/95c0f4321b310be3a86eb0adf4a268ff
