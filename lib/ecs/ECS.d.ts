import { Entities, Entity } from "./Entity";
import { System, SystemClass } from "./System";
import { Factory, FactoryClass } from "./Factory";
import { Component, ComponentClass } from "./Component";
import { ComponentContainer } from "./Containers";
import { EventManager } from "./Event";
export interface LogCallbacks {
    warn: (tolog: any) => void;
    error: (tolog: any) => void;
    debug: (tolog: any) => void;
}
/**
 * Entity-Components System.
 */
export default class ECS {
    protected entities: Entities;
    protected components: Map<string, ComponentClass<any>>;
    protected systems: Map<string, System<any>>;
    private factories;
    protected entitiesToDestroy: Set<string>;
    protected nextEntityID: number;
    private readonly emptySytemAllowed;
    private readonly debug;
    logger: LogCallbacks;
    eventManager: EventManager;
    /**
     * You could also use a simple entity map and not extend entitycontainer.
     * @param entityContainer custom handler to list entities.
     * @param save game save data.
     * @param debug boolean.
     */
    constructor(debug?: boolean, log?: LogCallbacks);
    /**
     * Run game logic at each game tick.
     */
    update(delta?: number | boolean): void;
    /**
     * Add factory to ecs list.
     * @param name name of the factory.
     * @param factory factory object.
     */
    addFactory(factory: Factory): void;
    /**
     * Remove factory to ecs list.
     * @param name name of the factory.
     * @param factory factory object.
     */
    getFactory<T extends Factory>(componentClass: FactoryClass<T>): T;
    /**
     * Instantiate and register a new entity.
     * @returns entity id.
     */
    addEntity(): Entity;
    entityExist(entity: Entity): boolean;
    /**
     * Mark entiy for further removal, to prevent system conflicts.
     * @param entity entity id.
     */
    removeEntity(entity: Entity): void;
    /**
     * Run after update() to remove entity from ecs memory and systems list.
     * @param entity entity id.
     */
    protected destroyEntity(entity: Entity): void;
    registerComponent<T extends Component>(componentClass: ComponentClass<T>): void;
    /**
     * Register a new component for a given entity.
     * @param entity entity id.
     * @param component Component instance.
     */
    addComponent(entity: Entity, component: Component): Component;
    /**
     * Remove component from ecs list.
     * @param entity Entity id.
     */
    removeComponent(entity: Entity, component: ComponentClass<Component>): void;
    /**
     * Return entity components bundle for cloning.
     * @param entity Entity id.
     * @returns all entity components.
     */
    getComponents(entity: Entity): ComponentContainer;
    /**
     * Return a single component.
     * @param entity Entity id.
     * @param component
     * @returns the component.
     */
    getComponent<T extends Component>(entity: Entity, componentClass: ComponentClass<T>): T;
    getComponentIfExist<T extends Component>(entity: Entity, componentClass: ComponentClass<Component>): T | null;
    /**
     * Check if entity implements a given component.
     * @param entity  Entity id.
     * @param component Component instance.
     * @returns true or false.
     */
    hasComponent(entity: Entity, component: ComponentClass<Component>): boolean;
    /**
     * Check for any implementation of components list
     * @param entity  Entity id.
     * @param components
     * @returns
     */
    hasAnyComponents(entity: Entity, components: Iterable<ComponentClass<Component>>): boolean;
    /**
     * Check for full implementation of components list
     * @param entity  Entity id.
     * @param components
     * @returns
     */
    hasAllComponents(entity: Entity, components: Iterable<ComponentClass<Component>>): boolean;
    /**
     * Register a new system.
     * @param system System instance.
     * @returns true if system added.
     */
    addSystem(system: System): boolean;
    /**
     * Remove system from ecs.
     * @param system
     */
    removeSystem(system: Function): void;
    /**
     * Get system by name.
     * @param systemName
     * @returns
     */
    getSystem<T extends System>(system: SystemClass<T>): T;
    /**
    * Get system by name.
    * @remark Use carrefully, as it wont throw error on non existing system.
    * @param systemName
    * @returns
    */
    getSystemIfExists<T extends System>(system: SystemClass<T> | string): T | null;
    /**
     * Run on systems to check entity components for registration.
     * @param entity  Entity id.
     */
    protected checkEntity(entity: Entity): void;
    clear(): void;
    export(): string;
    load(save: string): void;
    print(): string;
}
