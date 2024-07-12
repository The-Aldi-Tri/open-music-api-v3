const InvariantError = require('../../exceptions/InvariantError');

class UserAlbumLikesHandler {
  constructor(service, albumsService, cacheService) {
    this._service = service;
    this._albumsService = albumsService;
    this._cacheService = cacheService;
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

    await this._cacheService.delete(`albums_likes:${albumId}`);

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

    await this._cacheService.delete(`albums_likes:${albumId}`);

    return {
      status: 'success',
      message: 'Like berhasil dihapus',
    };
  }

  async getAlbumLikesHandler(request, h) {
    const albumId = request.params.id;

    await this._albumsService.getAlbumById(albumId);

    let likesCount;
    let isCached = false;

    try {
      likesCount = JSON.parse(await this._cacheService.get(`albums_likes:${albumId}`));
      isCached = true;
    } catch (e) {
      likesCount = await this._service.getLikesCount(albumId);
    }

    await this._cacheService.set(`albums_likes:${albumId}`, JSON.stringify(likesCount));

    const response = h.response({
      status: 'success',
      data: {
        likes: likesCount,
      },
    });
    response.code(200);
    if (isCached) response.header('X-Data-Source', 'cache');
    return response;
  }
}

module.exports = UserAlbumLikesHandler;
