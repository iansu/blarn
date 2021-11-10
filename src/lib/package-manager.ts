import fs from 'fs';
import chalk from 'chalk';
import execa from 'execa';

let npmOrYarn: string;
let npmCommands = [
  'access',
  'adduser',
  'audit',
  'bin',
  'bugs',
  'cache',
  'ci',
  'completion',
  'config',
  'dedupe',
  'deprecate',
  'diff',
  'dist-tag',
  'docs',
  'doctor',
  'edit',
  'exec',
  'explain',
  'explore',
  'find-dupes',
  'fund',
  'get',
  'help',
  'hook',
  'init',
  'install',
  'install-ci-test',
  'install-test',
  'link',
  'll',
  'login',
  'logout',
  'ls',
  'org',
  'outdated',
  'owner',
  'pack',
  'ping',
  'pkg',
  'prefix',
  'profile',
  'prune',
  'publish',
  'rebuild',
  'repo',
  'restart',
  'root',
  'run',
  'run-script',
  'search',
  'set',
  'set-script',
  'shrinkwrap',
  'star',
  'stars',
  'start',
  'stop',
  'team',
  'test',
  'token',
  'uninstall',
  'unpublish',
  'unstar',
  'update',
  'version',
  'view',
  'whoami',
];

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

const parseNpmCommands = (helpText: string): string[] => {
  const commandsText = helpText.match(/All commands:\n\n([^]*)\n\nSpecify/m);

  if (commandsText?.[1]) {
    npmCommands = [...commandsText[1].replace(/[\s]/gm, '').split(','), 'run'];
  }

  return npmCommands;
};

const getNpmCommands = async (): Promise<string[]> => {
  if (npmCommands && npmCommands.length > 0) {
    return npmCommands;
  } else {
    try {
      const { stdout } = await execa('npm', ['--help']);

      return parseNpmCommands(stdout);
    } catch (error) {
      if (error.stdout) {
        return parseNpmCommands(error.stdout);
      } else {
        throw error;
      }
    }
  }
};

const runPackageManager = async (npmArgs: string[], yarnArgs?: string[]): Promise<void> => {
  try {
    if (isYarnOrNpm() === 'yarn') {
      await execa('yarn', yarnArgs ? yarnArgs : npmArgs, { stdio: 'inherit' });
    } else {
      await getNpmCommands();

      if (npmArgs[0] === 'add') {
        npmArgs[0] = 'install';
      } else if (npmArgs[0] === 'remove') {
        npmArgs[0] = 'uninstall';
      } else if (!npmCommands.includes(npmArgs[0])) {
        npmArgs.unshift('run');
      }

      await execa('npm', npmArgs, { stdio: 'inherit' });
    }
  } catch (error) {
    console.error(chalk.red('error'), error.message);

    process.exit(error.exitCode);
  }
};

export { runPackageManager, isYarnOrNpm, isNpm, isYarn, isYarn1 };
