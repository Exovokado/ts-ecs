"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = require("./Component");
const Containers_1 = require("./Containers");
const Event_1 = require("./Event");
;
/**
 * Entity-Components System.
 */
class ECS {
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
        // List of entities in a custom handler.
        this.entities = new Map();
        this.components = new Map();
        // protected proxies: Map<string, typeof Proxy>;
        // List of systems to run.
        this.systems = new Map();
        // List of created factories.
        this.factories = new Map();
        // List of entity for further removal.
        this.entitiesToDestroy = new Set();
        // Track number of entities and current new id to set.
        this.nextEntityID = 1;
        this.emptySytemAllowed = true;
        this.eventManager = new Event_1.EventManager();
        this.queries = new Map();
        this.debug = debug;
        this.logger = log;
    }
    addQuery(query, debug = false) {
        query.ecs = this;
        query.debug = debug;
        query.init();
        for (const entity of this.entities) {
            query.registerEntity(entity[0]);
        }
        this.queries.set(query.constructor.name, query);
    }
    getQuery(queryClass) {
        if (!this.queries.has(queryClass.name))
            throw new Error("query " + queryClass.name + " does not exist");
        return this.queries.get(queryClass.name);
    }
    query(query) {
        if (!this.queries.has(query.name))
            throw new Error("query " + query.name + " does not exist");
        return this.queries.get(query.name).get();
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
        this.entities.set(entity, new Containers_1.ComponentContainer());
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
        this.addComponent(entity, new Component_1.Deleted());
        this.entitiesToDestroy.add(entity);
    }
    /**
     * Run after update() to remove entity from ecs memory and systems list.
     * @param entity entity id.
     */
    destroyEntity(entity) {
        if (this.hasComponent(entity, Component_1.Deleted))
            this.removeComponent(entity, Component_1.Deleted);
        for (const query of this.queries) {
            query[1].onRemove(entity);
            query[1].removeEntity(entity);
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
        if (!components.map.get(component.name))
            throw new Error("Component " + component.name + " not present in entity " + entity + ".");
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
        if (this.systems.has(system.constructor.name))
            return false;
        system.ecs = this;
        if (!this.debug)
            system.debug = false;
        system.init();
        this.systems.set(system.constructor.name, system);
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
        for (const query of this.queries) {
            query[1].registerEntity(entity);
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
        for (const query of this.queries) {
            query[1].onClear();
        }
    }
    print() {
        const rows = [];
        for (const entity of this.entities) {
            let components = [];
            for (const cr of entity[1].map) {
                components.push({
                    name: cr[0],
                    data: JSON.parse(JSON.stringify(cr[1])),
                });
            }
            rows.push({
                entity: entity[0],
                components: components
            });
        }
        return JSON.stringify(rows);
    }
    load(save) {
        for (const entityRow of JSON.parse(save)) {
            const entity = this.addEntity();
            for (const ComponentRow of entityRow.components) {
                const componentClass = this.components.get(ComponentRow.name);
                this.addComponent(entity, new componentClass(ComponentRow.data));
            }
        }
    }
}
exports.default = ECS;
//# sourceMappingURL=ECS.js.map