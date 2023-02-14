import { Schema } from "@colyseus/schema";
import { Component } from "src/ecs/Component";

export default abstract class SyncComponent extends Schema implements Component {
    changed: (prop: string | symbol, value: any) => void = () => { };
    update: () => void = () => { };
    readonly isSync: boolean = true;
}