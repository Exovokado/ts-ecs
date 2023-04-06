import { System } from "./System";
export type EventClass<T extends Event> = new (...args: any[]) => T;
export declare abstract class Event<T = any> {
    systems: Map<string, (data: T) => void>;
    readonly type: T;
    listen(systemOrIndex: System | string, callback: (data: T) => void): void;
    quit(systemOrIndex: System | string): void;
    isBeingListened(systemOrIndex: System | string): boolean;
    dispatch(data: T): void;
}
export declare class EventManager {
    private events;
    register(event: Event): void;
    get<T extends Event>(event: EventClass<T>): T;
}
