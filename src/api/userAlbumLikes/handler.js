const InvariantError = require('../../exceptions/InvariantError');

class UserAlbumLikesHandler {
  constructor(service, albumsService) {
    this._service = service;
    this._albumsService = albumsService;
  }

  async postAlbumLikeHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const albumId = request.params.id;

    await this._albumsService.getAlbumById(albumId);

    const isLiked = await this._service.checkLike({ userId: credentialId, albumId });

    if (isLiked) {
      throw new InvariantError('User sudah memberikan like pada album ini');
    }

    await this._service.addLike({ userId: credentialId, albumId });

    const response = h.response({
      status: 'success',
      message: 'Like berhasil diberikan',
    });
    response.code(201);
    return response;
  }

  async deleteAlbumLikeHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const albumId = request.params.id;

    await this._albumsService.getAlbumById(albumId);

    const isLiked = await this._service.checkLike({ userId: credentialId, albumId });

    if (!isLiked) {
      throw new InvariantError('User belum memberikan like pada album ini');
    }

    await this._service.deleteLike({ userId: credentialId, albumId });

    return {
      status: 'success',
      message: 'Like berhasil dihapus',
    };
  }

  async getAlbumLikesHandler(request) {
    const albumId = request.params.id;

    await this._albumsService.getAlbumById(albumId);

    const likesCount = await this._service.getLikesCount(albumId);

    return {
      status: 'success',
      data: {
        likes: likesCount,
      },
    };
  }
}

module.exports = UserAlbumLikesHandler;
