import chalk from 'chalk';
import execa from 'execa';

import { getPackageJson, PackageJson } from './package';
import { isYarnOrNpm, isYarn1 } from './package-manager';

const preflightCheck = async (): Promise<PackageJson> => {
  let packageJson: PackageJson;

  try {
    packageJson = getPackageJson(process.cwd());
  } catch (error) {
    console.error(`${chalk.red('error')} not a node package`);

    process.exit(1);
  }

  if (isYarnOrNpm() === 'yarn' && !(await isYarn1())) {
    console.error(`${chalk.red('error')} Blarn in not compatible with Yarn >=2`);

    process.exit(1);
  }

  return packageJson;
};

const printVersion = async (): Promise<void> => {
  const packageJson = getPackageJson(__dirname);
  let yarnVersion;
  let npmVersion;

  try {
    const { stdout } = await execa('yarn', ['--version']);

    yarnVersion = stdout;
  } catch {
    yarnVersion = 'unknown';
  }

  try {
    const { stdout } = await execa('npm', ['--version']);

    npmVersion = stdout;
  } catch {
    npmVersion = 'unknown';
  }

  console.log(`Blarn version: ${packageJson.version}`);
  console.log(`Yarn version: ${yarnVersion}`);
  console.log(`npm version: ${npmVersion}`);
};

export { preflightCheck, printVersion };
