//@ts-nocheck
import fs from 'node:fs';
const readDir = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(readDir(file));
    } else {
      results.push(file);
    }
  });
  return results;
};

export default readDir;
