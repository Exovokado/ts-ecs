/**
 * Structure holding entities data.
 */
export declare abstract class Component {
    changed: (prop: string, value: any) => void;
    update: () => void;
    readonly isSync: boolean;
}
export type ComponentClass<T extends Component> = new (...args: any[]) => T;
export declare class Locked extends Component {
}
export declare class Deleted extends Component {
}
