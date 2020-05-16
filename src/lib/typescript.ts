import fs from 'fs';
import path from 'path';

import { PackageJson } from './package';

const isTypeScriptProject = (packageJson: PackageJson): boolean => {
  if (
    packageJson.devDependencies &&
    Object.keys(packageJson.devDependencies).includes('typescript')
  ) {
    return true;
  } else {
    return fs.existsSync(path.join(process.cwd(), 'tsconfig.json'));
  }
};

export { isTypeScriptProject };
