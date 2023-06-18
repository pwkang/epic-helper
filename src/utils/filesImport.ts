import readdirp, {EntryInfo, ReaddirpOptions} from 'readdirp';

interface IImportFiles {
  path: string;
  options: ReaddirpOptions;
}

export const importFiles = <T>({options, path}: IImportFiles): Promise<T[]> => {
  return new Promise((resolve) => {
    const files: any[] = [];
    readdirp(path, options)
      .on('data', async (entry: EntryInfo) => {
        const {fullPath} = entry;
        const file = await import(fullPath);
        files.push(file.default);
      })
      .on('end', () => {
        resolve(files);
      });
  });
};
