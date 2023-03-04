import { System } from "./System";

export type EventClass<T extends Event> = new (...args: any[]) => T

export abstract class Event<T = any> {
    public systems: Map<string, (data: T) => void> = new Map();
    public readonly type: T;

    public listen(system: System, callback: (data: T) => void) {
        const name = system.constructor.name;
        if(this.systems.has(name)) throw new Error("Event : " + this.constructor.name + " is already beeing listened by " + name + ".");
        this.systems.set(name, callback);
    }

    public quit(system: System) {
        const name = system.constructor.name;
        if(!this.systems.has(name)) throw new Error("Event : " + this.constructor.name + " is not beeing listened by " + name + ".");
        this.systems.delete(name);
    }

    public dispatch(data: T) {
        for (const system of this.systems) {
            system[1](data);
        }
    }
}


export class EventManager {
    private events: Map<string, Event> = new Map();

    public register(event: Event) {
        this.events.set(event.constructor.name, event);
    }

    public get<T extends Event>(event: EventClass<T>): T {
        if(!this.events.has(event.name)) throw new Error("Event : " + event.name + " is not registered.");
        return this.events.get(event.name) as T;
    }
}