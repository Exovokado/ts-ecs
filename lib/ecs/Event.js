"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventManager = exports.Event = void 0;
class Event {
    constructor() {
        this.systems = new Map();
    }
    listen(system, callback) {
        const name = system.constructor.name;
        if (this.systems.has(name))
            throw new Error("Event : " + this.constructor.name + " is already beeing listened by " + name + ".");
        this.systems.set(name, callback);
    }
    quit(system) {
        const name = system.constructor.name;
        if (!this.systems.has(name))
            throw new Error("Event : " + this.constructor.name + " is not beeing listened by " + name + ".");
        this.systems.delete(name);
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
            throw new Error("Event : " + event.name + " is not registered.");
        return this.events.get(event.name);
    }
}
exports.EventManager = EventManager;
//# sourceMappingURL=Event.js.map