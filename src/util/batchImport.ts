import * as fs from "fs";
import Log from "./Log";

const batchImport = (directory: string): Promise<any[]> => {
    try {
        const filePaths = readDir(directory);
        const fileNames = filePaths.map((path) => path.replace(directory, ""));
        const jsFiles = fileNames
            .filter((name) => name.match(/\.js$/));
        const tsFiles = fileNames
            .filter((name) => name.match(/\.ts$/));
        const files = jsFiles.length > 0 ? jsFiles : tsFiles;
        const futureImportedFiles = files
            .map((file) => import(`${directory}/${file}`));
        return Promise.all(futureImportedFiles);
    } catch (err) {
        Log.error(`Trouble importing from "${directory}":`, err);
        return Promise.resolve([]);
    }
};

const readDir = (directory: string): string[] => {
    const entries = fs.readdirSync(directory);
    return entries.flatMap((entry) => {
        const path = `${directory}/${entry}`;
        if (fs.statSync(path).isDirectory()) {
            return readDir(path);
        } else {
            return path;
        }
    });
};

export {batchImport};
