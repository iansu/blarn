import updateNotifier from 'update-notifier';

import { getPackageJson } from './lib/package';
import { preflightCheck, printVersion } from './lib/preflight';
import { isNpm, runPackageManager } from './lib/package-manager';
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

  updateNotifier({ pkg: getPackageJson(__dirname) }).notify();

  if (command === '--version' || command === '-v') {
    await printVersion();

    return;
  }

  if (command === 'linkable') {
    await linkable();

    return;
  }

  const packageJson = await preflightCheck();

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

  if (isNpm() && process.argv.slice(2).length === 0) {
    await runPackageManager(['install']);
  } else {
    await runPackageManager(process.argv.slice(2));
  }

  if (command === 'add' && isTypeScriptProject(packageJson)) {
    await add(args);
  }
};

export default app;
