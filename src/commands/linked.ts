import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

import { getSymlinks } from '../lib/symlink';

const linked = async (): Promise<void> => {
  const searchPath = path.join(process.cwd(), 'node_modules');

  if (!fs.existsSync(searchPath)) {
    console.error(`${chalk.red('error')} not a node package`);
  }

  const symlinks = getSymlinks(searchPath);
  const linkedPackages = symlinks
    .filter(symlink => !symlink.name.includes('.bin'))
    .map(symlink => ({
      name: symlink.name.replace(`${searchPath}/`, ''),
      target: symlink.target
    }));

  if (linkedPackages.length > 0) {
    linkedPackages.sort((a, b) => (a.name > b.name ? 1 : -1));

    for (const pkg of linkedPackages) {
      console.log(chalk.magenta(pkg.name), '->', pkg.target);
    }
  } else {
    console.log('No linked packages');
  }
};

export { linked };
