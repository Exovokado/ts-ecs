import ECS from "../src/ecs/ECS";
import { Drawer, Mover, Position, PositionCollector, Style, ThingFactory } from "./material";

// ECS instaciation.
const ecs = new ECS(
    // Pass in your favorite logger.
    {
        warn: (msg) => { console.log(msg) },
        debug: (msg) => { console.log(msg) },
        error: (msg) => { console.log(msg) }
    },
    false
);
ecs.registerComponent(Position);
ecs.addSystem(new Mover());
ecs.addSystem(new Drawer());
ecs.addSystem(new PositionCollector());

describe('testing index file', () => {
    test('empty string should result in zero', () => {
        // Create.
        let entity = ecs.addEntity();

        // Read.
        ecs.addComponent(entity, new Position({ x: 3, y: 2 }));
        const position = ecs.getComponent(entity, Position);
        expect(position.coords()).toBe("3/2");

        ecs.updateComponent(entity, Position, { x: 4, y: 6 });
        expect(position.coords()).toBe("4/6");

        ecs.updateComponent(entity, Position, { x: 3, y: 2 });
        expect(position.coords()).toBe("3/2");

        // Update.
        ecs.update(); // Set in your game loop.
        expect(position.coords()).toBe("4/3");

        ecs.getSystem(Mover).suspend(1);
        ecs.update();
        expect(position.coords()).toBe("4/3");

        ecs.update();
        expect(position.coords()).toBe("5/4");

        // Read (custom query).
        expect(ecs.getSystem(PositionCollector).get("5/4")?.has(entity)).toBe(true);

        // Delete.
        ecs.removeComponent(entity, Position);
        expect(ecs.getSystem(Mover).hasAny()).toBe(false);

        ecs.removeEntity(entity);
        expect(ecs.entityExist(entity)).toBe(true);

        ecs.update();
        expect(ecs.entityExist(entity)).toBe(false);

        // Export Save.
        entity = ecs.addEntity();
        ecs.addComponent(entity, new Position({ x: 3, y: 2 }));
        expect(JSON.stringify(ecs.print())).toBe('[[\"2\",[{\"isSync\":false,\"map\":{}}]],[\"3\",[{\"isSync\":false,\"x\":3,\"y\":2}]]]')

        const save = ecs.export();
        expect(save).toBe('[[[\"Position\",\"{\\\"isSync\\\":false,\\\"x\\\":3,\\\"y\\\":2}\"]]]');

        // Load Save.
        ecs.clear()
        expect(JSON.stringify(ecs.print())).toBe('[[\"2\",[{\"isSync\":false,\"map\":{}}]]]')

        ecs.load(save)
        expect(JSON.stringify(ecs.print())).toBe('[[\"2\",[{\"isSync\":false,\"map\":{}}]],[\"4\",[{\"isSync\":false,\"x\":3,\"y\":2}]]]')

        // Create via Factory.
        ecs.addFactory(new ThingFactory());

        const thing = ecs.getFactory(ThingFactory).create({ color: "blue" });
        expect(ecs.hasAllComponents(thing, [Position, Style])).toBe(true)
    });
});