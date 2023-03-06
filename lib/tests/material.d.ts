import { Component } from "../src/ecs/Component";
import { Event } from "../src/ecs/Event";
import { Factory } from "../src/ecs/Factory";
import { Query } from "../src/ecs/Query";
import { System } from "../src/ecs/System";
export declare class Defended extends Component {
}
export declare class Position extends Component {
    x: number;
    y: number;
    constructor(args?: {
        x: number;
        y: number;
    });
    coords(): string;
}
export declare class PositionQuery extends Query {
    componentsRequired: Set<typeof Position>;
    onAdd(entity: string): void;
}
export declare class DrawerQuery extends Query {
    componentsRequired: Set<typeof Position>;
    componentsExcluded: Set<typeof Defended>;
}
export declare class Mover extends System {
    weight: number;
    debug: boolean;
    update(): void;
}
export declare class Drawer extends System<string> {
    filter: boolean;
    weight: number;
    debug: boolean;
    update(): void;
}
type Colors = "blue" | "red";
export declare class Style extends Component {
    color: Colors;
    constructor(color?: Colors);
}
export declare class ThingFactory extends Factory {
    create(args: {
        color: Colors;
    }): string;
}
export declare class TestEvent extends Event<{
    color: Colors;
}> {
}
export declare class TestEventSystem extends System {
    init(): void;
    update(): void;
}
export {};
