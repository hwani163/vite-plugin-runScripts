import { exec } from 'node:child_process';
import fs from 'node:fs';

import prettier from 'prettier';

export default function writeFile(path: string, str: string) {
  return new Promise((rs) => {
    fs.writeFile(path, '/* eslint-disable */\n' + prettier.format(str, { filepath: path }), () => {
      rs(true);
    });
  });
}
