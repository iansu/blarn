import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import yarnConfig from 'yarn-config-directory';

import { getSymlinks } from '../lib/symlink';
import { isYarn } from '../lib/package-manager';

const linkable = async (): Promise<void> => {
  let linkPath: string;

  if (isYarn()) {
    linkPath = path.join(yarnConfig(), 'link');
  } else {
    if (!process.env.npm_config_prefix) {
      console.error(`${chalk.red('error')} can't determine npm config prefix`);

      process.exit(1);
    }

    linkPath = path.join(process.env.npm_config_prefix, 'lib', 'node_modules');
  }

  if (!fs.existsSync(linkPath)) {
    console.log('No linkable packages');
  }

  const symlinks = getSymlinks(linkPath);
  const linkablePackages = symlinks
    .map((symlink) => ({
      name: symlink.name.replace(`${linkPath}/`, ''),
      target: symlink.target,
    }))
    .filter((pkg) => !pkg.name.includes('/.bin/'))
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  if (linkablePackages.length > 0) {
    for (const pkg of linkablePackages) {
      console.log(chalk.magenta(pkg.name), '->', pkg.target);
    }
  } else {
    console.log('No linkable packages');
  }
};

export { linkable };
