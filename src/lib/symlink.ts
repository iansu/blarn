import fs from 'fs';
import path from 'path';

interface Symlink {
  name: string;
  target?: string;
  targetExists: boolean;
}

const getSymlinks = (directory: string): Symlink[] => {
  const symlinks: Symlink[] = [];
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isSymbolicLink()) {
      try {
        const target = fs.realpathSync(path.join(directory, entry.name));

        symlinks.push({
          name: path.join(directory, entry.name),
          target,
          targetExists: true
        });
      } catch (error) {
        symlinks.push({
          name: path.join(directory, entry.name),
          targetExists: false
        });
      }
    } else if (entry.isDirectory()) {
      symlinks.push(...getSymlinks(path.join(directory, entry.name)));
    }
  }

  return symlinks;
};

export { getSymlinks };
