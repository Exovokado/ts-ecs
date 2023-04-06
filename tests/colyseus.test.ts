import assert from "assert";
import { ColyseusTestServer, boot } from "@colyseus/testing";

// import your "arena.config.ts" file here.
import appConfig from "../src/arena.config";
import { ECSRoom } from "../src/game/ECSRoom";
import { Position, Secret } from "../src/game/Components";
import { State } from "../src/colyseus-ecs/Containers";
import { ClientECS } from "../src/colyseus-ecs/ClientECS";
import { Defended, Mover, PositionQuery } from "./material";


describe("testing basic Colyseus app", () => {
  let colyseus: ColyseusTestServer;

  beforeAll(async () => colyseus = await boot(appConfig));
  afterAll(async () => colyseus.shutdown());
  beforeEach(async () => { await colyseus.cleanup() });

  it("connecting into a room", async () => {
    // `room` is the server-side Room instance reference.
    const room = await colyseus.createRoom<State>("my_room", {}) as ECSRoom;

    // `client1` is the client-side `Room` instance reference (same as JavaScript SDK)
    const client1 = await colyseus.connectTo(room);
    const client2 = await colyseus.connectTo(room);

    const client1_ecs = new ClientECS();
    const client2_ecs = new ClientECS();

    client1_ecs.synch(client1.state)
    client2_ecs.synch(client2.state)

    assert.strictEqual(client1.sessionId, room.clients[0].sessionId);

    await room.waitForNextPatch();

    assert.deepStrictEqual(client1.state.toJSON(), {
      "entities": {
        "1": {
          "syncMap": {
            "Player": {
              "id": client1.sessionId
            }, "Position": { "x": 0, "y": 0 }
          }
        }, "2": {
          "syncMap": {
            "Player": {
              "id": client2.sessionId
            }, "Position": { "x": 0, "y": 0 }
          }
        }
      }
    });
    let position = room.ecs.getComponent("1", Position);
    let client_position = client1_ecs.getComponent("1", Position);

    client1_ecs.addQuery(new PositionQuery());
    client1_ecs.addSystem(new Mover());

    client1.send("move", { x: -1 });
    await room.waitForMessage("move");
    await room.waitForNextPatch();

    assert.strictEqual(position.x, -10);
    assert.strictEqual(client_position.x, -10);
    assert.ok(client1_ecs.hasComponent("1", Defended));

    client1.leave()
    await room.waitForNextPatch();
 
    assert.ok(!room.ecs.entityExist("1"));

    client2_ecs.update();
    assert.ok(!client2_ecs.entityExist("1"));

    client2.send("move", { y: -1 });
    await room.waitForMessage("move");
    await room.waitForNextPatch();

    position = room.ecs.getComponent("2", Position);
    assert.strictEqual(position.y, -10);

    assert.ok(room.ecs.hasComponent("2", Secret));
    assert.ok(!client2_ecs.hasComponent("2", Secret));
  });
});
