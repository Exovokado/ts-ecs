import { Player, Position } from "./Components";
import { System } from "../ecs/System";
import { PositionQuery } from "../../tests/material";

export class Mover extends System<{playerId: string, x: 1 | -1 | 0, y: 1 | -1 | 0}> {
    public filter: boolean = true;
    public update(delta: number | boolean): void {
        const msg = this.getMessage();
        for (const entity of this.ecs.query(PositionQuery)) {
            const player = this.ecs.getComponent(entity, Player);
            if(player.id === msg.playerId) {
                const position = this.ecs.getComponent(entity, Position);
                if(msg.x !== 0) position.x += msg.x * 10;
                if(msg.y !== 0) position.y += msg.y * 10;
            }
        }
    }
}