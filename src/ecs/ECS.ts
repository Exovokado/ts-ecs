import { Entities, Entity } from "./Entity";
import { System, SystemClass } from "./System";
import { Factory, FactoryClass } from "./Factory";
import { Component, ComponentClass, Deleted } from "./Component";
import { ComponentContainer } from "./Containers";
import { EventManager } from "./Event";
import { Query, QueryClass } from "./Query";

export interface LogCallbacks {
    warn: (tolog: any) => void;
    error: (tolog: any) => void;
    debug: (tolog: any) => void;
};

/**
 * Entity-Components System.
 */
export default class ECS {
    // List of entities in a custom handler.
    protected entities: Entities = new Map();
    protected components: Map<string, ComponentClass<Component>> = new Map();
    // protected proxies: Map<string, typeof Proxy>;
    // List of systems to run.
    protected systems = new Map<string, System>();
    // List of created factories.
    private factories = new Map<String, Factory>();
    // List of entity for further removal.
    protected entitiesToDestroy = new Set<Entity>();
    // Track number of entities and current new id to set.
    protected nextEntityID = 1
    private readonly emptySytemAllowed = true;
    private readonly debug: boolean;
    public logger: LogCallbacks;

    public eventManager = new EventManager();

    public queries: Map<string, Query> = new Map();


    /**
     * You could also use a simple entity map and not extend entitycontainer.
     * @param entityContainer custom handler to list entities.
     * @param save game save data.
     * @param debug boolean.
     */
    constructor(debug: boolean = false, log: LogCallbacks = {
        warn: (msg) => { console.log(msg) },
        debug: (msg) => { console.log(msg) },
        error: (msg) => { console.log(msg) }
    }) {
        this.debug = debug;
        this.logger = log;
    }

    public addQuery(query: Query, debug: boolean = false) {
        query.ecs = this;
        query.debug = debug;
        for (const entity of this.entities) {
            query.registerEntity(entity[0]);
        }
        this.queries.set(query.constructor.name, query);
    }

    public getQuery<Q extends Query>(queryClass: QueryClass<Q>): Q {
        if (!this.queries.has(queryClass.name)) throw new Error("query " + queryClass.name + " does not exist");
        return this.queries.get(queryClass.name) as Q;
    }

    public query(query: QueryClass<Query>) {
        if (!this.queries.has(query.name)) throw new Error("query " + query.name + " does not exist");
        return this.queries.get(query.name).get();
    }

    /**
     * Run game logic at each game tick. 
     */
    public update(delta: number | boolean = false): void {
        // System updates.
        for (const system of this.systems) {
            if (system[1].check()) system[1].update(delta)
        }
        // Destroy entities.
        for (const entity of this.entitiesToDestroy) {
            this.destroyEntity(entity);
        }
    }


    /**
     * Add factory to ecs list.
     * @param name name of the factory.
     * @param factory factory object.
     */
    public addFactory(factory: Factory): void {
        if (this.factories.has(factory.constructor.name)) return;
        factory.ecs = this;
        this.factories.set(factory.constructor.name, factory);
    }

    /**
     * Remove factory to ecs list.
     * @param name name of the factory.
     * @param factory factory object.
     */
    public getFactory<T extends Factory>(
        componentClass: FactoryClass<T>
    ): T {
        let factory = this.factories.get(componentClass.name);
        if (!factory) {
            throw new Error("factory " + componentClass.name + " does not exist");
        }
        return factory as T;
    }

    /**
     * Instantiate and register a new entity. 
     * @returns entity id.
     */
    public addEntity(): Entity {
        let entity = this.nextEntityID.toString();
        this.nextEntityID++;
        this.entities.set(entity, new ComponentContainer());
        return entity;
    }

    public entityExist(entity: Entity): boolean {
        return this.entities.get(entity) ? true : false;
    }

    /**
     * Mark entiy for further removal, to prevent system conflicts.
     * @param entity entity id.
     */
    public removeEntity(entity: Entity): void {
        this.addComponent(entity, new Deleted());
        this.entitiesToDestroy.add(entity);
    }

    /**
     * Run after update() to remove entity from ecs memory and systems list.
     * @param entity entity id.
     */
    protected destroyEntity(entity: Entity): void {
        if (this.hasComponent(entity, Deleted)) this.removeComponent(entity, Deleted);
        for (const query of this.queries) {
            query[1].removeEntity(entity)
        }
        this.entitiesToDestroy.delete(entity);
        this.entities.delete(entity.toString());
    }

    public registerComponent<T extends Component>(
        componentClass: ComponentClass<T>
    ): void {
        this.components.set(componentClass.name, componentClass);
    }

    /**
     * Register a new component for a given entity.
     * @param entity entity id.
     * @param component Component instance.
     */
    public addComponent(entity: Entity, component: Component): Component {
        const components = this.getComponents(entity);
        components.map.set(component.constructor.name, new Proxy(component, {
            set: (target: Component, p: keyof typeof target, newValue: any): boolean => {
                if (p === "isSync") return;
                const last = target[p];
                target[p] = newValue;
                if (last !== newValue && typeof target[p] !== "function") {
                    target.changed(p, newValue);
                }
                return true;
            }
        }));
        this.checkEntity(entity);
        return component;
    }

