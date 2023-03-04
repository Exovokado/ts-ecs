import { Room, Client } from "colyseus";
import { PlayerFactory } from "./Factories";
import { Mover } from "./Systems";
import ServerECS from "../colyseus-ecs/ServerECS";
import { State } from "../colyseus-ecs/Containers";
import { PositionQuery } from "../../tests/material";

export class ECSRoom extends Room<State> {
  ecs: ServerECS;
  players = new Map<string, string>();

  onCreate (options: any) {
    const state = new State();
    this.setState(state);
    this.ecs = new ServerECS(state, true);
    this.ecs.addQuery(new PositionQuery());
    this.ecs.addSystem(new Mover());
    this.ecs.addFactory(new PlayerFactory);
    this.onMessage("move", (client, message) => {
      this.ecs.getSystem(Mover).addMessage({
        playerId: client.sessionId,
        x: message.x !== undefined ? message?.x : 0,
        y: message.y !== undefined ? message?.y : 0
      })
      this.ecs.update();
    });
  }

  onJoin (client: Client, options: any) {
    this.ecs.logger.debug(client.sessionId + "joined!");
    this.players.set(
      client.sessionId,
      this.ecs.getFactory(PlayerFactory).create({ sessionId: client.sessionId })
    );
  }

  onLeave (client: Client, consented: boolean) {
    this.ecs.logger.debug(client.sessionId + " left!");
    this.ecs.removeEntity(this.players.get(client.sessionId) as string);
    this.ecs.update();
  }

  onDispose() {
    this.ecs.logger.debug("room " + this.roomId + " disposing...");
  }

}
