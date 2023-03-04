import { Component, ComponentClass, Locked } from "./Component";
import ECS from "./ECS";
import { Entity } from "./Entity";

export type QueryClass<T extends Query> = new (...args: any[]) => T

export abstract class Query {
    public readonly abstract componentsRequired: Set<ComponentClass<Component>>;
    public readonly componentsExcluded: Set<ComponentClass<Component>> = new Set([Locked]);
    protected entities = new Set<Entity>();
    public debug: boolean = false;
    public ecs: ECS;

    public removeEntity(entity: Entity) {
        this.entities.delete(entity);
    }

    public registerEntity(entity: Entity): void {
        if (this.ecs.hasAllComponents(entity, this.componentsRequired) && !this.ecs.hasAnyComponents(entity, this.componentsExcluded)) {
            if (!this.entities.has(entity)) {
                this.entities.add(entity);
                this.onAdd(entity);
            }
        }
        else if (this.entities.has(entity)) {
            this.onRemove(entity);
            this.removeEntity(entity);
        }
    }

    public get() {
        return this.entities.values();
    }

    public hasAny(): boolean {
        return this.entities.size ? true : false;
    }

    public getRand(): Entity {
        const k = Math.floor(Math.random() * this.entities.size);
        return [...this.entities][k] as Entity;
    }

    public has(entity: Entity): boolean {
        return this.entities.has(entity) ? true : false;
    }   

    public onAdd(entity: Entity) {
        if(this.debug) this.ecs.logger.debug('Adding entity ' + entity + ' to ' + this.constructor.name);
    }

    public onRemove(entity: Entity) {
        if(this.debug) this.ecs.logger.debug('Removing entity ' + entity + ' from ' + this.constructor.name);
    }

    public onClear() {
        if(this.debug) this.ecs.logger.debug('Clearing ' + this.constructor.name);
    }
}