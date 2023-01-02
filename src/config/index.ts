import { readFileSync } from "fs";
const pkg = JSON.parse(readFileSync("./package.json", { encoding: "utf8" }));

export const config: Partial<TsED.Configuration> = {
  version: pkg.version
  // s3 config is being used directly in the module
  // additional shared configuration
};
