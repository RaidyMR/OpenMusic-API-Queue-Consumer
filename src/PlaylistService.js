const { Pool } = require('pg');
 
class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }
 
  async getSongsFromPlaylist(playlistId) {
    const queryPlaylist = {
      text: `SELECT playlists.id, playlists.name FROM playlists WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const resultPlaylist = await this._pool.query(queryPlaylist);

    const querySong = {
      text: `SELECT songs.id, songs.title, songs.performer FROM playlistsongs
      FULL OUTER JOIN songs ON playlistsongs.song_id = songs.id
      WHERE playlistsongs.playlist_id = $1`,
      values: [playlistId],
    };
    const resultSong = await this._pool.query(querySong);

    if (!resultPlaylist.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    resultPlaylist.rows[0].songs = resultSong.rows;

    return resultPlaylist.rows[0];
  }
}

module.exports = PlaylistService;
