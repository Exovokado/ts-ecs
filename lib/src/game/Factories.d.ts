import { Factory } from "../ecs/Factory";
export declare class PlayerFactory extends Factory {
    create(args: {
        sessionId: string;
    }): string;
}
