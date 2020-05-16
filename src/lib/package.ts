import findPackageJson from 'find-package-json';

export interface PackageJson {
  name: string;
  version: string;
  devDependencies?: {
    [key: string]: string;
  };
}

const getPackageJson = (startDirectory: string): PackageJson => {
  const finder = findPackageJson(startDirectory);
  const results = finder.next();

  if (results.filename) {
    return { name: '', version: '1.0.0', ...results.value };
  } else {
    throw new Error('Unable to find package.json');
  }
};

export { getPackageJson };
