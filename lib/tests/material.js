"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestEventSystem = exports.TestEvent = exports.ThingFactory = exports.Style = exports.Drawer = exports.Mover = exports.DrawerQuery = exports.PositionQuery = exports.Position = exports.Defended = void 0;
const Component_1 = require("../src/ecs/Component");
const Event_1 = require("../src/ecs/Event");
const Factory_1 = require("../src/ecs/Factory");
const Query_1 = require("../src/ecs/Query");
const System_1 = require("../src/ecs/System");
// Components.
class Defended extends Component_1.Component {
}
exports.Defended = Defended;
class Position extends Component_1.Component {
    constructor(args = { x: 0, y: 0 }) {
        super();
        this.x = args.x;
        this.y = args.y;
    }
    coords() {
        return this.x + '/' + this.y;
    }
}
exports.Position = Position;
//Queries
class PositionQuery extends Query_1.Query {
    constructor() {
        super(...arguments);
        this.componentsRequired = new Set([Position]);
    }
    onAdd(entity) {
        const position = this.ecs.getComponent(entity, Position);
        position.changed = () => {
            if (position.x === -10)
                this.ecs.addComponent(entity, new Defended());
            else if (this.ecs.hasComponent(entity, Defended))
                this.ecs.removeComponent(entity, Defended);
        };
    }
}
exports.PositionQuery = PositionQuery;
class DrawerQuery extends Query_1.Query {
    constructor() {
        super(...arguments);
        this.componentsRequired = new Set([Position]);
        this.componentsExcluded = new Set([Defended]);
    }
}
exports.DrawerQuery = DrawerQuery;
// Systems.
class Mover extends System_1.System {
    constructor() {
        super(...arguments);
        this.weight = 0;
        this.debug = true;
    }
    // Update loop.
    update() {
        for (const entity of this.ecs.query(PositionQuery)) {
            const position = this.ecs.getComponent(entity, Position);
            position.x++;
            position.y++;
            this.ecs.getSystem(Drawer).addMessage(entity);
        }
    }
}
exports.Mover = Mover;
class Drawer extends System_1.System {
    constructor() {
        super(...arguments);
        this.filter = true;
        this.weight = 1;
        this.debug = true;
    }
    update() {
        // Update based on message. If "filter" is true, update won't run with an empty message list.
        const targets = this.getMessages();
        for (const entity of this.ecs.query(DrawerQuery)) {
            if (targets.includes(entity)) {
                this.ecs.logger.debug('Drawing Entity');
            }
        }
    }
}
exports.Drawer = Drawer;
class Style extends Component_1.Component {
    constructor(color = "blue") {
        super();
        this.color = color;
    }
}
exports.Style = Style;
class ThingFactory extends Factory_1.Factory {
    create(args) {
        const entity = this.ecs.addEntity();
        this.ecs.addComponent(entity, new Position({ x: 3, y: 3 }));
        this.ecs.addComponent(entity, new Style(args.color));
        return entity;
    }
}
exports.ThingFactory = ThingFactory;
// Events.
class TestEvent extends Event_1.Event {
}
exports.TestEvent = TestEvent;
class TestEventSystem extends System_1.System {
    init() {
        this.listen(TestEvent, (data) => {
            this.ecs.getFactory(ThingFactory).create({ color: data.color });
        });
    }
    update() { }
}
exports.TestEventSystem = TestEventSystem;
//# sourceMappingURL=material.js.map