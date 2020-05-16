import fs from 'fs';
import path from 'path';

interface Symlink {
  name: string;
  target: string;
}

const getSymlinks = (directory: string): Symlink[] => {
  const symlinks: Symlink[] = [];
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isSymbolicLink()) {
      symlinks.push({
        name: path.join(directory, entry.name),
        target: fs.realpathSync(path.join(directory, entry.name))
      });
    } else if (entry.isDirectory()) {
      symlinks.push(...getSymlinks(path.join(directory, entry.name)));
    }
  }

  return symlinks;
};

export { getSymlinks };
