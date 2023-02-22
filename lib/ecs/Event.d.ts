import { System } from "./System";
export type EventClass<T extends Event> = new (...args: any[]) => T;
export declare abstract class Event<T = any> {
    abstract readonly name: string;
    systems: Map<string, (data: T) => void>;
    listen(system: System, callback: (data: T) => void): void;
    quit(system: System): void;
    dispatch(data: T): void;
}
export declare class EventManager {
    private events;
    register(event: Event): void;
    get<T extends Event>(event: EventClass<T>): T;
}
