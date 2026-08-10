import { promises as fs } from 'node:fs';
import { renderHomeV6 } from './render-v8-home-v6.mjs';
import { renderCirclesPrimary } from './render-v8-circles-primary.mjs';
import { renderPracticesPrimary } from './render-v8-practices-primary.mjs';

const originalWriteFile = fs.writeFile.bind(fs);

fs.writeFile = async (file, data, ...rest) => {
  const name = String(file);
  if (name.endsWith('/dist/index.html') || name.endsWith('\\dist\\index.html')) {
    data = renderHomeV6(String(data));
  } else if (name.endsWith('/dist/circles.html') || name.endsWith('\\dist\\circles.html')) {
    data = renderCirclesPrimary(String(data));
  } else if (name.endsWith('/dist/practices.html') || name.endsWith('\\dist\\practices.html')) {
    data = renderPracticesPrimary(String(data));
  }
  return originalWriteFile(file, data, ...rest);
};
