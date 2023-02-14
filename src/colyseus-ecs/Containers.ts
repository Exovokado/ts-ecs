import { Schema, MapSchema, type } from "@colyseus/schema";
import SyncComponent from "./Components";

export class SyncComponentContainer extends Schema {
    @type({ map: SyncComponent })
    public syncMap = new MapSchema<SyncComponent>();
}

export class State extends Schema {
    @type({ map: SyncComponentContainer })
    public entities = new MapSchema<SyncComponentContainer>();
}