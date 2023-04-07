import { getDatabaseController } from "./database/DatabaseController";

type CreateControllerOptions<Name extends string, V> = {
	defaultValue: V;
	name: Name;
	assertion?: (value: V) => void | Promise<void>;
};

const createController = <const Name extends string, V>({
	defaultValue,
	name,
	assertion,
}: CreateControllerOptions<Name, V>) => {
	type ValueEntity = { id: Name; value: V };

	const database = getDatabaseController();

	let valueCache: V;

	const getValue = async (): Promise<V> => {
		const maybeValue =
			valueCache ?? (await database.get<ValueEntity>(name, name))?.value;
		valueCache = maybeValue ?? defaultValue;
		return valueCache;
	};

	const setValue = async (value: V): Promise<void> => {
		await assertion?.(value);
		await database.set<ValueEntity>(name, { id: name, value });
		valueCache = value;
	};

	return {
		setValue,
		getValue,
	};
};

export { createController };
