import execa from 'execa';

import { getPackageJson } from './package';

const printVersion = async (): Promise<void> => {
  const packageJson = getPackageJson(__dirname);
  const { stdout: yarnVersion } = await execa('yarn', ['--version']);

  console.log(`Blarn version: ${packageJson.version}`);
  console.log(`Yarn version: ${yarnVersion}`);
};

const isYarn1 = async (): Promise<boolean> => {
  const { stdout } = await execa('yarn', ['--version']);

  return stdout.startsWith('1.');
};

const runYarn = async (...args: string[]): Promise<void> => {
  try {
    await execa('yarn', args, { stdio: 'inherit' });
  } catch (error) {
    process.exit(error.exitCode);
  }
};

export { printVersion, isYarn1, runYarn };
