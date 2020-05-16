import { runYarn } from '../lib/yarn';

const unlink = async (args: string[]): Promise<void> => {
  await runYarn('unlink', ...args);
  await runYarn('--force');
};

export { unlink };
