import * as _ from 'lodash';
import * as pubsub from './pubsub';
import { EventEmitter } from 'events';

const queues = {
    usersLegacy: {
        pending: [],
        processing: [],
        emitter: new EventEmitter()
    },
    usersIvm: {
        pending: [],
        processing: [],
        emitter: new EventEmitter()
    },
    rooms: {
        pending: [],
        processing: [],
        emitter: new EventEmitter()
    }
};

export function queueFetch(name: string, cb: (err?, value?: any) => void): void {
    try {
        function check() {
            if (!queues[name].pending.length) {
                queues[name].emitter.once('add', check);
                return;
            }
            const item = queues[name].pending.pop();
            queues[name].processing.push(item);
            cb(null, item);
        }
        check();
    } catch (e) {
        cb(e.message);
        console.error(e);
    }
}

export function queueMarkDone(name: string, id, cb): void {
    try {
        _.pull(queues[name].processing, id);
        queues[name].emitter.emit('done');
        if (cb) cb(null, true);
    } catch (e) {
        cb(e.message);
        console.error(e);
    }
}

export function queueAdd(name: string, id, cb): void{
    try {
        queues[name].pending.push(id);
        queues[name].emitter.emit('add');
        if (cb) cb(null, true);
    } catch (e) {
        cb(e.message);
        console.error(e);
    }
}

export function queueAddMulti(name: string, array, cb): void{
    try {
        queues[name].pending = queues[name].pending.concat(array);
        queues[name].emitter.emit('add');
        if (cb) cb(null, true);
    } catch (e) {
        cb(e.message);
        console.error(e);
    }
}

export function queueWhenAllDone(name: string, cb): void {
    try {
        const check = function () {
            if (queues[name].pending.length || queues[name].processing.length) {
                queues[name].emitter.once('done', check);
                return;
            }
            pubsub.publish('queueDone:' + name, '1');
            cb(null, true);
        };
        check();
    } catch (e) {
        cb(e.message);
        console.error(e);
    }
}

export function queueReset(name: string, cb): void {
    try {
        queues[name].pending = [];
        queues[name].processing = [];
        queues[name].emitter.emit('done');
        if (cb) cb(null, true);
    } catch (e) {
        cb(e.message);
        console.error(e);
    }
}