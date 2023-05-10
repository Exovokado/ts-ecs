"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventManager = exports.Event = void 0;
class Event {
    constructor() {
        this.systems = new Map();
        this.dispatchers = new Set();
    }
    listen(systemOrIndex, callback) {
        const name = typeof systemOrIndex === "string" ? systemOrIndex : systemOrIndex.constructor.name;
        if (this.systems.has(name))
            throw new Error("Event : " + this.constructor.name + " is already beeing listened by " + name + ".");
        this.systems.set(name, callback);
    }
    quit(systemOrIndex) {
        const name = typeof systemOrIndex === "string" ? systemOrIndex : systemOrIndex.constructor.name;
        if (!this.systems.has(name))
            throw new Error("Event : " + this.constructor.name + " is not beeing listened by " + name + ".");
        this.systems.delete(name);
    }
    isBeingListened(systemOrIndex) {
        const name = typeof systemOrIndex === "string" ? systemOrIndex : systemOrIndex.constructor.name;
        return this.systems.has(name);
    }
    dispatch(data, context = "?") {
        for (const system of this.systems) {
            system[1](data);
            this.dispatchers.add([context, data]);
        }
    }
}
exports.Event = Event;
class EventManager {
    constructor() {
        this.events = new Map();
    }
    register(event) {
        this.events.set(event.constructor.name, event);
    }
    get(event) {
        if (!this.events.has(event.name))
            this.events.set(event.name, new event());
        return this.events.get(event.name);
    }
    print() {
        const events = [];
        for (const row of this.events) {
            events.push([row[0], [...row[1].systems.keys()], JSON.stringify([...row[1].dispatchers])]);
        }
        console.table(events);
    }
}
exports.EventManager = EventManager;
//# sourceMappingURL=Event.js.map