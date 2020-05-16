import { PackageJson } from '../lib/package';
import { runYarn } from '../lib/yarn';

const remove = async (packageJson: PackageJson, packages: string[]): Promise<void> => {
  const typePackages = [];

  if (packageJson.devDependencies) {
    for (const pkg of packages) {
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
};

export { remove };
