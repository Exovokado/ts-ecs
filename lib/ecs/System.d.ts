import { Entity } from "./Entity";
import { Component, ComponentClass } from "./Component";
import ECS from "./ECS";
export type SystemClass<T extends System> = new (...args: any[]) => T;
/**
 * Run game logic code.
 */
export declare abstract class System<T = any> {
    abstract readonly componentsRequired: Set<ComponentClass<Component>>;
    readonly componentsExcluded: Set<ComponentClass<Component>>;
    readonly weight: number;
    readonly filter: boolean;
    debug: boolean;
    protected entities: Set<string>;
    private messages;
    private tmpMessages;
    private suspended;
    private suspendedCallback;
    ecs: ECS;
    suspend(tick?: number, callback?: () => void): void;
    enable(): void;
    private isSuspended;
    check(): boolean;
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
    has(entity: Entity): boolean;
    getRand(): Entity;
    onClear(): void;
    init(): void;
    setEntity(entity: Entity): void;
    unsetEntity(entity: Entity): void;
    abstract update(delta: number | boolean): void;
}
