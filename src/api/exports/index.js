const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, {
    service, validator, playlistsService, collabsService,
  }) => {
    const exportsHandler = new ExportsHandler(service, validator, playlistsService, collabsService);
    server.route(routes(exportsHandler));
  },
};
