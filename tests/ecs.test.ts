import ECS from "../src/ecs/ECS";
import { Drawer, DrawerQuery, Mover, Position, PositionQuery, Style, TestEvent, TestEventSystem, ThingFactory } from "./material";

const ecs = new ECS(true);
ecs.addQuery(new PositionQuery());
ecs.addQuery(new DrawerQuery());

ecs.addSystem(new Mover());
ecs.addSystem(new Drawer());

describe('testing basics', () => {
    test('CRUD', () => {
        // Create.
        let entity = ecs.addEntity();
        // Read.
        ecs.addComponent(entity, new Position({ x: 3, y: 2 }));
        const position = ecs.getComponent(entity, Position);
        expect(position.coords()).toBe("3/2");

        position.x = 4;
        position.y = 6;
        expect(position.coords()).toBe("4/6");
        position.x = 3;
        position.y = 2;
        expect(position.coords()).toBe("3/2");

        // Update.
        ecs.update();
        expect(position.coords()).toBe("4/3");

        ecs.getSystem(Mover).suspend(1);
        ecs.update();
        expect(position.coords()).toBe("4/3");

        ecs.update();
        expect(position.coords()).toBe("5/4");

        // Delete.
        ecs.removeComponent(entity, Position);
        expect(ecs.getQuery(PositionQuery).hasAny()).toBe(false);

        ecs.removeEntity(entity);
        expect(ecs.entityExist(entity)).toBe(true);

        ecs.update();
        expect(ecs.entityExist(entity)).toBe(false);
    });
    test('save / load / print', () => {
        // A registered component may be later exported / imported.
        ecs.registerComponent(Position);
        // Export Save.
        const entity = ecs.addEntity();
        ecs.addComponent(entity, new Position({ x: 3, y: 2 }));
        ecs.snap();
        ecs.removeComponent(entity, Position);
        // Load Save.
        ecs.reset();
        expect(ecs.getComponent(ecs.getQuery(PositionQuery).get().next().value, Position).x).toEqual(3);
    });
    test('factory', () => {
        // Create via Factory.
        ecs.addFactory(new ThingFactory());
        const thing = ecs.getFactory(ThingFactory).create({ color: "blue" });
        expect(ecs.hasAllComponents(thing, [Position, Style])).toBe(true)
    });
    test('events', () => {
        ecs.eventManager.register(new TestEvent());
        ecs.addSystem(new TestEventSystem());
        ecs.eventManager.get(TestEvent).dispatch({
            color: "red"
        }, "Test Context");
        expect(ecs.getComponent("5", Style).color).toBe("red");
        ecs.eventManager.print();
    });
});
