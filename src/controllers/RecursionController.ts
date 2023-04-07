import { createController } from "./Controller";

const { getValue, setValue } = createController({
	defaultValue: false,
	name: "recursion",
});

export default {
	setRecursionAllowed: setValue,
	isRecursionAllowed: getValue,
};
