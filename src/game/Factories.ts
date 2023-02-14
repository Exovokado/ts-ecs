import { Player, Position, Secret } from "./Components";
import { Factory } from "../ecs/Factory";

export class PlayerFactory extends Factory {
    public create(args: { sessionId: string }): string {
        const entity = this.ecs.addEntity();
        this.ecs.addComponent(entity, new Position());
        this.ecs.addComponent(entity, new Secret());
        this.ecs.addComponent(entity, new Player(args.sessionId));
        return entity;
    }
}