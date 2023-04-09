import { getDatabaseController } from "./database/DatabaseController";

type CreateControllerOptions<Name extends string, Value> = {
	defaultValue: Value;
	name: Name;
	assertion?: (value: Value) => void | Promise<void>;
};

const createController = <const Name extends string, Value>({
	defaultValue,
	name,
	assertion,
}: CreateControllerOptions<Name, Value>) => {
	type ValueEntity = { id: Name; value: Value };

	const database = getDatabaseController();

	let valueCache: Value;

	const getValue = async (): Promise<Value> => {
		const maybeValue =
			valueCache ?? (await database.get<ValueEntity>(name, name))?.value;
		valueCache = maybeValue ?? defaultValue;
		return valueCache;
	};

	const setValue = async (value: Value): Promise<void> => {
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
