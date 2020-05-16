import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import yarnConfig from 'yarn-config-directory';

import { getSymlinks } from '../lib/symlink';

const linkable = async (): Promise<void> => {
  const linkPath = path.join(yarnConfig(), 'link');

  if (!fs.existsSync(linkPath)) {
    console.log('No linkable packages');
  }

  const symlinks = getSymlinks(linkPath);
  const linkablePackages = symlinks.map(symlink => ({
    name: symlink.name.replace(`${linkPath}/`, ''),
    target: symlink.target
  }));

  if (linkablePackages.length > 0) {
    linkablePackages.sort((a, b) => (a.name > b.name ? 1 : -1));

    for (const pkg of linkablePackages) {
      console.log(chalk.magenta(pkg.name), '->', pkg.target);
    }
  } else {
    console.log('No linkable packages');
  }
};

export { linkable };
