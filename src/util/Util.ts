import * as fs from "fs";

const batchImport = (directory: string): Promise<any[]> => {
    try {
        const allFiles = fs.readdirSync(directory);
        const jsFiles = allFiles
            .filter((name) => name.match(/\.js$/));
        const tsFiles = allFiles
            .filter((name) => name.match(/\.ts$/));
        const files = jsFiles.length > 0 ? jsFiles : tsFiles;
        const futureImportedFiles = files
            .map((file) => import(`${directory}/${file}`));
        return Promise.all(futureImportedFiles);
    } catch (err) {
        console.error(`Trouble importing from "${directory}":`, err);
        return Promise.resolve([]);
    }
};

export {batchImport};
