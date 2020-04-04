import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import execa from 'execa';
import pacote from 'pacote';
import findPackageJson from 'find-package-json';
import updateNotifier from 'update-notifier';

interface PackageJson {
  name: string;
  version: string;
  devDependencies?: {
    [key: string]: string;
  };
}

const getPackageJson = (startDirectory: string): PackageJson => {
  const finder = findPackageJson(startDirectory);
  const results = finder.next();

  if (results.filename) {
    return { name: '', version: '1.0.0', ...results.value };
  } else {
    throw new Error('Unable to find package.json');
  }
};

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

const isTypeScriptProject = (packageJson: PackageJson): boolean => {
  if (
    packageJson.devDependencies &&
    Object.keys(packageJson.devDependencies).includes('typescript')
  ) {
    return true;
  } else {
    return fs.existsSync(path.join(process.cwd(), 'tsconfig.json'));
  }
};

const runYarn = async (...args: string[]): Promise<void> => {
  try {
    await execa('yarn', args, { stdio: 'inherit' });
  } catch (error) {
    process.exit(error.exitCode);
  }
};

const app = async (): Promise<void> => {
  updateNotifier({ pkg: getPackageJson(__dirname) }).notify();

  if (process.argv[2] === '--version' || process.argv[2] === '-v') {
    await printVersion();

    return;
  }

  if (!(await isYarn1())) {
    console.error(`${chalk.red('error')} blarn in not compatible with Yarn 2`);

    return;
  }

  const packageJson = getPackageJson(process.cwd());

  if (process.argv[2] === 'remove' && isTypeScriptProject(packageJson)) {
    const typePackages = [];

    if (packageJson.devDependencies) {
      for (const pkg of process.argv.slice(3)) {
        if (!pkg.startsWith('-') && !pkg.startsWith('--') && !pkg.startsWith('@types')) {
          let typePackage = `@types/${pkg}`;

          if (pkg.startsWith('@')) {
            const [org, packageName] = pkg.slice(1).split('/');

            typePackage = `@types/${org}__${packageName}`;
          }

          if (Object.keys(packageJson.devDependencies).includes(typePackage)) {
            typePackages.push(typePackage);
          }
        }
      }
    }

    await runYarn('remove', ...process.argv.slice(3), ...typePackages);

    return;
  }

  await runYarn(...process.argv.slice(2));

  if (process.argv[2] === 'add' && isTypeScriptProject(packageJson)) {
    const typePackages = [];

    for (const pkg of process.argv.slice(3)) {
      if (!pkg.startsWith('-') && !pkg.startsWith('--') && !pkg.startsWith('@types')) {
        let typePackage = `@types/${pkg}`;

        if (pkg.startsWith('@')) {
          const [org, packageName] = pkg.slice(1).split('/');

          typePackage = `@types/${org}__${packageName}`;
        }

        try {
          await pacote.manifest(typePackage);

          typePackages.push(typePackage);
        } catch (error) {
          if (error.code !== 'E404') {
            console.error(`Error finding package: ${typePackage}`);
          }
        }
      }
    }

    if (typePackages.length > 0) {
      console.log(`\n${chalk.blue('info')} Installing types: ${typePackages.join(' ')}`);

      await runYarn('add', '--dev', ...typePackages);
    }
  }
};

export default app;
