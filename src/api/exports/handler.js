const AuthorizationError = require('../../exceptions/AuthorizationError');

class ExportsHandler {
  constructor(service, validator, playlistsService, collabsService) {
    this._service = service;
    this._validator = validator;
    this._playlistsService = playlistsService;
    this._collabsService = collabsService;
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportPlaylistsPayload(request.payload);

    const { playlistId } = request.params;
    const userId = request.auth.credentials.id;
    const { targetEmail } = request.payload;

    const isOwner = await this._playlistsService.verifyPlaylistOwnerV2(
      {
        id: playlistId,
        owner: userId,
      },
    );
    const isCollaborator = await this._collabsService.verifyCollaboration(
      {
        playlistId,
        userId,
      },
    );
    if (!isOwner && !isCollaborator) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }

    const message = {
      playlistId,
      targetEmail,
    };

    await this._service.sendMessage('export:playlists', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
