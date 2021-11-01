import { runPackageManager } from '../lib/package-manager';

const unlink = async (args: string[]): Promise<void> => {
  await runPackageManager(['unlink', ...args]);
  await runPackageManager(['install --force'], ['--force']);
};

export { unlink };
