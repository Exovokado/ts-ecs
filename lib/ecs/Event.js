"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventManager = exports.Event = void 0;
class Event {
    constructor() {
        this.systems = new Map();
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
    dispatch(data) {
        for (const system of this.systems) {
            system[1](data);
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
}
exports.EventManager = EventManager;
//# sourceMappingURL=Event.js.map