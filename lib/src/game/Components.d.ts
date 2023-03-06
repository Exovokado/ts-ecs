import SyncComponent from "../colyseus-ecs/Components";
import { Component } from "../ecs/Component";
export declare class Position extends SyncComponent {
    x: number;
    y: number;
}
export declare class Player extends SyncComponent {
    id: string;
    constructor(id: string);
}
export declare class Secret extends Component {
    number: number;
}
