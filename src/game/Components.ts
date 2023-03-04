import SyncComponent from "../colyseus-ecs/Components";
import { type } from "@colyseus/schema";
import { Component } from "../ecs/Component";
import { Schema } from "@colyseus/schema";

export class Position extends SyncComponent {
    @type("number")
    x = 0;
    @type("number")
    y = 0;
}

export class Player extends SyncComponent {
    @type("string")
    id: string;
    constructor(id: string) {
        super();
        this.id = id;
    }
}

export class Secret extends Component {
    number = Math.floor(Math.random() * 10);
}
