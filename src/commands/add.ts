import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import pacote from 'pacote';

import { runYarn } from '../lib/yarn';

const add = async (packages: string[]): Promise<void> => {
  const typePackages = [];

  for (const pkg of packages) {
    if (!pkg.startsWith('-') && !pkg.startsWith('--') && !pkg.startsWith('@types')) {
      let typePackage = `@types/${pkg}`;

      if (pkg.startsWith('@')) {
        const [org, packageName] = pkg.slice(1).split('/');

        typePackage = `@types/${org}__${packageName}`;
      }

      try {
        const packageJsonPath = require.resolve(path.join(pkg, 'package.json'));
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

        if (!packageJson.types) {
          try {
            await pacote.manifest(typePackage);

            typePackages.push(typePackage);
          } catch (error) {
            if (error.code !== 'E404') {
              console.error(`Error finding package: ${typePackage}`);
            }
          }
        } else {
          console.log('package already includes types');
        }
      } catch (error) {
        console.error(`${chalk.red('error')} unable to read package.json: error.message`);
      }
    }
  }

  if (typePackages.length > 0) {
    console.log(`\n${chalk.blue('info')} Installing types: ${typePackages.join(' ')}`);

    await runYarn('add', '--dev', ...typePackages);
  }
};

export { add };
