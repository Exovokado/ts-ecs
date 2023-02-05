import { Entity } from "./Entity";

/**
 * Structure holding entities data.
 */
export abstract class Component {
    changed: (prop: string | symbol, value: any) => void = () => { };
    update: () => void = () => { };
    isSync: boolean = false;
}

export type ComponentClass<T extends Component> = new (...args: any[]) => T

export class Locked extends Component { }

export abstract class MapComponent extends Component {
    map: Map<string, Set<Entity>> = new Map();
}
