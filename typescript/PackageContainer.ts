import * as Restify from 'restify';
import * as Bunyan from 'bunyan';

export class PackageContainer {

    private server:Restify.Server;
    private bunyan:Bunyan.Logger;

    getServer() {
        if (!this.server) {
            this.server = Restify.createServer();
        }

        return this.server;
    }

    getBunyan() {
        if (!this.bunyan) {
            this.bunyan = Bunyan.createLogger({name: "app"});
        }

        return this.bunyan;
    }
}