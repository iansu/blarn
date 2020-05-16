import chalk from 'chalk';
import updateNotifier from 'update-notifier';

import { getPackageJson, PackageJson } from './lib/package';
import { printVersion, isYarn1, runYarn } from './lib/yarn';
import { isTypeScriptProject } from './lib/typescript';

import { add } from './commands/add';
import { linkable } from './commands/linkable';
import { linked } from './commands/linked';
import { remove } from './commands/remove';
import { unlink } from './commands/unlink';
import { unlinkAll } from './commands/unlink-all';

const app = async (): Promise<void> => {
  const command = process.argv[2];
  const args = process.argv.slice(3);

  let packageJson: PackageJson;

  updateNotifier({ pkg: getPackageJson(__dirname) }).notify();

  if (command === '--version' || command === '-v') {
    await printVersion();

    return;
  }

  if (!(await isYarn1())) {
    console.error(`${chalk.red('error')} blarn in not compatible with Yarn 2`);

    return;
  }

  if (command === 'linkable') {
    await linkable();

    return;
  }

  try {
    packageJson = getPackageJson(process.cwd());
  } catch (error) {
    console.error(`${chalk.red('error')} not a node package`);

    return;
  }

  if (command === 'remove' && isTypeScriptProject(packageJson)) {
    await remove(packageJson, args);

    return;
  } else if (command === 'linked') {
    await linked();

    return;
  } else if (command === 'unlink') {
    await unlink(args);

    return;
  } else if (command === 'unlink-all') {
    await unlinkAll();

    return;
  }

  await runYarn(...process.argv.slice(2));

  if (command === 'add' && isTypeScriptProject(packageJson)) {
    await add(args);
  }
};

export default app;
