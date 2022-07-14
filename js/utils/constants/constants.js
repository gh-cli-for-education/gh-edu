import path from 'path';
import { homedir } from 'os';
export const remoteConfigName = "gh-edu-profile";
export const configName = "data.json";
export const configDir = path.join(homedir(), ".config", "gh-edu");
export const configPath = path.join(configDir, configName);
