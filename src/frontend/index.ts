import * as Colyseus from "colyseus.js";

export function newClient(room_name: string) {
    var client = new Colyseus.Client('ws://localhost:2567');
    return client.joinOrCreate(room_name)
}
