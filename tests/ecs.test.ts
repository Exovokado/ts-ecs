import ECS from "../src/ecs/ECS";
import { Drawer, Mover, Position, Style, TestEvent, TestEventSystem, ThingFactory } from "./material";

const ecs = new ECS(true);

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
        expect(ecs.getSystem(Mover).hasAny()).toBe(false);

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
        expect(ecs.print()).toBe('[[\"2\",[{\"isSync\":false,\"x\":3,\"y\":2}]]]')

        const save = ecs.export();
        expect(save).toBe('[[[\"Position\",\"{\\\"isSync\\\":false,\\\"x\\\":3,\\\"y\\\":2}\"]]]');

        // Load Save.
        ecs.clear()
        ecs.load(save)
        expect(ecs.print()).toBe('[[\"3\",[{\"isSync\":false,\"x\":3,\"y\":2}]]]')
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
        });
        expect(ecs.getComponent("5", Style).color).toBe("red")
    });


});

