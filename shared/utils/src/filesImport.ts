import readdirp, {EntryInfo, ReaddirpOptions} from 'readdirp';

interface IImportFiles {
  path: string;
  options: ReaddirpOptions;
}

interface IReturn<T> {
  data: T;
  path: string;
}

export const importFiles = <T>({options, path}: IImportFiles): Promise<IReturn<T>[]> => {
  return new Promise((resolve) => {
    const files: IReturn<T>[] = [];
    readdirp(path, options)
      .on('data', async (entry: EntryInfo) => {
        const {fullPath, path} = entry;
        const file = await import(fullPath);
        files.push({
          data: file.default,
          path,
        });
      })
      .on('end', () => {
        resolve(files);
      });
  });
};
