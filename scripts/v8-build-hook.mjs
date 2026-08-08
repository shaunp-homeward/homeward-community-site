import { promises as fs } from 'node:fs';
import { renderHomeV8, renderCirclesV8 } from './render-v8-front-door.mjs';

const originalWriteFile = fs.writeFile.bind(fs);

fs.writeFile = async (file, data, ...rest) => {
  const name = String(file);
  if (name.endsWith('/dist/index.html') || name.endsWith('\\dist\\index.html')) {
    data = renderHomeV8(String(data));
  } else if (name.endsWith('/dist/circles.html') || name.endsWith('\\dist\\circles.html')) {
    data = renderCirclesV8(String(data));
  }
  return originalWriteFile(file, data, ...rest);
};
