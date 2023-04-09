import Datastore from "nedb";
import {Collection, DatabaseController, Entity} from "../DatabaseController";
import Log from "../../../util/Log";

type DBRow = any & {_id: string; deleted: boolean};

const collections: Map<Collection, Datastore> = new Map();

const getCollection = (collection: Collection): Datastore => {
	if (!collections.has(collection)) {
		const dataStore = new Datastore({
			filename: `./db/${collection}.db`,
			autoload: true,
		});
		collections.set(collection, dataStore);
	}
	return collections.get(collection);
};

const promisifyNeDB =
	<T>(fn: (...args: [...any[], (e, r: T) => void]) => void): ((...args: any[]) => Promise<T>) =>
	(...args: any[]) =>
		new Promise((resolve, reject) => {
			const callback = (err, result) => {
				if (err) {
					return reject(err);
				} else {
					return resolve(result);
				}
			};
			fn(...args, callback);
		});

const _get = async <T extends Entity>(collectionName: Collection, id: string): Promise<T> => {
	const prefixCollection = getCollection(collectionName);
	const query = {id, deleted: false};
	const document = await promisifyNeDB<DBRow>(prefixCollection.findOne.bind(prefixCollection))(query);
	Log.debug("Retrieved:", document?.id, "from", collectionName);
	if (document) {
		delete document._id;
		delete document.deleted;
	}
	return document;
};

const _scan = async <T extends Entity>(
	collectionName: Collection,
	userQuery: Record<string, unknown>
): Promise<T[]> => {
	const query = {...userQuery, deleted: false};
	const cursor = getCollection(collectionName).find(query);
	const documents = await promisifyNeDB<DBRow[]>(cursor.exec.bind(cursor))();
	const entries: T[] = documents.map((entry): T => {
		delete entry._id;
		delete entry.deleted;
		return entry;
	});
	Log.info(`Retrieved ${documents.length} from ${collectionName}`);
	return entries;
};

const _set = async <T extends Entity>(collectionName: Collection, item: T): Promise<void> => {
	const {id} = item;
	Log.debug(`Setting ${id} in ${collectionName}`);
	const row = {...item, deleted: false};
	const collection = getCollection(collectionName);
	return promisifyNeDB<void>(collection.update.bind(collection))({id}, row, {upsert: true});
};

const _delete = (collectionName: Collection, id: string): Promise<void> => {
	Log.debug(`Deleting ${id} in the db from ${collectionName}`);
	const collection = getCollection(collectionName);
	return promisifyNeDB<void>(collection.update.bind(collection))({id}, {$set: {deleted: true}}, {});
};

export const NeDBController: DatabaseController = {
	get: _get,
	set: _set,
	scan: _scan,
	delete: _delete,
};
