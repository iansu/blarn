import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

import { runPackageManager } from '../lib/package-manager';
import { getSymlinks } from '../lib/symlink';

const unlinkAll = async (): Promise<void> => {
  const searchPath = path.join(process.cwd(), 'node_modules');

  if (!fs.existsSync(searchPath)) {
    console.error(`${chalk.red('error')} not a node package`);
  }

  const symlinks = getSymlinks(searchPath);
  const linkedPackages = symlinks
    .filter((symlink) => !symlink.name.includes('.bin'))
    .map((symlink) => ({
      name: symlink.name.replace(`${searchPath}/`, ''),
      target: symlink.target,
    }));

  if (linkedPackages.length > 0) {
    const unlinkPackages = [];

    linkedPackages.sort((a, b) => (a.name > b.name ? 1 : -1));

    for (const pkg of linkedPackages) {
      unlinkPackages.push(pkg.name);
    }

    await runPackageManager(['unlink', ...unlinkPackages]);
    await runPackageManager(['install --force'], ['--force']);
  } else {
    console.log('No linked packages');
  }
};

export { unlinkAll };
