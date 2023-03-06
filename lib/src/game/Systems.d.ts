import { System } from "../ecs/System";
export declare class Mover extends System<{
    playerId: string;
    x: 1 | -1 | 0;
    y: 1 | -1 | 0;
}> {
    filter: boolean;
    update(delta: number | boolean): void;
}
