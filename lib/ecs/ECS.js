import { Deleted } from "./Component";
import { ComponentContainer } from "./Containers";
;
/**
 * Entity-Components System.
 */
export default class ECS {
    // List of entities in a custom handler.
    entities = new Map();
    components = new Map();
    // protected proxies: Map<string, typeof Proxy>;
    // List of systems to run.
    systems = new Map();
    // List of created factories.
    factories = new Map();
    // List of entity for further removal.
    entitiesToDestroy = new Set();
    // Track number of entities and current new id to set.
    nextEntityID = 1;
    emptySytemAllowed = true;
    debug;
    logger;
    /**
     * You could also use a simple entity map and not extend entitycontainer.
     * @param entityContainer custom handler to list entities.
     * @param save game save data.
     * @param debug boolean.
     */
    constructor(debug = false, log = {
        warn: (msg) => { console.log(msg); },
        debug: (msg) => { console.log(msg); },
        error: (msg) => { console.log(msg); }
    }) {
        this.debug = debug;
        this.logger = log;
    }
    /**
     * Run game logic at each game tick.
     */
    update(delta = false) {
        // System updates.
        for (const system of this.systems) {
            if (system[1].check())
                system[1].update(delta);
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
    addFactory(factory) {
        if (this.factories.has(factory.constructor.name))
            return;
        factory.ecs = this;
        this.factories.set(factory.constructor.name, factory);
    }
    /**
     * Remove factory to ecs list.
     * @param name name of the factory.
     * @param factory factory object.
     */
    getFactory(componentClass) {
        let factory = this.factories.get(componentClass.name);
        if (!factory) {
            throw new Error("factory " + componentClass.name + " does not exist");
        }
        return factory;
    }
    /**
     * Instantiate and register a new entity.
     * @returns entity id.
     */
    addEntity() {
        let entity = this.nextEntityID.toString();
        this.nextEntityID++;
        this.entities.set(entity, new ComponentContainer());
        return entity;
    }
    entityExist(entity) {
        return this.entities.get(entity) ? true : false;
    }
    /**
     * Mark entiy for further removal, to prevent system conflicts.
     * @param entity entity id.
     */
    removeEntity(entity) {
        this.addComponent(entity, new Deleted());
        this.entitiesToDestroy.add(entity);
    }
    /**
     * Run after update() to remove entity from ecs memory and systems list.
     * @param entity entity id.
     */
    destroyEntity(entity) {
        this.removeComponent(entity, Deleted);
        for (const system of this.systems) {
            system[1].removeEntity(entity);
        }
        this.entitiesToDestroy.delete(entity);
        this.entities.delete(entity.toString());
    }
    registerComponent(componentClass) {
        this.components.set(componentClass.name, componentClass);
    }
    /**
     * Register a new component for a given entity.
     * @param entity entity id.
     * @param component Component instance.
     */
    addComponent(entity, component) {
        const components = this.getComponents(entity);
        components.map.set(component.constructor.name, new Proxy(component, {
            set: (target, p, newValue) => {
                if (p === "isSync")
                    return;
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
    removeComponent(entity, component) {
        const components = this.getComponents(entity);
        components.map.delete(component.name);
        this.checkEntity(entity);
    }
    /**
     * Return entity components bundle for cloning.
     * @param entity Entity id.
     * @returns all entity components.
     */
    getComponents(entity) {
        let ComponentContainer = this.entities.get(entity.toString());
        if (!ComponentContainer) {
            throw new Error("Entity :" + entity.toString() + " Not found");
        }
        else
            return ComponentContainer;
    }
    /**
     * Return a single component.
     * @param entity Entity id.
     * @param component
     * @returns the component.
     */
    getComponent(entity, componentClass) {
        const components = this.getComponents(entity);
        if (!this.hasComponent(entity, componentClass))
            throw new Error("Component :" + componentClass + " Not found");
        return components.map.get(componentClass.name);
    }
    getComponentIfExist(entity, componentClass) {
        const components = this.getComponents(entity);
        if (!this.hasComponent(entity, componentClass))
            return null;
        return components.map.get(componentClass.name);
    }
    /**
     * Check if entity implements a given component.
     * @param entity  Entity id.
     * @param component Component instance.
     * @returns true or false.
     */
    hasComponent(entity, component) {
        return this.getComponents(entity).map.get(component.name) ? true : false;
    }
    /**
     * Check for any implementation of components list
     * @param entity  Entity id.
     * @param components
     * @returns
     */
    hasAnyComponents(entity, components) {
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
    hasAllComponents(entity, components) {
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
    addSystem(system) {
        if (!this.emptySytemAllowed)
            if (system.componentsRequired.size == 0) {
                this.logger.warn("System not added: empty Components list.");
                this.logger.warn(system);
                return false;
            }
        if (this.systems.has(system.constructor.name))
            return false;
        system.ecs = this;
        if (!this.debug)
            system.debug = false;
        system.init();
        this.systems.set(system.constructor.name, system);
        for (const entity of this.entities) {
            system.registerEntity(entity[0]);
        }
        this.systems = new Map([...this.systems.entries()].sort((a, b) => a[1].weight - b[1].weight));
        return true;
    }
    /**
     * Remove system from ecs.
     * @param system
     */
    removeSystem(system) {
        this.systems.delete(system.name);
    }
    /**
     * Get system by name.
     * @param systemName
     * @returns
     */
    getSystem(system) {
        const ecs_system = this.systems.get(system.name);
        if (!ecs_system)
            throw new Error("Requested System " + system.name + " does not exist");
        return ecs_system;
    }
    /**
    * Get system by name.
    * @remark Use carrefully, as it wont throw error on non existing system.
    * @param systemName
    * @returns
    */
    getSystemIfExists(system) {
        const ecs_system = this.systems.get(typeof system === "string" ? system : system.name);
        if (!ecs_system)
            return null;
        return ecs_system;
    }
    /**
     * Run on systems to check entity components for registration.
     * @param entity  Entity id.
     */
    checkEntity(entity) {
        for (const system of this.systems) {
            system[1].registerEntity(entity);
        }
    }
    clear() {
        for (const entity of this.entities) {
            let isMap = false;
            for (const component of entity[1].map) {
                if (Object.keys(component[1]).includes("map"))
                    isMap = true;
            }
            if (!isMap)
                this.destroyEntity(entity[0]);
        }
        for (const system of this.systems) {
            system[1].onClear();
        }
    }
    export() {
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
            if (row.length)
                rows.push(row);
        }
        return JSON.stringify(rows);
    }
    load(save) {
        for (const entityRow of JSON.parse(save)) {
            const entity = this.addEntity();
            for (const ComponentRow of entityRow) {
                const componentClass = this.components.get(ComponentRow[0]);
                this.addComponent(entity, new componentClass(JSON.parse(ComponentRow[1])));
            }
        }
    }
    print() {
        const rows = [];
        for (const entity of this.entities) {
            rows.push([entity[0],
                [...entity[1].map.values()]]);
        }
        return JSON.stringify(rows);
    }
}
//# sourceMappingURL=ECS.js.map