const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistSongsHandler {
  constructor(
    service,
    validator,
    playlistsService,
    songsService,
    usersService,
    collabsService,
    activitiesService,
    cacheService,
  ) {
    this._service = service;
    this._validator = validator;
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._usersService = usersService;
    this._collabsService = collabsService;
    this._activitiesService = activitiesService;
    this._cacheService = cacheService;
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePostPlaylistSongPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const playlistId = request.params.id;
    const { songId } = request.payload;

    await this._songsService.getSongById(songId);

    const isOwner = await this._playlistsService.verifyPlaylistOwnerV2(
      {
        id: playlistId,
        owner: credentialId,
      },
    );
    const isCollaborator = await this._collabsService.verifyCollaboration(
      {
        playlistId,
        userId: credentialId,
      },
    );
    if (!isOwner && !isCollaborator) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }

    await this._service.addPlaylistSong({ playlistId, songId });

    await this._activitiesService.addActivities({
      playlistId,
      song_id: songId,
      user_id: credentialId,
      action: 'add',
    });

    await this._cacheService.delete(`playlist_songs:${playlistId}`);

    const response = h.response({
      status: 'success',
      message: 'Playlist song berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlistId = request.params.id;

    const isOwner = await this._playlistsService.verifyPlaylistOwnerV2(
      {
        id: playlistId,
        owner: credentialId,

      },
    );
    const isCollaborator = await this._collabsService.verifyCollaboration(
      {
        playlistId,
        userId: credentialId,
      },
    );
    if (!isOwner && !isCollaborator) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }

    let isCached = false;
    let playlistSongs;

    try {
      playlistSongs = JSON.parse(await this._cacheService.get(`playlist_songs:${playlistId}`));
      isCached = true;
    } catch (e) {
      const playlist = await this._playlistsService.getPlaylistById(playlistId);

      const { username } = await this._usersService.getUserById(playlist.owner);

      const playlistSongRecords = await this._service.getPlaylistSongsByPlaylistId(playlistId);

      const songs = await Promise.all(playlistSongRecords.map(async (record) => {
        const song = await this._songsService.getSongById(record.song_id);
        return song;
      }));

      playlistSongs = {
        playlist: {
          id: playlist.id,
          name: playlist.name,
          username,
          songs: songs.map((song) => ({
            id: song.id,
            title: song.title,
            performer: song.performer,
          })),
        },
      };

      await this._cacheService.set(`playlist_songs:${playlistId}`, JSON.stringify(playlistSongs));
    }

    const response = h.response({
      status: 'success',
      data: playlistSongs,
    });
    response.code(200);
    if (isCached) response.header('X-Data-Source', 'cache');
    return response;
  }

  async deletePlaylistSongHandler(request) {
    this._validator.validatePostPlaylistSongPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const playlistId = request.params.id;
    const { songId } = request.payload;

    const isOwner = await this._playlistsService.verifyPlaylistOwnerV2(
      {
        id: playlistId,
        owner: credentialId,

      },
    );
    const isCollaborator = await this._collabsService.verifyCollaboration(
      {
        playlistId,
        userId: credentialId,
      },
    );
    if (!isOwner && !isCollaborator) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }

    await this._service.deletePlaylistSongBySongId(songId);

    await this._activitiesService.addActivities({
      playlistId,
      song_id: songId,
      user_id: credentialId,
      action: 'delete',
    });

    await this._cacheService.delete(`playlist_songs:${playlistId}`);

    return {
      status: 'success',
      message: 'Playlist song berhasil dihapus',
    };
  }
}

module.exports = PlaylistSongsHandler;
