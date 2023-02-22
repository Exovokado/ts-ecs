import { Schema, MapSchema } from "@colyseus/schema";
import SyncComponent from "./Components";
export declare class SyncComponentContainer extends Schema {
    syncMap: MapSchema<SyncComponent, string>;
}
export declare class State extends Schema {
    entities: MapSchema<SyncComponentContainer, string>;
}