    /**
     * Remove component from ecs list.
     * @param entity Entity id. 
     */
    public removeComponent(entity: Entity, component: ComponentClass<Component>): void {
        const components = this.getComponents(entity);
        if (!components.map.get(component.name)) throw new Error("Component " + component.name + " not present in entity " + entity + ".");
        components.map.delete(component.name);
        this.checkEntity(entity);
    }

    /**
     * Return entity components bundle for cloning.
     * @param entity Entity id. 
     * @returns all entity components.
     */
    public getComponents(entity: Entity): ComponentContainer {
        let ComponentContainer = this.entities.get(entity.toString());
        if (!ComponentContainer) {
            throw new Error("Entity :" + entity.toString() + " Not found");
        }
        else return ComponentContainer;
    }

    /**
     * Return a single component.
     * @param entity Entity id. 
     * @param component 
     * @returns the component.
     */

    public getComponent<T extends Component>(
        entity: Entity,
        componentClass: ComponentClass<T>
    ): T {
        const components = this.getComponents(entity);
        if (!this.hasComponent(entity, componentClass)) throw new Error("Component :" + componentClass + " Not found");
        return components.map.get(componentClass.name) as T;
    }

    public getComponentIfExist<T extends Component>(
        entity: Entity,
        componentClass: ComponentClass<Component>
    ): T | null {
        const components = this.getComponents(entity);
        if (!this.hasComponent(entity, componentClass)) return null;
        return components.map.get(componentClass.name) as T;
    }

    /**
     * Check if entity implements a given component.
     * @param entity  Entity id. 
     * @param component Component instance.
     * @returns true or false.
     */
    public hasComponent(entity: Entity, component: ComponentClass<Component>): boolean {
        return this.getComponents(entity).map.get(component.name) ? true : false;
    }

    /**
     * Check for any implementation of components list 
     * @param entity  Entity id. 
     * @param components 
     * @returns 
     */
    public hasAnyComponents(entity: Entity, components: Iterable<ComponentClass<Component>>): boolean {
        for (const component of components) {
            if (this.hasComponent(entity, component)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check for full implementation of components list
     * @param entity  Entity id. 
     * @param components 
     * @returns 
     */
    public hasAllComponents(entity: Entity, components: Iterable<ComponentClass<Component>>): boolean {
        for (const component of components) {
            if (!this.hasComponent(entity, component)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Register a new system.
     * @param system System instance.
     * @returns true if system added.
     */
    public addSystem(system: System): boolean {
        if (this.systems.has(system.constructor.name)) return false;

        system.ecs = this;
        if (!this.debug) system.debug = false;

        system.init();

        this.systems.set(system.constructor.name, system);

        this.systems = new Map([...this.systems.entries()].sort((a, b) => a[1].weight - b[1].weight));
        return true;
    }

    /**
     * Remove system from ecs.
     * @param system 
     */
    public removeSystem(system: Function): void {
        this.systems.delete(system.name);
    }

    /**
     * Get system by name.
     * @param systemName 
     * @returns 
     */
    public getSystem<T extends System>(
        system: SystemClass<T>
    ): T {
        const ecs_system = this.systems.get(system.name);
        if (!ecs_system) throw new Error("Requested System " + system.name + " does not exist");
        return ecs_system as T;
    }

    /**
    * Get system by name. 
    * @remark Use carrefully, as it wont throw error on non existing system. 
    * @param systemName 
    * @returns 
    */
    public getSystemIfExists<T extends System>(
        system: SystemClass<T> | string
    ): T | null {
        const ecs_system = this.systems.get(typeof system === "string" ? system : system.name);
        if (!ecs_system) return null;
        return ecs_system as T;
    }


    /**
     * Run on systems to check entity components for registration.
     * @param entity  Entity id. 
     */
    protected checkEntity(entity: Entity) {
        for (const query of this.queries) {
            query[1].registerEntity(entity);
        }
    }

    public clear(): void {
        for (const entity of this.entities) {
            let isMap = false;
            for (const component of entity[1].map) {
                if (Object.keys(component[1]).includes("map")) isMap = true;
            }
            if (!isMap) this.destroyEntity(entity[0]);
        }
        for (const system of this.systems) {
            system[1].onClear();
        }
        for (const query of this.queries) {
            query[1].onClear();
        }
    }

    public export(): string {
        const rows = [];
        for (const entity of this.entities) {
            const row = [];
            for (const component of entity[1].map) {
                if (this.components.has(component[0]))
                    row.push([
                        component[0],
                        JSON.stringify(component[1])
                    ]);
            }
            if (row.length) rows.push(row);
        }
        return JSON.stringify(rows);
    }

    public load(save: string): void {
        for (const entityRow of JSON.parse(save)) {
            const entity = this.addEntity();
            for (const ComponentRow of entityRow) {
                const componentClass = this.components.get(ComponentRow[0]);
                this.addComponent(entity, new componentClass(JSON.parse(ComponentRow[1])))
            }
        }
    }

    public print(): string {
        const rows: [string, any[]][] = [];
        for (const entity of this.entities) {
            rows.push(
                [entity[0],
                [...entity[1].map.values()]],
            );
        }
        return JSON.stringify(rows);
    }
}