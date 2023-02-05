import { Entity } from "./Entity";
import ECS from "./ECS";
export declare type SystemClass<T extends System> = new (...args: any[]) => T;
/**
 * Run game logic code.
 */
export declare abstract class System<T = any> {
    abstract readonly componentsRequired: Set<Function>;
    readonly componentsExcluded: Set<Function>;
    readonly weight: number;
    readonly filter: boolean;
    readonly debug = false;
    protected entities: Set<string>;
    private messages;
    private tmpMessages;
    private suspended;
    private suspendedCallback;
    protected ecs: ECS;
    setECS(ecs: ECS): void;
    suspend(tick?: number, callback?: () => void): void;
    enable(): void;
    private isSuspended;
    check(): boolean;
    /**
     * Run at each game tick.
     */
    abstract update(delta: number | boolean): void;
    /**
     * Optional custom callback on entity registration in the system.
     */
    setEntity(entity: Entity): void;
    unsetEntity(entity: Entity): void;
    /**
     * Register entity on system list if it checks requirements.
     * @param entity entity id
     */
    registerEntity(entity: Entity): void;
    /**
     * Remove entity from system list.
     * @param entity entity id
     */
    removeEntity(entity: Entity): void;
    getMessages(): T[];
    getMessage(): T;
    addMessage(message?: T): void;
    hasAny(): boolean;
}
