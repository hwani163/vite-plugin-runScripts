import debounce from 'lodash/debounce';

import type { ViteMode } from './utils/viteModes';
import type { Plugin } from 'vite';

import { debugLog } from './utils/debugLog';
import { isServeMode, isBuildMode } from './utils/viteModes';

export type RunScriptOption = {
  name: string;
  run: (env?: RunOption) => Promise<void>;
  matcher: (path: string) => boolean;
};
export type RunOption = {
  env: EnvType;
};
type EnvType = Record<string, unknown>;

export function runScripts(options: RunScriptOption[]): Plugin {
  let viteMode: ViteMode;
  const enableWatcher = true;
  let env: Record<string, unknown>;
  const runAll = async (env: EnvType, path?: string) => {
    return Promise.all(
      options.map(async (option) => {
        if (path === undefined || option.matcher(path)) {
          debugLog(option.name);
          const result = await option.run({ env });

          return result;
        }
        return null;
      }),
    );
  };

  return {
    name: 'run-scripts',
    async config(_config, env) {
      viteMode = env.command;
    },
    async configResolved(_config) {
      env = _config.env;
    },
    async buildStart() {
      const isServe = isServeMode(viteMode);
      const isBuild = isBuildMode(viteMode);
      try {
        if (isServe) await runAll(env);
        if (isBuild) await runAll(env);
      } catch (error) {
        if (isBuild) throw error;
      }
    },
    configureServer(server) {
      if (!enableWatcher) return;

      const listener = async (filePath = '') => {
        await runAll(env, filePath);
      };
      const debounced = debounce(listener, 100);

      server.watcher.on('add', debounced);
      server.watcher.on('addDir', debounced);
      server.watcher.on('unlink', debounced);
      server.watcher.on('unlinkDir', debounced);
    },
  };
}
