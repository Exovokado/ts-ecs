import { Entity } from "./Entity";
/**
 * Structure holding entities data.
 */
export declare abstract class Component {
    changed: (prop: string | symbol, value: any) => void;
    update: () => void;
    isSync: boolean;
}
export declare type ComponentClass<T extends Component> = new (...args: any[]) => T;
export declare class Locked extends Component {
}
export declare abstract class MapComponent extends Component {
    map: Map<string, Set<Entity>>;
}
