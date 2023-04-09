import {NeDBController} from "./impl/NeDBController";

export type Collection = string;
export type Entity = {id: string};

export interface DatabaseController {
	get<T extends Entity>(collection: Collection, id: string): Promise<T>;
	set<T extends Entity>(collection: Collection, value: T): Promise<void>;
	scan<T extends Entity>(collection: Collection, query: any): Promise<T[]>;
	delete(collection: Collection, id: string): Promise<void>;
}

export const getDatabaseController = (): DatabaseController => NeDBController;
