import { Room, Client } from "colyseus";
import ServerECS from "../colyseus-ecs/ServerECS";
import { State } from "../colyseus-ecs/Containers";
export declare class ECSRoom extends Room<State> {
    ecs: ServerECS;
    players: Map<string, string>;
    onCreate(options: any): void;
    onJoin(client: Client, options: any): void;
    onLeave(client: Client, consented: boolean): void;
    onDispose(): void;
}
