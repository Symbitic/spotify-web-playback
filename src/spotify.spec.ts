import { SpotifyPlayer } from './spotify';

describe('SpotifyPlayer', () => {
  it('should not crash', () => {
    expect(() => {
      new SpotifyPlayer('jest-player');
    }).not.toThrow();
  });
});
