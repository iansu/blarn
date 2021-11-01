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
    console.error(`${chalk.red('error')} blarn in not compatible with Yarn 2`);

    process.exit(1);
  }

  return packageJson;
};

const printVersion = async (): Promise<void> => {
  const packageJson = getPackageJson(__dirname);
  const { stdout: yarnVersion } = await execa('yarn', ['--version']);

  console.log(`Blarn version: ${packageJson.version}`);
  console.log(`Yarn version: ${yarnVersion}`);
};

export { preflightCheck, printVersion };
