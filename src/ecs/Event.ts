import { System } from "./System";

export type EventClass<T extends Event> = new (...args: any[]) => T


export abstract class Event<T = any> {
    public systems: Map<string, (data: T) => void> = new Map();
    public readonly type: T;
    public dispatchers: Set<[string, any]> = new Set();

    public listen(systemOrIndex: System | string, callback: (data: T) => void) {
        const name = typeof systemOrIndex === "string" ? systemOrIndex : systemOrIndex.constructor.name;
        if(this.systems.has(name)) throw new Error("Event : " + this.constructor.name + " is already beeing listened by " + name + ".");
        this.systems.set(name, callback);
    }

    public quit(systemOrIndex: System | string) {
        const name = typeof systemOrIndex === "string" ? systemOrIndex : systemOrIndex.constructor.name;
        if(!this.systems.has(name)) throw new Error("Event : " + this.constructor.name + " is not beeing listened by " + name + ".");
        this.systems.delete(name);
    }

    public isBeingListened(systemOrIndex: System | string): boolean {
        const name = typeof systemOrIndex === "string" ? systemOrIndex : systemOrIndex.constructor.name;
        return this.systems.has(name);
    }

    public dispatch(data: T, context = "?") {
        for (const system of this.systems) {
            system[1](data);
            this.dispatchers.add([context, data]);
        }
    }
}


export class EventManager {
    private events: Map<string, Event> = new Map();

    public register(event: Event) {
        this.events.set(event.constructor.name, event);
    }

    public get<T extends Event>(event: EventClass<T>): T {
        if(!this.events.has(event.name)) this.events.set(event.name, new event());
        return this.events.get(event.name) as T;
    }

    public print() {
        const events = [];
        for (const row of this.events) {
            events.push([row[0], [...row[1].systems.keys()], JSON.stringify([...row[1].dispatchers])]);
        }
        console.table(events);
    }
}