import { PackageJson } from '../lib/package';
import { runPackageManager } from '../lib/package-manager';

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

  await runPackageManager(['remove', ...process.argv.slice(3), ...typePackages]);
};

export { remove };
