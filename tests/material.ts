import { Collector } from "../src/ecs/Collector";
import { Component, ComponentClass, MapComponent } from "../src/ecs/Component";
import { Factory } from "../src/ecs/Factory";
import { System } from "../src/ecs/System";

// Components.
export class Defended extends Component {}
export class Position extends Component {
    x: number;
    y: number;

    constructor(args: {x: number, y: number} = {x: 0, y: 0}) {
        super();
        this.x = args.x;
        this.y = args.y;
    }

    coords() {
        return this.x + '/' + this.y;
    }
}

// Systems.
export class PositionMap extends MapComponent {}
export class PositionCollector extends Collector<PositionMap, Position> {
    public componentsRequired: Set<Function> = new Set([Position]);
    // Map element to hold entity reference. 
    public mapComponent: ComponentClass<PositionMap> = PositionMap;
    // Component from wich you want to track changes.
    public trackedComponent: ComponentClass<Position> = Position;
    // If true, map will be updated on "onChange" call. Else, on "update".
    public changeOrUpdate: boolean = false;
    // Serialize the property you want to track.
    public print (entity: string) {
        return this.ecs.getComponent(entity, Position).coords();
    };
}

export class Mover extends System {
    public componentsRequired = new Set([Position]);
    weight = 0;

    // Update loop.
    public update(delta: number | boolean): void {
        for (const entity of this.entities) {
            const position = this.ecs.getComponent(entity, Position);
            position.x++;
            position.y++;
            position.update();
            this.ecs.getSystem(Drawer).addMessage(entity);
        }
    }

    // On new entity.
    public setEntity(entity: string): void {
        // State tracking example. 
        const position = this.ecs.getComponent(entity, Position);
        position.changed = () => {
            if(this.isDefended(position)) this.ecs.addComponent(entity, new Defended());
            else this.ecs.removeComponent(entity, Defended);
        }
    }

    private isDefended (position: Position) {
        return position.x % 2 === 0 ? true : false;
    }
}

export class Drawer extends System<string> {
    public componentsRequired = new Set([Position]);
    public componentsExcluded = new Set([Defended]);
    filter = true;
    weight = 1;
    public update(delta: number | boolean): void {
        // Update based on message. If "filter" is true, update won't run with an empty message list.
        const targets = this.getMessages();
        for (const entity of this.entities) {
            if(targets.includes(entity)) console.log('Drawing Entity')
        }
    }
}  

// Factory demo.
export class Style extends Component {
    color: "blue" | "red";
    constructor(color: "blue" | "red" = "blue") {
        super();
        this.color = color;
    }
}
export class ThingFactory extends Factory {
    public create(args: { color: "red" | "blue" }): string {
        const entity = this.ecs.addEntity();
        this.ecs.addComponent(entity, new Position({x: 3, y: 3}));
        this.ecs.addComponent(entity, new Style(args.color));
        return entity;
    }
}