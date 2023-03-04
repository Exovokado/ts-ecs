import { Component, ComponentClass } from "./Component";
import ECS from "./ECS";
import { Entity } from "./Entity";
export type QueryClass<T extends Query> = new (...args: any[]) => T;
export declare abstract class Query {
    abstract readonly componentsRequired: Set<ComponentClass<Component>>;
    readonly componentsExcluded: Set<ComponentClass<Component>>;
    protected entities: Set<string>;
    debug: boolean;
    ecs: ECS;
    removeEntity(entity: Entity): void;
    registerEntity(entity: Entity): void;
    get(): IterableIterator<string>;
    hasAny(): boolean;
    getRand(): Entity;
    has(entity: Entity): boolean;
    onAdd(entity: Entity): void;
    onRemove(entity: Entity): void;
}
