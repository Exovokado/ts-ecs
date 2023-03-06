import ECS from "./ECS";
import { Event, EventClass } from "./Event";
export type SystemClass<SystemInstance extends System> = new (...args: any[]) => SystemInstance;
/**
 * Run game logic code.
 */
export declare abstract class System<Message = any> {
    readonly weight: number;
    readonly filter: boolean;
    debug: boolean;
    private messages;
    private tmpMessages;
    private suspended;
    private suspendedCallback;
    ecs: ECS;
    suspend(tick?: number, callback?: () => void): void;
    enable(): void;
    private isSuspended;
    check(): boolean;
    getMessages(): Message[];
    getMessage(): Message;
    addMessage(message?: Message): void;
    onClear(): void;
    init(): void;
    abstract update(delta: number | boolean): void;
    listen<E extends Event<any>>(event: EventClass<E>, callback: (data: E['type']) => void): void;
}
