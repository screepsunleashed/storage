import * as _ from 'lodash';
import { EventEmitter } from 'events';

const subs = {};
let id = 0;
const emitter = new EventEmitter();

emitter.setMaxListeners(0);

export function publish(channel, data, cb?): void {
    emitter.emit(channel, { channel, data });
    emitter.emit('*', { channel, data });
    if (cb) cb(null);
}

export function create(){
    const connId = id++;
    const connSubs = subs[connId] = [] as any[];

    return {
        methods: {
            publish,
            subscribe: (channel, listener) => {
                connSubs.push([channel, listener]);
                emitter.on(channel, listener);
                return () => {
                    emitter.removeListener(channel, listener);
                };
            },
        },
        close: () => {
            connSubs.forEach(i => emitter.removeListener(i[0], i[1]));
            delete subs[connId];
        }
    };
}