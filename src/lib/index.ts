import * as q from 'q';
import * as _ from 'lodash';
import * as net from 'net';
import { EventEmitter } from 'events';
import * as common from '@screepsunleashed/common';
import { rpc as RpcServer } from '@screepsunleashed/common';
import * as databaseMethods from './db';
import * as pubsub from './pubsub';
import * as queueMethods from './queue';

const config = Object.assign(common.configManager.config, { storage: new EventEmitter() });

Object.assign(config.storage, {
    socketListener(socket) {
        const connectionDesc = `${socket.remoteAddress}:${socket.remotePort}`;

        console.log(`[${connectionDesc}] Incoming connection`);

        socket.on('error', error => console.log(`[${connectionDesc}] Connection error: ${error.message}`));

        const pubsubConnection = pubsub.create();

        new RpcServer(socket, _.extend({}, databaseMethods, queueMethods, pubsubConnection.methods));

        socket.on('close', () => {
            pubsubConnection.close();
            console.log(`[${connectionDesc}] Connection closed`);
        });
    }
});

export async function start(): Promise<void> {

    if (!process.env.STORAGE_PORT) {
        throw new Error('STORAGE_PORT environment variable is not set!');
    }
    if (!process.env.DB_PATH) {
        throw new Error('DB_PATH environment variable is not set!');
    }

    common.configManager.load();

    try {
        await config.storage.loadDb();

        console.log('Starting storage server');

        const server = net.createServer(config.storage.socketListener);

        server.on('listening', () => {
            console.log('Storage listening on', process.env.STORAGE_PORT);
            if (process.send) {
                process.send('storageLaunched');
            }
        });

        server.listen(parseInt(process.env.STORAGE_PORT, 10), process.env.STORAGE_HOST || 'localhost');
    } catch (error) {
        console.error(error);
    }
}