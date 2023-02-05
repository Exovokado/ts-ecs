import { Component, ComponentClass, MapComponent } from "./Component";
import { Entity } from "./Entity";
import { System } from "./System";

export abstract class Collector<A extends MapComponent, B extends Component> extends System {
    public abstract print (entity: Entity): string;
    public abstract readonly mapComponent: ComponentClass<A>;
    public abstract readonly trackedComponent: ComponentClass<B>;
    public readonly changeOrUpdate: boolean = true;
    private map: Entity;
    private deleteMap = new Map<Entity, string>();

    setEntity(entity: Entity): void  {
        if(!this.map) {
            this.map = this.ecs.addEntity();
            this.ecs.addComponent(this.map, new this.mapComponent());
        }
        let key = this.print(entity);
        this.setRow(entity, key);
        const tracked = this.ecs.getComponent(entity, this.trackedComponent);
        const cb = () => {          
            key = this.updateRow(entity, key, this.print(entity));
        }
        if(this.changeOrUpdate) tracked.changed = cb;
        else tracked.update = cb;
    }

    private setRow(entity: Entity, key: string) {
        const map = this.ecs.getComponent(this.map, this.mapComponent).map;
        let row: Set<Entity> = map.has(key) ? map.get(key) : new Set();
        row.add(entity);
        if(!map.has(key)) map.set(key, row);
        this.deleteMap.set(entity, key);
    }

    private updateRow(entity: Entity, from: string, to: string): string {
        const map = this.ecs.getComponent(this.map, this.mapComponent).map;
        let row: Set<Entity> = map.get(from);
        row.delete(entity);
        this.setRow(entity, to);
        this.deleteMap.set(entity, to);
        return to;
    }

    unsetEntity(entity: Entity): void {
        const map = this.ecs.getComponent(this.map, this.mapComponent).map;
        const row = map.get(this.deleteMap.get(entity));
        row.delete(entity);
        this.deleteMap.delete(entity);
    }

    public has(key: string) {
        const map = this.ecs.getComponent(this.map, this.mapComponent).map;
        return map.has(key);
    }

    public get(key: string) {
        const map = this.ecs.getComponent(this.map, this.mapComponent).map;
        return new Set(map.get(key));
    }

    update() { }
}