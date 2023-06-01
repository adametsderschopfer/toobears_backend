import { promisify } from 'util';
import { readFile } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const readFileAsync = promisify(readFile);
const __dirname = dirname(fileURLToPath(import.meta.url));

export const readSource = async (relativePath) => {
  const filePath = join(__dirname, relativePath);
  return await readFileAsync(filePath, 'utf8');
}
