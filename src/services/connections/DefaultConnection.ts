import { Configuration, registerProvider } from "@tsed/di";
import { createConnection } from "@tsed/typeorm";
import { Connection, ConnectionOptions } from "typeorm";

export const DEFAULT_CONNECTION = Symbol.for("DEFAULT_CONNECTION");
export type DEFAULT_CONNECTION = Connection;

registerProvider({
  provide: DEFAULT_CONNECTION,
  deps: [Configuration],
  async useAsyncFactory(configuration: Configuration) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const settings = configuration.get<ConnectionOptions[]>("typeorm")!;
    const connectionOptions = settings.find((o) => o.name === "default");

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return createConnection(connectionOptions!);
  }
});
