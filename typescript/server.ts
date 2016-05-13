import appContainer = require('./AppContainer');

var server = appContainer.getPackageContainer().getServer();

server.listen(process.env.WEBSERVICE_PORT, function() {
    console.log('%s listening at %s', server.name, server.url);
});
