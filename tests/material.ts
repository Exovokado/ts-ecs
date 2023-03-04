import { Component } from "../src/ecs/Component";
import { Event } from "../src/ecs/Event";
import { Factory } from "../src/ecs/Factory";
import { Query } from "../src/ecs/Query";
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

//Queries
export class PositionQuery extends Query {
    componentsRequired = new Set([Position]);
    public onAdd(entity: string): void {
        const position = this.ecs.getComponent(entity, Position);
        position.changed = () => {
            if(position.x === -10) this.ecs.addComponent(entity, new Defended());
            else if(this.ecs.hasComponent(entity, Defended)) this.ecs.removeComponent(entity, Defended);
        }
    }
}

export class DrawerQuery extends Query {
    componentsRequired = new Set([Position]);
    componentsExcluded = new Set([Defended]);
}

// Systems.
export class Mover extends System {
    weight = 0;
    debug = true;

    // Update loop.
    public update(): void {
        for (const entity of this.ecs.query(PositionQuery)) {
            const position = this.ecs.getComponent(entity, Position);
            position.x++;
            position.y++;
            this.ecs.getSystem(Drawer).addMessage(entity);
        }
    }
}

export class Drawer extends System<string> {
    filter = true;
    weight = 1;
    debug = true;

    public update(): void {
        // Update based on message. If "filter" is true, update won't run with an empty message list.
        const targets = this.getMessages();
        for (const entity of this.ecs.query(DrawerQuery)) {
            if(targets.includes(entity)) {
                this.ecs.logger.debug('Drawing Entity')
            }
        }
    }
}  

// Factory demo.
type Colors = "blue" | "red";
export class Style extends Component {
    color: Colors;
    constructor(color: Colors = "blue") {
        super();
        this.color = color;
    }
}

export class ThingFactory extends Factory {
    public create(args: { color: Colors }): string {
        const entity = this.ecs.addEntity();
        this.ecs.addComponent(entity, new Position({x: 3, y: 3}));
        this.ecs.addComponent(entity, new Style(args.color));
        return entity;
    }
}

// Events.
export class TestEvent extends Event<{color: Colors}> {}

export class TestEventSystem extends System {
    init() {
        this.listen(TestEvent, (data) => {
            this.ecs.getFactory(ThingFactory).create({ color: data.color });
        });
    }
    public update(): void {}
}