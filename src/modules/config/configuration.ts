import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

import * as yaml from 'js-yaml';

const CONFIG_FILE_NAME = 'config.yaml';
const CONFIG_LOCAL_FILE_NAME = 'config.local.yaml';

export function configurationLoader(): Record<string, unknown> {
  const rootDir = process.cwd();
  const configPath = join(rootDir, 'config', CONFIG_FILE_NAME);
  const localConfigPath = join(rootDir, 'config', CONFIG_LOCAL_FILE_NAME);

  let config: Record<string, unknown> = {};

  if (existsSync(configPath)) {
    try {
      const fileContents = readFileSync(configPath, 'utf8');
      const loadedConfig = yaml.load(fileContents) as Record<string, unknown>;
      config = { ...config, ...loadedConfig };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`Failed to parse config file: ${configPath}`, e);
    }
  }

  if (existsSync(localConfigPath)) {
    try {
      const localFileContents = readFileSync(localConfigPath, 'utf8');
      const loadedLocalConfig = yaml.load(localFileContents) as Record<string, unknown>;
      config = { ...config, ...loadedLocalConfig };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`Failed to parse local config file: ${localConfigPath}`, e);
    }
  }

  // Merge with process.env variables to prioritize environment overrides
  return {
    ...config,
    ...process.env,
  };
}
