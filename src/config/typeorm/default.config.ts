import { env } from "process";
export const name = "default";
export const type = env.TYPEORM_CONNECTION;
export const host = env.TYPEORM_HOST;
export const port = env.TYPEORM_PORT;
export const username = env.TYPEORM_USERNAME;
export const password = env.TYPEORM_PASSWORD;
export const database = env.TYPEORM_DATABASE;
export const synchronize = true;
export const logging = false;
export const entities = ["${rootDir}/models/**/*.js"];
export const migrations = ["${rootDir}/migrations/**/*.js"];
export const subscribers = ["${rootDir}/subscribers/**/*.js"];
export const cli = {
  entitiesDir: "${rootDir}/models",
  migrationsDir: "${rootDir}/migrations",
  subscribersDir: "${rootDir}/subscribers"
};
