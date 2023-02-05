import { Component, ComponentClass, MapComponent } from "./Component";
import { Entity } from "./Entity";
import { System } from "./System";
export declare abstract class Collector<A extends MapComponent, B extends Component> extends System {
    abstract print(entity: Entity): string;
    abstract readonly mapComponent: ComponentClass<A>;
    abstract readonly trackedComponent: ComponentClass<B>;
    readonly changeOrUpdate: boolean;
    private map;
    private deleteMap;
    setEntity(entity: Entity): void;
    private setRow;
    private updateRow;
    unsetEntity(entity: Entity): void;
    has(key: string): boolean;
    get(key: string): Set<string>;
    update(): void;
}
