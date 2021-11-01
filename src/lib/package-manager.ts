import fs from 'fs';
import chalk from 'chalk';
import execa from 'execa';

let npmOrYarn: string;

const isYarnOrNpm = (): string => {
  if (npmOrYarn) {
    return npmOrYarn;
  }

  if (fs.existsSync('yarn.lock')) {
    npmOrYarn = 'yarn';

    return 'yarn';
  } else if (fs.existsSync('package-lock.json')) {
    npmOrYarn = 'npm';

    return 'npm';
  } else {
    console.error(`${chalk.red('error')} no lockfile found`);

    process.exit(1);
  }
};

const isYarn = (): boolean => {
  return isYarnOrNpm() === 'yarn';
};

const isNpm = (): boolean => {
  return isYarnOrNpm() === 'npm';
};

const isYarn1 = async (): Promise<boolean> => {
  if (isYarnOrNpm() === 'yarn') {
    const { stdout } = await execa('yarn', ['--version']);

    return stdout.startsWith('1.');
  }

  return false;
};

const runPackageManager = async (npmArgs: string[], yarnArgs?: string[]): Promise<void> => {
  try {
    if (isYarnOrNpm() === 'yarn') {
      await execa('yarn', yarnArgs ? yarnArgs : npmArgs, { stdio: 'inherit' });
    } else {
      await execa('npm', npmArgs, { stdio: 'inherit' });
    }
  } catch (error) {
    process.exit(error.exitCode);
  }
};

export { runPackageManager, isYarnOrNpm, isNpm, isYarn, isYarn1 };
